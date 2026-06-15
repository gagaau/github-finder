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
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Digite um usuário do GitHub"
        value={username}
        onChange={(event) => onUsernameChange(event.target.value)}
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Buscando..." : "Buscar"}
      </button>
    </form>
  );
}

export default SearchForm;