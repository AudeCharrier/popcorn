import "./App.css";
import BoxMoodEmoji from "./components/BoxMoodEmoji/BoxMoodEmoji";

function App() {
  return (
    <>
      <header>
        <h1 className="logo">JS Monorepo</h1>
      </header>

      <nav className="navbar">
        <ul>
          <li>
            <a
              href="https://github.com/WildCodeSchool/create-js-monorepo"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </li>
        </ul>
      </nav>

      <main className="text-box">
        <hgroup className="block-primary">
          <h2 className="block-primary-main">JS Monorepo</h2>
          <p className="block-primary-sub">Votre framework JavaScript</p>
        </hgroup>

        {/* EMOJIS */}
        <BoxMoodEmoji />

        <p>Vous avez lu le README ?</p>
      </main>

      <footer>
        Développé par la{" "}
        <a
          href="https://www.wildcodeschool.com/"
          className="wcs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wild Code School
        </a>
      </footer>
    </>
  );
}

export default App;
