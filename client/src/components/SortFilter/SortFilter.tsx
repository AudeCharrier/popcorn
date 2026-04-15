import { useState } from "react";
import "./SortFilter.css";

function SortFilter() {
  const sortOptions = [
    { name: "Popularité" },
    { name: "Date de sortie" },
    { name: "Note" },
  ];
  const genres = [
    { name: "Comédie" },
    { name: "Action" },
    { name: "Romance" },
    { name: "Sci-Fi" },
    { name: "Drame" },
    { name: "Animation" },
    { name: "Guerre" },
    { name: "Aventure" },
  ];
  const types = [{ name: "Films" }, { name: "Séries" }];
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
            {sortOptions.map((option) => (
              <div className="sort-option" key={option.name}>
                <span>{option.name}</span>
                <div className="sort-buttons-container">
                  <button type="button" className="sort-button">
                    ↑
                  </button>
                  <button type="button" className="sort-button">
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </details>

        <details>
          <summary className="sort-filter-title">Filtrer</summary>
          <div className="filter-options-container">
            <input type="text" placeholder="Rechercher..." id="search-input" />

            <details>
              <summary className="sort-filter-title">Genres</summary>
              <div className="filter-list">
                {genres.map((genre) => (
                  <label key={genre.name}>
                    <input
                      type="checkbox"
                      value={genre.name}
                      className="search-checkbox"
                    />{" "}
                    {genre.name}
                  </label>
                ))}
              </div>
            </details>

            <details>
              <summary className="sort-filter-title">Types</summary>
              <div className="filter-list">
                {types.map((type) => (
                  <label key={type.name}>
                    <input
                      type="checkbox"
                      value={type.name}
                      className="search-checkbox"
                    />{" "}
                    {type.name}
                  </label>
                ))}
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
