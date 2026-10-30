import type { FormEvent } from "react";

type SearchFormProps = {
  username: string;
  isLoading: boolean;
  onUsernameChange: (value: string) => void;
  onSearch: () => void;
};

function SearchForm({
  username,
  isLoading,
  onUsernameChange,
  onSearch,
}: SearchFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form
      className="search-form"
      onSubmit={handleSubmit}
      role="search"
    >
      <input
        id="github-username"
        name="username"
        type="search"
        aria-label="Nome de usuário do GitHub"
        placeholder="Digite um usuário do GitHub"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        value={username}
        onChange={(event) => onUsernameChange(event.target.value)}
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Buscando..." : "Buscar usuário"}
      </button>
    </form>
  );
}

export default SearchForm;