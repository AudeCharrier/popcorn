import "./Littlecard.css";
import { useNavigate } from "react-router-dom";

type CinemaProps = {
  id: number;
  type: "movie" | "tv" | "person";
  title: string;
  vote_average: number;
  release_date: string;
  overview: string;
  poster_path: string;
};

function LittleCard({
  id,
  type,
  title,
  vote_average,
  release_date,
  overview,
  poster_path,
}: CinemaProps) {
  const navigate = useNavigate();
  const handleSelectMovie = (id: number) => {
    const mediaType = type || "movie";
    navigate(`/films-series/${mediaType}/${id}`);
  };

  return (
    <div className="card">
      <div className="card__side card__side--front card__side--front-1">
        <div className="card__description">
          <img
            src={poster_path}
            alt="img-film"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/images/default-poster.png";
            }}
          />
          <h2>{title}</h2>
          <p>Note: {vote_average}</p>
          <p>Date de sortie: {release_date}</p>
        </div>
      </div>
      <div className="card__side card__side--back card__side--back-1">
        <div className="card__description">
          <p>{overview}</p>
          <button
            className="card__side--back button"
            type="button"
            onClick={() => handleSelectMovie(id)}
          >
            Plus d'infos
          </button>
        </div>
      </div>
    </div>
  );
}
export default LittleCard;
