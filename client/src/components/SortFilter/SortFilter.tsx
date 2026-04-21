import { useContext, useEffect, useState } from "react";
import "./SortFilter.css";
import SearchContext from "../../contexts/SearchContext";

type SearchResult = {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  genre_ids?: number[]; //AJOUTE
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  poster_path: string | null;
};

type Categorie = {
  id: number;
  name: string;
};

type Categories = {
  genres: Categorie[];
};

type Filters = {
  mediaTypes: number[];
  genres: number[];
};

function SortFilter() {
  const [_genresList, _setGenresList] = useState<Categories>(); ///pour liste complete genres et id extraits de l'api... pour construire notre liste réduite
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOverlay, setIsOverlay] = useState(true);

  const { results, setAffichage } = useContext(SearchContext);

  const [_activeFilters, setActiveFilters] = useState<Filters>({
    mediaTypes: [],
    genres: [],
  });

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };

    setLoading(true);
    setError("");

    //recup les 2 fetch dans un tableau [result1, result 2] pour avoir liste genres-id
    Promise.all([
      fetch(
        "https://api.themoviedb.org/3/genre/movie/list?language=fr",
        options,
      ).then((res) => res.json()),

      fetch(
        "https://api.themoviedb.org/3/genre/tv/list?language=fr",
        options,
      ).then((res) => res.json()),
    ])

      //on remplit le tableau de promise (en choisissant les noms)
      .then(([moviesData, tvData]) => {
        const mergedGenres = [...moviesData.genres, ...tvData.genres]; //on recup le contenu de la clé genres
        console.log(mergedGenres);
        // a faire : enlever les doublons (même id) //A ECLARICIR !!!
        /*   const uniqueGenres = mergedGenres.filter(
        (genre, index, self) =>
          index === self.findIndex((g) => g.id === genre.id),
      );
      */
        /*   setGenresList(mergedGenres); */
      })

      .catch((err) => {
        console.error(err);
        setError("Erreur lors du chargement des films.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const sortOptions = [
    { name: "Popularité" },
    { name: "Date de sortie" },
    { name: "Note" },
  ];
  //recup A LA MAIN (tant pis !!) les id de ce qu'on veut (fetch m'a servi à reocpier à la main)
  const genres = [
    { id: 28, name: "Action" },
    { id: 10759, name: "Action & Adventure" },
    { id: 16, name: "Animation" },
    { id: 12, name: "Aventure" },
    { id: 35, name: "Comédie" },
    { id: 18, name: "Drame" },
    { id: 10751, name: "Familial" },
    { id: 14, name: "Fantastique" },
    { id: 10752, name: "Guerre" },
    { id: 27, name: "Horreur" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science-Fiction" },
    { id: 10765, name: "Science-Fiction & Fantastique" },
    { id: 53, name: "Thriller" },
  ];
  const mediaTypes = [
    { id: 1, name: "Films", media_type: "movie" },
    { id: 2, name: "Séries", media_type: "tv" },
  ];

  // séparer les fonctions dans d'autres fichiers !!!

  function updateFiltersCheck(
    categorie: "mediaTypes" | "genres",
    value: number,
  ) {
    setActiveFilters((prev) => {
      const prevCategorie = prev[categorie];

      let newCategorie = [];

      if (prevCategorie.includes(value)) {
        newCategorie = prevCategorie.filter((v) => v !== value);
      } else {
        newCategorie = [...prevCategorie, value]; //si value (= id des genres ou mediatypes) absente -> rajoute
      }
      const newFilters = { ...prev, [categorie]: newCategorie };
      applyFilters(results, newFilters);
      return newFilters;
    });
  }

  function applyFilters(results: SearchResult[], activeFilters: Filters) {
    //   on filtre les results:
    // activefilters.mediatypes -> id numbers  -> on trouve le meme id dans mediaTypes   (id film ou serie)
    // dans results on recup items dont item.media_type = media_type (nom "movie" ou "tv")
    const dataTypesOk =
      activeFilters.mediaTypes.length === 0 ||
      activeFilters.mediaTypes.length === 2 // les deux décochés ou les 2 cochés attention jai du ajouter le type "person" dans le typage...
        ? results
        : results.filter((item) =>
            activeFilters.mediaTypes
              .map((id) => mediaTypes.find((m) => m.id === id)?.media_type)
              .includes(item.media_type),
          );

    //puis filtrer datatypesok avec les genres

    const dataTypesGenresOk =
      activeFilters.genres.length === 0 ||
      activeFilters.genres.length === genres.length // tout decoché ou tout coché
        ? dataTypesOk
        : dataTypesOk.filter(
            (item) =>
              item.genre_ids?.some((id) => activeFilters.genres.includes(id)) ??
              false, //si genre_id ne contient rien
          );

    setAffichage(dataTypesGenresOk); //COMMIT PB TYPAGE : item.genre_ids typé avec "?" fout la merde
    return;
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
                  <button
                    type="button"
                    className="sort-button sort-button-decroissant"
                  >
                    ▶
                  </button>
                  <button
                    type="button"
                    className="sort-button sort-button-croissant"
                  >
                    ▶
                  </button>
                </div>
              </div>
            ))}
          </div>
        </details>

        <details>
          <summary className="sort-filter-title">Filtrer</summary>
          <div className="filter-options-container">
            <input
              type="text"
              placeholder="Entrez un mot..."
              id="search-input"
            />

            <details>
              <summary className="sort-filter-title sort-filter-subtitle">
                Genres
              </summary>
              <div className="filter-list">
                {genres.map((genre) => (
                  <label key={genre.id}>
                    <input
                      type="checkbox"
                      value={genre.id}
                      className="search-checkbox"
                      onChange={(e) =>
                        updateFiltersCheck("genres", Number(e.target.value))
                      }
                    />{" "}
                    {genre.name}
                  </label>
                ))}
              </div>
            </details>

            <details>
              <summary className="sort-filter-title sort-filter-subtitle">
                Types
              </summary>
              <div className="filter-list">
                {mediaTypes.map((mediaTypes) => (
                  <label key={mediaTypes.name}>
                    <input
                      type="checkbox"
                      value={mediaTypes.id}
                      className="search-checkbox"
                      onChange={(e) =>
                        updateFiltersCheck("mediaTypes", Number(e.target.value))
                      }
                    />{" "}
                    {mediaTypes.name}
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
