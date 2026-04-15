import { useState } from "react";
import "./SortFilter.css";

function SortFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOverlay, setIsOverlay] = useState(true);

  return (
    <>
      <button
        type="button"
        className={isOverlay ? "overlay overlay-open" : "overlay"}
        onClick={() => {
          setIsOpen(true);
          setIsOverlay(false);
        }}
        onKeyUp={() => {
          setIsOpen(true);
          setIsOverlay(false);
        }}
      >
        <p className="overlay-title">Trier</p>
        <p className="overlay-title">Filtrer</p>
      </button>

      <aside
        className={isOpen ? "search-aside search-aside-open" : "search-aside"}
      >
        <button
          type="button"
          className="close-mobile-menu"
          onClick={() => {
            setIsOpen(false);
            setIsOverlay(true);
          }}
          onKeyUp={() => {
            setIsOpen(false);
            setIsOverlay(true);
          }}
        >
          X
        </button>
        <details>
          <summary className="sort-filter-title">Trier</summary>
          <div className="sort-options-container">
            <div className="sort-option">
              <span>Popularité</span>
              <div className="sort-buttons-container">
                <button type="button" className="sort-button">
                  ↑
                </button>
                <button type="button" className="sort-button">
                  ↓
                </button>
              </div>
            </div>
            <div className="sort-option">
              <span>Date de sortie</span>
              <div className="sort-buttons-container">
                <button type="button" className="sort-button">
                  ↑
                </button>
                <button type="button" className="sort-button">
                  ↓
                </button>
              </div>
            </div>
            <div className="sort-option">
              <span>Note</span>
              <div className="sort-buttons-container">
                <button type="button" className="sort-button">
                  ↑
                </button>
                <button type="button" className="sort-button">
                  ↓
                </button>
              </div>
            </div>
          </div>
        </details>

        <details>
          <summary className="sort-filter-title">Filtrer</summary>
          <div className="filter-options-container">
            <input type="text" placeholder="Rechercher..." id="search-input" />

            <details>
              <summary className="sort-filter-title">Genres</summary>
              <div className="filter-list">
                <label>
                  <input
                    type="checkbox"
                    value="comédie"
                    className="search-checkbox"
                  />{" "}
                  Comédie
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="action"
                    className="search-checkbox"
                  />{" "}
                  Action
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="romance"
                    className="search-checkbox"
                  />{" "}
                  Romance
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Sci-Fi"
                    className="search-checkbox"
                  />{" "}
                  Sci-Fi
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Drame"
                    className="search-checkbox"
                  />{" "}
                  Drame
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="animation"
                    className="search-checkbox"
                  />{" "}
                  Animation
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="guerre"
                    className="search-checkbox"
                  />{" "}
                  Guerre
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Aventure"
                    className="search-checkbox"
                  />{" "}
                  Aventure
                </label>
              </div>
            </details>

            <details>
              <summary className="sort-filter-title">Types</summary>
              <div className="filter-list">
                <label>
                  <input
                    type="checkbox"
                    value="films"
                    className="search-checkbox"
                  />{" "}
                  Films
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="series"
                    className="search-checkbox"
                  />{" "}
                  Séries
                </label>
              </div>
            </details>
          </div>
        </details>
        <button type="submit" id="btn-search-submit">
          Rechercher
        </button>
      </aside>
    </>
  );
}

export default SortFilter;
