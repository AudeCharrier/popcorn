import { useCallback, useContext, useEffect, useRef, useState } from "react";
import "./SortFilter.css";
import Logo from "../../assets/images/filtre.png";
import type { Filters, SearchResult } from "../../contexts/SearchContext";
import SearchContext from "../../contexts/SearchContext";

type Props = {
  moodId?: string;
};

const genres = [
  { id: 28, name: "Action", alias: [10759] },
  { id: 12, name: "Aventure", alias: [10759] },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comédie" },
  { id: 18, name: "Drame" },
  { id: 10751, name: "Familial" },
  { id: 14, name: "Fantastique", alias: [10765] },
  { id: 878, name: "Science-Fiction", alias: [10765] },
  { id: 10752, name: "Guerre" },
  { id: 27, name: "Horreur" },
  { id: 10749, name: "Romance" },
  { id: 53, name: "Thriller" },
];

const mediaTypes = [
  { id: 1, name: "Films", media_type: "movie" },
  { id: 2, name: "Séries", media_type: "tv" },
];

const moodGenresMap: Record<string, number[]> = {
  comedie: [35],
  romance: [10749, 18],
  guerre: [10752, 18],
  scifi: [878, 28],
  thriller: [53],
  drame: [18],
  animation: [16, 10751],
  aventure: [12],
  action: [28, 53],
};

const sortOptions = [
  { name: "Popularité", key: "popularity" },
  { name: "Date de sortie", key: "date" },
  { name: "Note", key: "vote" },
] as const;

function SortFilter({ moodId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOverlay, setIsOverlay] = useState(true);

  const { results, setAffichage, activeFilters, setActiveFilters } =
    useContext(SearchContext);

  const [sortConfig, setSortConfig] = useState<{
    key: "popularity" | "date" | "vote";
    order: "asc" | "desc";
  } | null>(null);

  const sortConfigRef = useRef(sortConfig);
  sortConfigRef.current = sortConfig;

  const resultsRef = useRef(results);
  resultsRef.current = results;

  const activeFiltersRef = useRef(activeFilters);
  activeFiltersRef.current = activeFilters;

  function sortData(data: SearchResult[], config: typeof sortConfig) {
    if (!config) return data;
    const sorted = [...data];
    sorted.sort((a, b) => {
      let vA: number, vB: number;
      if (config.key === "popularity") {
        vA = a.popularity;
        vB = b.popularity;
      } else if (config.key === "vote") {
        vA = a.vote_average;
        vB = b.vote_average;
      } else {
        vA = new Date(a.release_date || a.first_air_date || "1900").getTime();
        vB = new Date(b.release_date || b.first_air_date || "1900").getTime();
      }
      return config.order === "desc" ? vA - vB : vB - vA;
    });
    return sorted;
  }

  const applyFilters = useCallback(
    (data: SearchResult[], filters: Filters, config: typeof sortConfig) => {
      const sortData = (data: SearchResult[], config: typeof sortConfig) => {
        if (!config) return data;

        const sorted = [...data];
        sorted.sort((a, b) => {
          let vA: number, vB: number;

          if (config.key === "popularity") {
            vA = a.popularity;
            vB = b.popularity;
          } else if (config.key === "vote") {
            vA = a.vote_average;
            vB = b.vote_average;
          } else {
            vA = new Date(
              a.release_date || a.first_air_date || "1900",
            ).getTime();
            vB = new Date(
              b.release_date || b.first_air_date || "1900",
            ).getTime();
          }

          return config.order === "desc" ? vA - vB : vB - vA;
        });

        return sorted;
      };

      const byType =
        filters.mediaTypes.length === 0
          ? data
          : data.filter((item) =>
              filters.mediaTypes
                .map((id) => mediaTypes.find((m) => m.id === id)?.media_type)
                .includes(item.media_type),
            );

      const byGenre =
        filters.genres.length === 0
          ? byType
          : byType.filter((item) =>
              item.genre_ids?.some((id) =>
                filters.genres.some((selectedId) => {
                  const genre = genres.find((g) => g.id === selectedId);
                  if (!genre) return false;
                  if (selectedId === id) return true;
                  if (genre.alias?.includes(id)) return true;
                  return false;
                }),
              ),
            );
      const byKeyword =
        filters.keyword.trim() === ""
          ? byGenre
          : byGenre.filter((item) => {
              const title = (item.title || item.name || "").toLowerCase();
              return title.includes(filters.keyword.trim().toLowerCase());
            });

      setAffichage(sortData(byKeyword, config));
    },
    [setAffichage],
  );

  useEffect(() => {
    if (!results || results.length === 0) return;

    let initialGenres: number[] = [];
    let initialMediaTypes: number[] = [];

    if (moodId === "1") initialMediaTypes = [1];
    else if (moodId === "2") initialMediaTypes = [2];
    else if (moodId && moodGenresMap[moodId]) {
      initialGenres = moodGenresMap[moodId];
    }

    const newFilters: Filters = {
      mediaTypes: initialMediaTypes,
      genres: initialGenres,
      keyword: "",
    };

    setActiveFilters(newFilters);

    // applyFilters(results, newFilters, sortConfigRef.current);
  }, [moodId, results, setActiveFilters]);

  useEffect(() => {
    if (!results) return;

    applyFilters(results, activeFilters, sortConfig);
  }, [results, activeFilters, sortConfig, applyFilters]);

  function updateFiltersCheck(
    categorie: "mediaTypes" | "genres",
    value: number,
  ) {
    setActiveFilters((prev) => {
      const prevList = prev[categorie];
      const newList = prevList.includes(value)
        ? prevList.filter((v) => v !== value)
        : [...prevList, value];

      const newFilters = { ...prev, [categorie]: newList };

      const noFilters =
        newFilters.genres.length === 0 &&
        newFilters.mediaTypes.length === 0 &&
        newFilters.keyword === "";

      if (noFilters) {
        setAffichage(sortData(resultsRef.current, sortConfigRef.current));
      } else {
        applyFilters(resultsRef.current, newFilters, sortConfigRef.current);
      }

      return newFilters;
    });
  }

  function updateKeyword(value: string) {
    setActiveFilters((prev) => {
      const newFilters = { ...prev, keyword: value };
      applyFilters(resultsRef.current, newFilters, sortConfigRef.current);
      return newFilters;
    });
  }

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
        <img src={Logo} className="overlay-title" alt="Filtre" />
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
                    onClick={() =>
                      setSortConfig({ key: option.key, order: "desc" })
                    }
                  >
                    ▶
                  </button>
                  <button
                    type="button"
                    className="sort-button sort-button-croissant"
                    onClick={() =>
                      setSortConfig({ key: option.key, order: "asc" })
                    }
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
              placeholder="Mots-clés..."
              id="search-input"
              value={activeFilters.keyword}
              onChange={(e) => updateKeyword(e.target.value)}
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
                      checked={activeFilters.genres.includes(genre.id)}
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
                {mediaTypes.map((mt) => (
                  <label key={mt.id}>
                    <input
                      type="checkbox"
                      value={mt.id}
                      className="search-checkbox"
                      checked={activeFilters.mediaTypes.includes(mt.id)}
                      onChange={(e) =>
                        updateFiltersCheck("mediaTypes", Number(e.target.value))
                      }
                    />{" "}
                    {mt.name}
                  </label>
                ))}
              </div>
            </details>
          </div>
        </details>
      </aside>
    </>
  );
}

export default SortFilter;
