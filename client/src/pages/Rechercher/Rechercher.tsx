import { useEffect, useState } from "react";
import "./Rechercher.css";
import { useParams } from "react-router-dom";
import defaultPoster from "../../assets/images/Logo.png";
import LittleCard from "../../components/LittleCard/LittleCard";
import SortFilter from "../../components/SortFilter/SortFilter";

type MediaItem = {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  poster_path: string | null;
};

type SearchResult = {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  poster_path: string | null;
};

type SearchResponse = {
  results: SearchResult[];
};

type TmdbListResponse = {
  results: MediaItem[];
};

function Rechercher() {
  const { id } = useParams();

  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [series, setSeries] = useState<MediaItem[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatDate = (item: {
    release_date?: string;
    first_air_date?: string;
  }) => {
    return (
      item.release_date?.split("-").reverse().join("/") ||
      item.first_air_date?.split("-").reverse().join("/") ||
      ""
    );
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Aucun paramètre trouvé.");
      return;
    }

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };

    setLoading(true);
    setError("");
    setMovies([]);
    setSeries([]);
    setResults([]);

    if (id === "1") {
      fetch(
        `https://api.themoviedb.org/3/movie/popular?language=fr-FR&page=${page}`,
        options,
      )
        .then((res) => res.json())
        .then((data: TmdbListResponse) => {
          const moviesWithType = (data.results || []).map((item) => ({
            ...item,
            media_type: "movie" as const,
          }));
          setMovies(moviesWithType);
        })
        .catch((err) => {
          console.error(err);
          setError("Erreur lors du chargement des films.");
        })
        .finally(() => {
          setLoading(false);
        });

      return;
    }

    if (id === "2") {
      fetch(
        `https://api.themoviedb.org/3/tv/popular?language=fr-FR&page=${page}`,
        options,
      )
        .then((res) => res.json())
        .then((data: TmdbListResponse) => {
          const seriesWithType = (data.results || []).map((item) => ({
            ...item,
            media_type: "tv" as const,
          }));
          setSeries(seriesWithType);
        })
        .catch((err) => {
          console.error(err);
          setError("Erreur lors du chargement des séries.");
        })
        .finally(() => {
          setLoading(false);
        });

      return;
    }

    fetch(
      `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(id)}&include_adult=false&language=fr-FR&page=${page}`,
      options,
    )
      .then((res) => res.json())
      .then((data: SearchResponse) => {
        const filteredResults = (data.results || []).filter(
          (item) => item.media_type === "movie" || item.media_type === "tv",
        );

        setResults(filteredResults);
      })
      .catch((err) => {
        console.error(err);
        setError("Erreur lors du chargement des résultats.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, page]);

  const getPoster = (path: string | null) =>
    path ? `https://image.tmdb.org/t/p/w500${path}` : defaultPoster;

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (id === "1") {
    return (
      <>
        <h1 className="title-page">FILMS</h1>
        <section className="container">
          <SortFilter />
          <div className="Rechercher">
            {movies.map((item) => (
              <LittleCard
                id={item.id}
                key={item.id}
                type={item.media_type}
                title={item.title || item.name || ""}
                vote_average={item.vote_average}
                release_date={formatDate(item)}
                overview={item.overview.slice(0, 200)}
                poster_path={getPoster(item.poster_path)}
              />
            ))}
          </div>
        </section>
        <section className="section-btn">
          <button
            className="button-preced"
            type="button"
            onClick={() => setPage((prev) => prev - 1)}
          >
            ‹ Précédent
          </button>
          <button
            className="button-suiv"
            type="button"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Suivant ›
          </button>
        </section>
      </>
    );
  }

  if (id === "2") {
    return (
      <>
        <h1 className="title-page">SÉRIES</h1>
        <section className="container">
          <SortFilter />
          <div className="Rechercher">
            {series.map((item) => (
              <LittleCard
                id={item.id}
                key={item.id}
                type={item.media_type}
                title={item.title || item.name || ""}
                vote_average={item.vote_average}
                release_date={formatDate(item)}
                overview={item.overview.slice(0, 200)}
                poster_path={getPoster(item.poster_path)}
              />
            ))}
          </div>
        </section>
        <section className="section-btn">
          <button
            className="button-preced"
            type="button"
            onClick={() => setPage((prev) => prev - 1)}
          >
            ‹ Précédent
          </button>
          <button
            className="button-suiv"
            type="button"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Suivant ›
          </button>
        </section>
      </>
    );
  }

  return (
    <>
      <h1 className="title-page">RECHERCHES</h1>
      <section className="container">
        <SortFilter />
        <div className="Rechercher">
          {results.length === 0 ? (
            <p>Aucun film ou série trouvé.</p>
          ) : (
            results.map((item) => (
              <LittleCard
                id={item.id}
                key={`${item.media_type}-${item.id}`}
                type={item.media_type}
                title={item.title || item.name || ""}
                vote_average={item.vote_average}
                release_date={formatDate(item)}
                overview={item.overview.slice(0, 200)}
                poster_path={getPoster(item.poster_path)}
              />
            ))
          )}
        </div>
      </section>
      <section className="section-btn">
        <button
          className="button-preced"
          type="button"
          onClick={() => setPage((prev) => prev - 1)}
        >
          ‹ Précédent
        </button>
        <button
          className="button-suiv"
          type="button"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Suivant ›
        </button>
      </section>
    </>
  );
}

export default Rechercher;
