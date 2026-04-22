import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Profil from "../../assets/images/emoji-action.png";
import Logo from "../../assets/images/Logo.png";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) return;

    navigate(`/rechercher/${encodeURIComponent(value)}`);
    setSearch("");
    setOpen(false);
  };

  return (
    <div className="navbar">
      <Link to="/" className="nav-title">
        <img src={Logo} className="nav-logo" alt="Logo" />
        <h1>POPCORN</h1>
      </Link>

      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        type="button"
      >
        {open ? "✕" : "☰"}
      </button>

      <nav>
        <ul className={`nav-ul ${open ? "active" : ""}`}>
          <li>
            <Link to="/rechercher/1" className="nav-li">
              FILMS
            </Link>
          </li>

          <li>
            <Link to="/rechercher/2" className="nav-li">
              SERIES
            </Link>
          </li>

          <li>
            <Link to="/seances" className="nav-li">
              SEANCES
            </Link>
          </li>
          <li className="nav-search-item">
            <form className="nav-search" onSubmit={handleSubmit}>
              <input
                className="nav-sch"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button type="submit" className="nav-button">
                🔍︎
              </button>
            </form>
          </li>
          <Link to="/favorites" className="nav-li">
            <img src={Profil} alt="profil-logo" className="logo-profil" />
          </Link>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
