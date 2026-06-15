import type { GitHubRepo } from "../types/github";

type RepoListProps = {
  repos: GitHubRepo[];
};

function RepoList({ repos }: RepoListProps) {
  if (repos.length === 0) {
    return (
      <section className="repo-section">
        <h2>Repositórios</h2>
        <p className="empty-message">
          Esse usuário não possui repositórios públicos para mostrar.
        </p>
      </section>
    );
  }

  return (
    <section className="repo-section">
      <h2>Repositórios recentes</h2>

      <div className="repo-list">
        {repos.map((repo) => (
          <article className="repo-card" key={repo.id}>
            <div>
              <h3>{repo.name}</h3>
              <p>{repo.description || "Sem descrição."}</p>
            </div>

            <div className="repo-info">
              <span>{repo.language || "Linguagem não informada"}</span>
              <span>⭐ {repo.stargazers_count}</span>
            </div>

            <a href={repo.html_url} target="_blank" rel="noreferrer">
              Abrir repositório
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RepoList;