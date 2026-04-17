import { useContext, useState } from "react";
import "./SortFilter.css";
import SearchContext from "../../contexts/SearchContext";

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
  const mediaTypes = [{ name: "Films" }, { name: "Séries" }];

  const [isOpen, setIsOpen] = useState(false);
  const [isOverlay, setIsOverlay] = useState(true);
  const [movieCheck, setMovieCheck] = useState(false);
  const [serieCheck, setSerieCheck] = useState(false);

  const { results, setAffichage } = useContext(SearchContext);

  const [_filters, _setFilters] = useState({
    mediaTypes: [],
    genres: [],
  });

  // FILTRE MOVIES

  // les deux actions (toggle le state et filtrer) dans la meme fct pour que ce soit synchrone entre les deux
  function toggleMediaCheck(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value; //récupère value ="films" ou "séries" de l'input

    //l'utilisateur a coché ou décoché -> on toggle le state
    //il y a un ternaire dans la const, pour adapter la valeur
    //si on est dans l'input de value films -> on toggle moviecheck : sinon on laisse moviecheck d'avant
    const newMovieCheck = value === "Films" ? !movieCheck : movieCheck;
    const newSerieCheck = value === "Séries" ? !serieCheck : serieCheck;

    setMovieCheck(newMovieCheck);
    setSerieCheck(newSerieCheck);

    if (
      //si les deux sont cochés ou décochés
      (newMovieCheck && newSerieCheck) ||
      (!newMovieCheck && !newSerieCheck)
    ) {
      setAffichage(results);
    } else if (newMovieCheck) {
      setAffichage(results.filter((r) => r.media_type === "movie"));
    } else {
      setAffichage(results.filter((r) => r.media_type === "tv"));
    }
  }

  //COMPOSANT SORTFILTER
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
                {mediaTypes.map((mediaType) => (
                  <label key={mediaType.name}>
                    <input
                      type="checkbox"
                      value={mediaType.name}
                      className="search-checkbox"
                      onChange={toggleMediaCheck}
                    />{" "}
                    {mediaType.name}
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

//revoir DA boutons rehcercher
//bouton ou div sur le coté
//h-qch au lieu de p ?
