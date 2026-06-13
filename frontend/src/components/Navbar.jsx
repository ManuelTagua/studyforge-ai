import { NavLink, Link } from 'react-router-dom';

function Navbar({ theme, onToggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <span className="brand-mark">SF</span>
        <span>StudyForge AI</span>
      </Link>

      <nav className="nav-links" aria-label="Navegación principal">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          Crear tema
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          Mis apuntes
        </NavLink>
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={isDark ? 'Modo claro' : 'Modo oscuro'}
        >
          <span aria-hidden="true">{isDark ? '☀' : '☾'}</span>
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
