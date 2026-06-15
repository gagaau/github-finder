import { useEffect, useState } from "react";
import SearchForm from "./components/SearchForm";
import UserCard from "./components/UserCard";
import RepoList from "./components/RepoList";
import ThemeToggle from "./components/ThemeToggle";
import type { GitHubRepo, GitHubUser } from "./types/github";

type Theme = "light" | "dark";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedUsername = localStorage.getItem("github-finder-last-username");
    const savedTheme = localStorage.getItem("github-finder-theme");

    if (savedUsername) {
      setUsername(savedUsername);
    }

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("github-finder-theme", theme);
  }, [theme]);

  async function handleSearch() {
    const cleanUsername = username.trim();

    if (cleanUsername === "") {
      setErrorMessage("Digite um nome de usuário antes de buscar.");
      setUser(null);
      setRepos([]);
      setHasSearched(true);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setHasSearched(true);

      const userResponse = await fetch(
        `https://api.github.com/users/${cleanUsername}`
      );

      if (!userResponse.ok) {
        throw new Error("Usuário não encontrado.");
      }

      const userData: GitHubUser = await userResponse.json();

      const reposResponse = await fetch(
        `https://api.github.com/users/${cleanUsername}/repos?sort=updated&per_page=6`
      );

      if (!reposResponse.ok) {
        throw new Error("Não foi possível buscar os repositórios.");
      }

      const reposData: GitHubRepo[] = await reposResponse.json();

      setUser(userData);
      setRepos(reposData);
      localStorage.setItem("github-finder-last-username", cleanUsername);
    } catch {
      setUser(null);
      setRepos([]);
      setErrorMessage("Usuário não encontrado ou erro ao buscar dados.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleToggleTheme() {
    if (theme === "light") {
      setTheme("dark");
      return;
    }

    setTheme("light");
  }

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="app-label">Projeto React + TypeScript</p>
          <h1>GitHub Finder</h1>
          <p>
            Busque um usuário do GitHub e veja algumas informações do perfil e
            dos repositórios públicos.
          </p>
        </div>

        <ThemeToggle theme={theme} onToggleTheme={handleToggleTheme} />
      </header>

      <SearchForm
        username={username}
        isLoading={isLoading}
        onUsernameChange={setUsername}
        onSearch={handleSearch}
      />

      {isLoading && (
        <section className="status-card">
          <p>Buscando dados no GitHub...</p>
        </section>
      )}

      {!isLoading && errorMessage && (
        <section className="status-card error">
          <p>{errorMessage}</p>
        </section>
      )}

      {!isLoading && !errorMessage && !hasSearched && (
        <section className="status-card">
          <p>
            Digite um username acima para começar. Exemplo: octocat, torvalds ou
            gaearon.
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