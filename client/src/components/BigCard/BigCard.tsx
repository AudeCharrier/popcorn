import { useEffect, useState } from "react";
import "./BigCard.css";

interface Movie {
  poster_path: string;
  title: string;
  release_date: string;
  genres: { name: string }[];
  vote_average: number;
  runtime: number;
  overview: string;
}

function BigCard() {
  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };

    fetch("https://api.themoviedb.org/3/movie/12?language=fr-FR", options)
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
      })
      .catch((err) => console.error("Erreur API:", err));
  }, []);

  if (!movie) {
    return <div className="BigCard">Chargement...</div>;
  }
  return (
    <div className="BigCard">
      <div className="BigCardDivImg">
        <img src={IMG_URL + movie.poster_path} alt={movie.title} />
      </div>
      <div className="BigCardDivText">
        <h1>{movie.title}</h1>
        <p>
          <span>Date :</span>{" "}
          {movie.release_date?.split("-").reverse().join("/")}
        </p>
        <p>
          <span>Genre :</span> {movie.genres?.map((g) => g.name).join(", ")}
        </p>
        <p>
          <span>Note :</span> {movie.vote_average} / 10
        </p>
        <p>
          <span>Durée :</span> {movie.runtime} minutes
        </p>
        <p>
          <span>Synopsis : </span>
          {movie.overview}
        </p>
      </div>
    </div>
  );
}

export default BigCard;
