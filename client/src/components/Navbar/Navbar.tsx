import { useState } from "react";
import Logo from "../../assets/images/Logo.png";
import "./Navbar.css";
import { Link } from "react-router";

function Navbar() {
  const [open, setOpen] = useState(false);

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
            <Link to="/films" className="nav-li">
              FILMS
            </Link>
          </li>
          <li>
            <Link to="/series" className="nav-li">
              SERIES
            </Link>
          </li>
          <li>
            <Link to="/seances" className="nav-li">
              SEANCES
            </Link>
          </li>
          <li className="nav-search-item">
            <form className="nav-search">
              <input className="nav-sch" placeholder="Rechercher..." />
              <button className="nav-button" type="button">
                🔍︎
              </button>
            </form>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
