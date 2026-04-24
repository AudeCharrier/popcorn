import { useEffect, useRef, useState } from "react";
import "./Rechercher.css";
import { useParams } from "react-router";
import defaultPoster from "../../assets/images/Logo.png";
import LittleCard from "../../components/LittleCard/LittleCard";
import SortFilter from "../../components/SortFilter/SortFilter";
import SearchContext, {
  type Filters,
  type SearchResult,
} from "../../contexts/SearchContext";

type MediaItem = {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  genre_ids?: number[];
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  poster_path: string | null;
  popularity: number;
};

type SearchResponse = { results: SearchResult[] };
type TmdbListResponse = { results: MediaItem[] };

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
      { threshold: 0 },
    );
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
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

const genreNames: Record<number, string> = {
  28: "Action",
  10759: "Action & Adventure",
  16: "Animation",
  12: "Aventure",
  35: "Comédie",
  18: "Drame",
  10751: "Familial",
  14: "Fantastique",
  10752: "Guerre",
  27: "Horreur",
  10749: "Romance",
  878: "Science-Fiction",
  10765: "Science-Fiction & Fantastique",
  53: "Thriller",
};

function Rechercher() {
  const { id } = useParams();

  const [rawResults, setRawResults] = useState<SearchResult[]>([]);
  const [affichage, setAffichage] = useState<SearchResult[]>([]);
  const [activeFilters, setActiveFilters] = useState<Filters>({
    mediaTypes: [],
    genres: [],
    keyword: "",
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatDate = (item: {
    release_date?: string;
    first_air_date?: string;
  }) =>
    item.release_date?.split("-").reverse().join("/") ||
    item.first_air_date?.split("-").reverse().join("/") ||
    "";

  const getPoster = (path: string | null) =>
    path ? `https://image.tmdb.org/t/p/w500${path}` : defaultPoster;

  useEffect(() => {
    if (!id) {
      setError("Aucun paramètre trouvé.");
      return;
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };

    setLoading(true);
    setError("");
    setRawResults([]);
    setAffichage([]);
    setActiveFilters({ mediaTypes: [], genres: [], keyword: "" });

    const genreIds = moods[id];

    if (genreIds) {
      Promise.all([
        fetch(
          `https://api.themoviedb.org/3/discover/movie?with_genres=${genreIds.join(",")}&language=fr-FR&page=${page}`,
          options,
        ).then((r) => r.json()),
        fetch(
          `https://api.themoviedb.org/3/discover/tv?with_genres=${genreIds.join(",")}&language=fr-FR&page=${page}`,
          options,
        ).then((r) => r.json()),
      ])
        .then(([moviesData, tvData]: [TmdbListResponse, TmdbListResponse]) => {
          const combined: SearchResult[] = [
            ...(moviesData.results || []).map((i) => ({
              ...i,
              media_type: "movie" as const,
            })),
            ...(tvData.results || []).map((i) => ({
              ...i,
              media_type: "tv" as const,
            })),
          ];
          setRawResults(combined);
          setAffichage(combined);
        })
        .catch(() => setError("Erreur chargement mood"))
        .finally(() => setLoading(false));
      return;
    }

    if (id === "1") {
      fetch(
        `https://api.themoviedb.org/3/movie/popular?language=fr-FR&page=${page}`,
        options,
      )
        .then((r) => r.json())
        .then((data: TmdbListResponse) => {
          const items: SearchResult[] = (data.results || []).map((i) => ({
            ...i,
            media_type: "movie" as const,
          }));
          setRawResults(items);
          setAffichage(items);
        })
        .catch(() => setError("Erreur chargement films"))
        .finally(() => setLoading(false));
      return;
    }

    if (id === "2") {
      fetch(
        `https://api.themoviedb.org/3/tv/popular?language=fr-FR&page=${page}`,
        options,
      )
        .then((r) => r.json())
        .then((data: TmdbListResponse) => {
          const items: SearchResult[] = (data.results || []).map((i) => ({
            ...i,
            media_type: "tv" as const,
          }));
          setRawResults(items);
          setAffichage(items);
        })
        .catch(() => setError("Erreur chargement séries"))
        .finally(() => setLoading(false));
      return;
    }

    fetch(
      `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(id)}&include_adult=false&language=fr-FR&page=${page}`,
      options,
    )
      .then((r) => r.json())
      .then((data: SearchResponse) => {
        const filtered = (data.results || []).filter(
          (item) => item.media_type === "movie" || item.media_type === "tv",
        );
        setRawResults(filtered);
        setAffichage(filtered);
      })
      .catch(() => setError("Erreur chargement résultats"))
      .finally(() => setLoading(false));
  }, [id, page]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  const getTitle = () => {
    const isEmpty =
      activeFilters.genres.length === 0 &&
      activeFilters.mediaTypes.length === 0 &&
      !activeFilters.keyword;

    if (isEmpty) return "RECHERCHE";

    if (activeFilters.mediaTypes.length > 0) {
      return activeFilters.mediaTypes[0] === 1 ? "FILMS" : "SERIES";
    }

    if (activeFilters.genres.length > 0) {
      return (genreNames[activeFilters.genres[0]] ?? "RECHERCHE").toUpperCase();
    }

    return "RECHERCHE";
  };

  return (
    <>
      <RevealOnScroll delay={100}>
        <h1 className="title-page">{getTitle()}</h1>
      </RevealOnScroll>

      {rawResults.length === 0 ? (
        <p>Aucun film ou série trouvé.</p>
      ) : (
        <>
          <section className="container">
            <RevealOnScroll delay={200}>
              <SearchContext.Provider
                value={{
                  results: rawResults,
                  affichage,
                  setAffichage,
                  activeFilters,
                  setActiveFilters,
                }}
              >
                <SortFilter moodId={id} />
              </SearchContext.Provider>
            </RevealOnScroll>

            <div className="Rechercher">
              {affichage.length === 0 ? (
                <p>Aucun média trouvé pour ces filtres.</p>
              ) : (
                affichage.map((item, index) => (
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
                ))
              )}
            </div>
          </section>

          <section className="section-btn">
            <button
              className="button-preced"
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
