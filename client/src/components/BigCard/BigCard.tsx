import { useCallback, useEffect, useState } from "react";
import "./BigCard.css";
import CharacterCard from "../CharacterCard/CharacterCard";

interface BigCardProps {
  movieId?: string;
  type: "movie" | "tv";
}

interface MediaData {
  poster_path: string;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  genres: { name: string }[];
  vote_average: number;
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  overview: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

function RevealOnScroll({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay);
            observer.unobserve(node);
          }
        });
        observer.observe(node);
      }
    },
    [delay],
  );

  return (
    <div ref={ref} className={`reveal-card ${isVisible ? "visible" : ""}`}>
      {children}
    </div>
  );
}

function BigCard({ movieId, type }: BigCardProps) {
  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const [data, setData] = useState<MediaData | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);

  useEffect(() => {
    if (!movieId) return;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };

    fetch(
      `https://api.themoviedb.org/3/${type}/${movieId}?language=fr-FR`,
      options,
    )
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.error("Erreur API Details:", err));

    fetch(
      `https://api.themoviedb.org/3/${type}/${movieId}/credits?language=fr-FR`,
      options,
    )
      .then((res) => res.json())
      .then((resCast) => setCast(resCast.cast?.slice(0, 4) || []))
      .catch((err) => console.error("Erreur API Cast:", err));
  }, [movieId, type]);

  if (!data) {
    return <div className="BigCard loading">Chargement...</div>;
  }

  const title = data.title || data.name;
  const date = data.release_date || data.first_air_date;

  return (
    <div className="BigCard">
      <RevealOnScroll delay={100}>
        <div className="BigCardDivImg">
          <img src={IMG_URL + data.poster_path} alt={title} />
        </div>
      </RevealOnScroll>

      <div className="BigCardDivText">
        <RevealOnScroll delay={200}>
          <h1>{title}</h1>
        </RevealOnScroll>

        <RevealOnScroll delay={300}>
          <p>
            <span>Date :</span> {date?.split("-").reverse().join("/")}
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={400}>
          <p>
            <span>Genre :</span> {data.genres?.map((g) => g.name).join(", ")}
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={500}>
          <p>
            <span>Note :</span> {data.vote_average.toFixed(1)} / 10
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={600}>
          {type === "movie" ? (
            <p>
              <span>Durée :</span> {data.runtime} minutes
            </p>
          ) : (
            <>
              <p>
                <span>Saisons :</span> {data.number_of_seasons}
              </p>
              <p>
                <span>Épisodes :</span> {data.number_of_episodes}
              </p>
            </>
          )}
        </RevealOnScroll>

        <RevealOnScroll delay={700}>
          <p>
            <span>Synopsis : </span>
            {data.overview}
          </p>
        </RevealOnScroll>
      </div>

      <div className="BigCardDivCharacters">
        {cast.map((actor, index) => (
          <RevealOnScroll key={actor.id} delay={800 + index * 150}>
            <CharacterCard
              name={actor.name}
              character={actor.character}
              profile_path={actor.profile_path}
            />
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}

export default BigCard;
