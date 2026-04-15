import "./CinemaCard.css";

type SeancesProps = {
  city: string;
  name: string;
  img: string;
  lienSite: string;
};

function CinemaCard({ city, name, img, lienSite }: SeancesProps) {
  return (
    <div className="cinema-card">
      <img src={`${img}`} alt="image-cinema" />
      <h2>{city}</h2>
      <p>{name}</p>
      <a href={lienSite} target="_blank" rel="noopener noreferrer">
        Voir les séances
      </a>
    </div>
  );
}

export default CinemaCard;
