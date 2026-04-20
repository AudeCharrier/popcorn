import { useEffect, useState } from "react"; //ajouter usecontext
import "./SortFilter.css";
/* import SearchContext from "../../contexts/SearchContext"; */

// POUR RAPPEL : EXTRAIT DE SEARCH MULTI :
/* type MediaItem = {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  genre_ids?: number[     
  ],
  popularity?:number;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  poster_path: string | null;
}; */
//aller chercher ça dans l'api genre/movie/list  et genre/tv/list

type Genre = {
  id: number;
  name: string;
};

type Genres = {
  genres: Genre[];
};

function SortFilter_try() {
  const [_genresList, _setGenresList] = useState<Genres>();
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState("");

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

    //recup les 2 fetch dans un tableau [result1, result 2]
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
        /* setGenresList(mergedGenres); */
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
  //recup A LA MAIN (tant pis !!) les id de ce qu'on veut
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

  /* const {_results,_affichage,_setAffichage } = useContext(SearchContext);
   */
  const [_activeFilters, setActiveFilters] = useState<Filters>({
    mediaTypes: [],
    genres: [],
  });

  type Filters = {
    mediaTypes: string[];
    genres: string[];
  };

  function toggleMediaCheck(categorie: "mediaTypes" | "genres", value: string) {
    setActiveFilters((prev) => {
      const prevCategorie = prev[categorie];

      let newCategorie = [];

      if (prevCategorie.includes(value)) {
        newCategorie = prevCategorie.filter((v) => v !== value);
      } else {
        newCategorie = [...prevCategorie, value]; //si value (= nom categorie = aventure, film... etc) absente -> rajoute
      }

      return {
        ...prev,
        [categorie]: newCategorie,
      };
    });
  }

  // results est un MediaItem[]

  /* function recalculerLesFiltres(results, activeFilters) {

const dataTypesOk =
  activeFilters.mediaTypes.length === 0
    ? results
    : results.filter(item =>
        activeFilters.mediaTypes.includes(item.media_type)
      ); */

  //puis filtrer datatypesok avec les genres

  //actualiser setaffichage !!

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
                      onChange={(e) =>
                        toggleMediaCheck("genres", e.target.value)
                      }
                    />{" "}
                    {genre.name}
                  </label>
                ))}
              </div>
            </details>

            <details>
              <summary className="sort-filter-title">Types</summary>
              <div className="filter-list">
                {mediaTypes.map((mediaTypes) => (
                  <label key={mediaTypes.name}>
                    <input
                      type="checkbox"
                      value={mediaTypes.name}
                      className="search-checkbox"
                      onChange={(e) =>
                        toggleMediaCheck("mediaTypes", e.target.value)
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

export default SortFilter_try;

//revoir DA boutons rehcercher
//bouton ou div sur le coté
//h-qch au lieu de p ?
