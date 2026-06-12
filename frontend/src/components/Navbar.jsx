import { NavLink, Link } from 'react-router-dom';

function Navbar() {
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
          Historial
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
