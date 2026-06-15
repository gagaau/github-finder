type ThemeToggleProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

function ThemeToggle({ theme, onToggleTheme }: ThemeToggleProps) {
  return (
    <button className="theme-toggle" type="button" onClick={onToggleTheme}>
      {theme === "light" ? "Modo escuro" : "Modo claro"}
    </button>
  );
}

export default ThemeToggle;