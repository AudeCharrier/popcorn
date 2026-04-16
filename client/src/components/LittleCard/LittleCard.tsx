import "./Littlecard.css";
import { useNavigate } from "react-router";

type CinemaProps = {
  id: number;
  title: string;
  vote_average: number;
  release_date: string;
  overview: string;
  poster_path: string;
};

function LittleCard({
  id,
  title,
  vote_average,
  release_date,
  overview,
  poster_path,
}: CinemaProps) {
  const navigate = useNavigate();
  const handleSelectMovie = (id: number) => {
    navigate("/films-series", {
      state: { id },
    });
  };

  return (
    <div className="card">
      <div className="card__side card__side--front card__side--front-1">
        <div className="card__description">
          <img
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            alt="img-film"
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
