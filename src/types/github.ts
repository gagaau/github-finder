export type GitHubUser = {
  avatar_url: string;
  name: string | null;
  login: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string;
  created_at: string;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
};

export type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  updated_at: string;
  fork: boolean;
};
