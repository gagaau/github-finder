import { useEffect, useRef, useState } from "react";
import SearchForm from "./components/SearchForm";
import UserCard from "./components/UserCard";
import RepoList from "./components/RepoList";
import ThemeToggle from "./components/ThemeToggle";
import type { GitHubRepo, GitHubUser } from "./types/github";

type Theme = "light" | "dark";

function getApiErrorMessage(response: Response, isUserSearch: boolean) {
  if (response.status === 404) {
    if (isUserSearch) {
      return "Usuário não encontrado. Confira o nome e tente novamente.";
    }

    return "Não foi possível encontrar os repositórios desse usuário.";
  }

  if (response.status === 403 || response.status === 429) {
    if (response.headers.get("x-ratelimit-remaining") === "0") {
      return "O limite de consultas da API foi atingido. Tente novamente mais tarde.";
    }

    return "O GitHub limitou temporariamente as consultas. Tente novamente mais tarde.";
  }

  if (response.status >= 500) {
    return "O GitHub está com problemas no momento. Tente novamente mais tarde.";
  }

  return "Não foi possível buscar os dados do GitHub.";
}

function App() {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("github-finder-last-username") || "";
  });

  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const [theme, setTheme] = useState<Theme>(() => {
    return localStorage.getItem("github-finder-theme") === "dark"
      ? "dark"
      : "light";
  });

  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);

    localStorage.setItem("github-finder-theme", theme);
  }, [theme]);

  useEffect(() => {
    return () => {
      requestRef.current?.abort();
    };
  }, []);

  async function handleSearch() {
    const cleanUsername = username.trim();

    if (cleanUsername === "") {
      setErrorMessage("Digite um nome de usuário antes de buscar.");
      setUser(null);
      setRepos([]);
      setHasSearched(true);
      return;
    }

    requestRef.current?.abort();

    const controller = new AbortController();
    requestRef.current = controller;

    setIsLoading(true);
    setErrorMessage("");
    setHasSearched(true);
    setUser(null);
    setRepos([]);

    try {
      const userResponse = await fetch(
        `https://api.github.com/users/${encodeURIComponent(cleanUsername)}`,
        { signal: controller.signal }
      );

      if (!userResponse.ok) {
        throw new Error(getApiErrorMessage(userResponse, true));
      }

      const userData: GitHubUser = await userResponse.json();

      const reposResponse = await fetch(
        `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?sort=updated&per_page=100`,
        { signal: controller.signal }
      );

      if (!reposResponse.ok) {
        throw new Error(getApiErrorMessage(reposResponse, false));
      }

      const reposData: GitHubRepo[] = await reposResponse.json();

      if (controller.signal.aborted) {
        return;
      }

      setUser(userData);
      setRepos(reposData);

      localStorage.setItem(
        "github-finder-last-username",
        cleanUsername
      );
    } 
    
    catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      if (error instanceof TypeError) {
        setErrorMessage(
          "Não foi possível conectar ao GitHub. Verifique sua conexão."
        );
      }
      else if (error instanceof Error) {
        setErrorMessage(error.message);
      }
      else {
        setErrorMessage("Ocorreu um erro inesperado.");
      }
    } 
    
    finally {
      if (requestRef.current === controller) {
        requestRef.current = null;
        setIsLoading(false);
      }
    }
  }

  function handleToggleTheme() {
    if (theme === "light") {
      setTheme("dark");
    }
    else {
      setTheme("light");
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="app-label">EXPLORE O GITHUB</p>

          <h1>GitHub Finder</h1>

          <p>
            Encontre desenvolvedores, explore seus projetos e descubra
            repositórios públicos no GitHub.
          </p>
        </div>

        <ThemeToggle
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      </header>

      <SearchForm
        username={username}
        isLoading={isLoading}
        onUsernameChange={setUsername}
        onSearch={handleSearch}
      />

      {isLoading && (
        <section className="status-card" role="status">
          <p>Buscando informações no GitHub...</p>
        </section>
      )}

      {!isLoading && errorMessage && (
        <section className="status-card error" role="alert">
          <p>{errorMessage}</p>
        </section>
      )}

      {!isLoading && !errorMessage && !hasSearched && (
        <section className="status-card">
          <p>
            Pesquise um usuário para começar. Experimente octocat,
            torvalds ou gaearon.
          </p>
        </section>
      )}

      {!isLoading && user && (
        <>
          <UserCard user={user} />
          <RepoList repos={repos} />
        </>
      )}
    </main>
  );
}

export default App;