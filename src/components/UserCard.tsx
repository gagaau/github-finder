import type { GitHubUser } from "../types/github";

type UserCardProps = {
  user: GitHubUser;
};

const numberFormatter = new Intl.NumberFormat("pt-BR");

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function UserCard({ user }: UserCardProps) {
  const website = user.blog.trim();

  const websiteUrl = website.startsWith("http://") ||
    website.startsWith("https://")
    ? website
    : `https://${website}`;

  const joinDate = dateFormatter.format(new Date(user.created_at));

  return (
    <section className="user-card" aria-labelledby="profile-title">
      <div className="user-main-info">
        <img
          src={user.avatar_url}
          alt={`Avatar de ${user.login}`}
          width={116}
          height={116}
        />

        <div>
          <h2 id="profile-title">
            {user.name || `@${user.login}`}
          </h2>

          {user.name && (
            <p className="username">@{user.login}</p>
          )}

          {user.bio && (
            <p className="bio">{user.bio}</p>
          )}

          {user.company && (
            <p className="location">
              Empresa: {user.company}
            </p>
          )}

          {user.location && (
            <p className="location">
              Localização: {user.location}
            </p>
          )}

          <p className="location">
            No GitHub desde {joinDate}
          </p>

          {website && (
            <p className="location">
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visitar site pessoal
              </a>
            </p>
          )}

          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir o perfil de ${user.login} no GitHub`}
          >
            Abrir perfil no GitHub
          </a>
        </div>
      </div>

      <div className="user-stats">
        <div>
          <strong>{numberFormatter.format(user.followers)}</strong>
          <span>Seguidores</span>
        </div>

        <div>
          <strong>{numberFormatter.format(user.following)}</strong>
          <span>Seguindo</span>
        </div>

        <div>
          <strong>{numberFormatter.format(user.public_repos)}</strong>
          <span>Repositórios públicos</span>
        </div>
      </div>
    </section>
  );
}

export default UserCard;