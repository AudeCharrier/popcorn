import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./FilmsSeries.css";
import BigCard from "../../components/BigCard/BigCard";

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}
function FilmsSeries() {
  const { movieId } = useParams<{ movieId: string }>();
  const [providers, setProviders] = useState<Provider[]>([]);

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
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
      options,
    )
      .then((res) => res.json())
      .then((data) => {
        const streamingFR = data.results?.FR?.flatrate || [];
        setProviders(streamingFR);
      })
      .catch((err) => console.error("Erreur API:", err));
  }, [movieId]);

  return (
    <div className="FilmsSeries">
      <BigCard movieId={movieId} />
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
    </div>
  );
}

export default FilmsSeries;
