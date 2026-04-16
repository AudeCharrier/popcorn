import { useEffect, useState } from "react";
import "./Rechercher.css";
import { useParams } from "react-router-dom";
import LittleCard from "../../components/LittleCard/LittleCard";
import SortFilter from "../../components/SortFilter/SortFilter";

type MediaItem = {
  id: number;
  media_type?: "movie" | "tv";
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
  media_type: "movie" | "tv" | "person";
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
        "https://api.themoviedb.org/3/movie/popular?language=fr-FR&page=1",
        options,
      )
        .then((res) => res.json())
        .then((data: TmdbListResponse) => {
          setMovies(data.results || []);
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
        "https://api.themoviedb.org/3/tv/popular?language=fr-FR&page=1",
        options,
      )
        .then((res) => res.json())
        .then((data: TmdbListResponse) => {
          setSeries(data.results || []);
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
      `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(id)}&include_adult=false&language=fr-FR&page=1`,
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
  }, [id]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (id === "1") {
    return (
      <section className="container">
        <SortFilter />
        <div className="Rechercher">
          {movies.map((item) => (
            <LittleCard
              id={item.id}
              key={item.id}
              title={item.title || item.name || ""}
              vote_average={item.vote_average}
              release_date={formatDate(item)}
              overview={item.overview.slice(0, 200)}
              poster_path={item.poster_path || ""}
            />
          ))}
        </div>
      </section>
    );
  }

  if (id === "2") {
    return (
      <section className="container">
        <SortFilter />
        <div className="Rechercher">
          {series.map((item) => (
            <LittleCard
              id={item.id}
              key={item.id}
              title={item.title || item.name || ""}
              vote_average={item.vote_average}
              release_date={formatDate(item)}
              overview={item.overview.slice(0, 200)}
              poster_path={item.poster_path || ""}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
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
              title={item.title || item.name || ""}
              vote_average={item.vote_average}
              release_date={formatDate(item)}
              overview={item.overview.slice(0, 200)}
              poster_path={item.poster_path || ""}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default Rechercher;
