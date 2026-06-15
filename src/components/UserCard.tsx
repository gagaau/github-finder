import type { GitHubUser } from "../types/github";

type UserCardProps = {
  user: GitHubUser;
};

function UserCard({ user }: UserCardProps) {
  return (
    <section className="user-card">
      <div className="user-main-info">
        <img src={user.avatar_url} alt={`Avatar de ${user.login}`} />

        <div>
          <h2>{user.name || "Nome não informado"}</h2>
          <p className="username">@{user.login}</p>
          <p className="bio">{user.bio || "Bio não informada."}</p>

          <p className="location">
            Localização: {user.location || "Não informada"}
          </p>

          <a href={user.html_url} target="_blank" rel="noreferrer">
            Abrir perfil no GitHub
          </a>
        </div>
      </div>

      <div className="user-stats">
        <div>
          <strong>{user.followers}</strong>
          <span>Seguidores</span>
        </div>

        <div>
          <strong>{user.following}</strong>
          <span>Seguindo</span>
        </div>

        <div>
          <strong>{user.public_repos}</strong>
          <span>Repositórios</span>
        </div>
      </div>
    </section>
  );
}

export default UserCard;