import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./FilmsSeries.css";
import BigCard from "../../components/BigCard/BigCard";
import CinemaCard from "../../components/CinemaCard/CinemaCard";

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}
interface Movie {
  id: number;
  title: string;
}
interface Cinema {
  id: number;
  city: string;
  name: string;
  img: string;
  lienSite: string;
}

function FilmsSeries() {
  const { movieId } = useParams<{ movieId: string }>();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isAtCinema, setIsAtCinema] = useState(false);
  const [cinema, setCinema] = useState<Cinema[]>([]);

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
      `https://api.themoviedb.org/3/movie/now_playing?language=fr-FR&region=FR`,
      options,
    )
      .then((res) => res.json())
      .then((data: { results: Movie[] }) => {
        const found = data.results.some(
          (m: Movie) => m.id.toString() === movieId,
        );
        setIsAtCinema(found);
      })
      .catch((err) => console.error("Erreur API Cinema:", err));

    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
      options,
    )
      .then((res) => res.json())
      .then((data) => {
        const streamingFR = data.results?.FR?.flatrate || [];
        setProviders(streamingFR);
      })
      .catch((err) => console.error("Erreur API Streaming:", err));
  }, [movieId]);

  useEffect(() => {
    if (isAtCinema) {
      fetch("http://localhost:3310/")
        .then((response) => response.json())
        .then((data) => {
          const results = Array.isArray(data) ? data : data.cinemaData;

          if (results) {
            setCinema(results);
          } else {
            console.error("Format de données inconnu :", data);
          }
        })
        .catch((err) => console.error("Erreur Fetch Backend Local:", err));
    }
  }, [isAtCinema]);

  return (
    <div className="FilmsSeries">
      <BigCard movieId={movieId} />

      {isAtCinema ? (
        <div className="FilmsSeriesDivCinema">
          <h3>Actuellement au cinéma</h3>
          <div className="FilmSeriesDivCinemaAllCards">
            {cinema.map((cinema) => (
              <CinemaCard
                key={cinema.id}
                city={cinema.city}
                name={cinema.name}
                img={cinema.img}
                lienSite={cinema.lienSite}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="FilmsSeriesDivStream">
          <h3>Disponible en streaming</h3>
          <div className="FilmsSeriesDivStreamIcon">
            {providers.length > 0 ? (
              providers.map((provider) => (
                <div key={provider.provider_id} className="provider-icon">
                  <img
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                    alt={provider.provider_name}
                    title={provider.provider_name}
                  />
                </div>
              ))
            ) : (
              <p>Non disponible en streaming par abonnement en France.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilmsSeries;
