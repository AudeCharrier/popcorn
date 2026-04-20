import { useEffect, useRef, useState } from "react";
import "./Rechercher.css";
import { useParams } from "react-router-dom";
import defaultPoster from "../../assets/images/Logo.png";
import LittleCard from "../../components/LittleCard/LittleCard";
import SortFilter from "../../components/SortFilter/SortFilter";
import SearchContext from "../../contexts/SearchContext";

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

type RevealOnScrollProps = {
  children: React.ReactNode;
  delay?: number;
};

function RevealOnScroll({ children, delay = 0 }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0,
      },
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-card ${visible ? "visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
const moods: Record<string, number[]> = {
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

function Rechercher() {
  const { id } = useParams();
  console.log("ID URL =", id);

  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [series, setSeries] = useState<MediaItem[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);

  const [affichage, setAffichage] = useState<SearchResult[]>([]);

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
    setAffichage([]);

    const genreIds = moods[id];

    if (genreIds) {
      fetch(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${genreIds.join(",")}&language=fr-FR&page=${page}`,
        options,
      )
        .then((res) => res.json())
        .then((data: TmdbListResponse) => {
          const moviesWithType = (data.results || []).map((item) => ({
            ...item,
            media_type: "movie" as const,
          }));

          setMovies(moviesWithType);
          setAffichage(moviesWithType);
        })
        .catch(() => setError("Erreur mood"))
        .finally(() => setLoading(false));

      return;
    }

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

        setResults(filteredResults); //on garde les resultats bruts de recherche
        setAffichage(filteredResults); //on affiche : a cause de l'asynchrone, je ne peux pas initialiser ET lire results --> je remplis avec filteredresults
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
        <RevealOnScroll delay={100}>
          <h1 className="title-page">FILMS</h1>
        </RevealOnScroll>
        <section className="container">
          <RevealOnScroll delay={200}>
            <SortFilter />
          </RevealOnScroll>
          <div className="Rechercher">
            {movies.map((item, index) => (
              <RevealOnScroll key={item.id} delay={300 + index * 80}>
                <LittleCard
                  id={item.id}
                  type={item.media_type}
                  title={item.title || item.name || ""}
                  vote_average={item.vote_average}
                  release_date={formatDate(item)}
                  overview={item.overview.slice(0, 200)}
                  poster_path={getPoster(item.poster_path)}
                />
              </RevealOnScroll>
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
        <RevealOnScroll delay={100}>
          <h1 className="title-page">SERIES</h1>
        </RevealOnScroll>
        <section className="container">
          <RevealOnScroll delay={200}>
            <SortFilter />
          </RevealOnScroll>
          <div className="Rechercher">
            {series.map((item, index) => (
              <RevealOnScroll key={item.id} delay={300 + index * 80}>
                <LittleCard
                  id={item.id}
                  type={item.media_type}
                  title={item.title || item.name || ""}
                  vote_average={item.vote_average}
                  release_date={formatDate(item)}
                  overview={item.overview.slice(0, 200)}
                  poster_path={getPoster(item.poster_path)}
                />
              </RevealOnScroll>
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
      <RevealOnScroll delay={100}>
        <h1 className="title-page">{id?.toUpperCase()}</h1>
      </RevealOnScroll>
      {results.length === 0 && movies.length === 0 && series.length === 0 ? (
        <p>Aucun film ou série trouvé.</p>
      ) : (
        <>
          <section className="container">
            <RevealOnScroll delay={200}>
              <SearchContext.Provider
                value={{
                  results: results,
                  affichage: affichage,
                  setAffichage: setAffichage,
                }}
              >
                <SortFilter />
              </SearchContext.Provider>
            </RevealOnScroll>
            <div className="Rechercher">
              {affichage.map((item, index) => (
                <RevealOnScroll
                  key={`${item.media_type}-${item.id}`}
                  delay={300 + index * 80}
                >
                  <LittleCard
                    id={item.id}
                    type={item.media_type}
                    title={item.title || item.name || ""}
                    vote_average={item.vote_average}
                    release_date={formatDate(item)}
                    overview={item.overview.slice(0, 200)}
                    poster_path={getPoster(item.poster_path)}
                  />
                </RevealOnScroll>
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
      )}
    </>
  );
}

export default Rechercher;
