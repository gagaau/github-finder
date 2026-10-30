import { useState } from "react";
import type { GitHubRepo } from "../types/github";

type RepoListProps = {
  repos: GitHubRepo[];
};

type SortOption = "recent" | "stars" | "name";

const REPOS_PER_PAGE = 6;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

function RepoList({ repos }: RepoListProps) {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [hideForks, setHideForks] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const languages = Array.from(
    new Set(
      repos
        .map((repo) => repo.language)
        .filter((item): item is string => item !== null)
    )
  ).sort((a, b) => a.localeCompare(b));

  const filteredRepos = repos.filter((repo) => {
    const cleanSearch = search.trim().toLowerCase();

    const matchesSearch =
      repo.name.toLowerCase().includes(cleanSearch) ||
      (repo.description?.toLowerCase().includes(cleanSearch) ?? false);

    const matchesLanguage =
      language === "all" || repo.language === language;

    const matchesFork = !hideForks || !repo.fork;

    return matchesSearch && matchesLanguage && matchesFork;
  });

  const sortedRepos = [...filteredRepos];

  if (sortBy === "recent") {
    sortedRepos.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
    );
  }
  else if (sortBy === "stars") {
    sortedRepos.sort(
      (a, b) => b.stargazers_count - a.stargazers_count
    );
  }
  else {
    sortedRepos.sort((a, b) => a.name.localeCompare(b.name));
  }

  const totalPages = Math.ceil(sortedRepos.length / REPOS_PER_PAGE);

  const startIndex = (currentPage - 1) * REPOS_PER_PAGE;
  const visibleRepos = sortedRepos.slice(
    startIndex,
    startIndex + REPOS_PER_PAGE
  );

  const hasFilters =
    search !== "" ||
    language !== "all" ||
    sortBy !== "recent" ||
    hideForks;

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleLanguageChange(value: string) {
    setLanguage(value);
    setCurrentPage(1);
  }

  function handleSortChange(value: SortOption) {
    setSortBy(value);
    setCurrentPage(1);
  }

  function handleForkChange(value: boolean) {
    setHideForks(value);
    setCurrentPage(1);
  }

  function handleClearFilters() {
    setSearch("");
    setLanguage("all");
    setSortBy("recent");
    setHideForks(false);
    setCurrentPage(1);
  }

  if (repos.length === 0) {
    return (
      <section className="repo-section">
        <h2>Repositórios públicos</h2>
        <p className="empty-message">
          Esse usuário não possui repositórios públicos para mostrar.
        </p>
      </section>
    );
  }

  return (
    <section className="repo-section">
      <div className="repo-header">
        <h2>Repositórios públicos</h2>
        <span>{repos.length} carregados</span>
      </div>

      <div className="repo-controls">
        <div className="repo-filter">
          <label htmlFor="repo-search">Pesquisar</label>

          <input
            id="repo-search"
            type="search"
            placeholder="Nome ou descrição..."
            value={search}
            onChange={(event) =>
              handleSearchChange(event.target.value)
            }
          />
        </div>

        <div className="repo-filter">
          <label htmlFor="repo-language">Linguagem</label>

          <select
            id="repo-language"
            value={language}
            onChange={(event) =>
              handleLanguageChange(event.target.value)
            }
          >
            <option value="all">Todas</option>

            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="repo-filter">
          <label htmlFor="repo-sort">Ordenar por</label>

          <select
            id="repo-sort"
            value={sortBy}
            onChange={(event) =>
              handleSortChange(event.target.value as SortOption)
            }
          >
            <option value="recent">Atualização recente</option>
            <option value="stars">Mais estrelas</option>
            <option value="name">Nome (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="repo-results">
        <p>
          {filteredRepos.length}{" "}
          {filteredRepos.length === 1
            ? "repositório encontrado"
            : "repositórios encontrados"}
        </p>

        <label className="repo-fork-filter">
          <input
            type="checkbox"
            checked={hideForks}
            onChange={(event) =>
              handleForkChange(event.target.checked)
            }
          />
          Ocultar forks
        </label>

        {hasFilters && (
          <button type="button" onClick={handleClearFilters}>
            Limpar filtros
          </button>
        )}
      </div>

      {visibleRepos.length === 0 ? (
        <p className="empty-message">
          Nenhum repositório corresponde aos filtros selecionados.
        </p>
      ) : (
        <div className="repo-list">
          {visibleRepos.map((repo) => (
            <article className="repo-card" key={repo.id}>
              <div>
                <h3>{repo.name}</h3>
                <p>{repo.description || "Sem descrição."}</p>
              </div>

              <div className="repo-info">
                <span>{repo.language || "Não informada"}</span>

                <span>
                  ★ {numberFormatter.format(repo.stargazers_count)}
                </span>

                {repo.fork && <span>Fork</span>}
              </div>

              <p className="repo-updated">
                Atualizado em{" "}
                <time dateTime={repo.updated_at}>
                  {dateFormatter.format(new Date(repo.updated_at))}
                </time>
              </p>

              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir repositório
              </a>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="repo-pagination">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Anterior
          </button>

          <span>
            Página {currentPage} de {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Próxima
          </button>
        </div>
      )}
    </section>
  );
}

export default RepoList;