import "./CharacterCard.css";

interface CharacterProps {
  name: string;
  character: string;
  profile_path: string;
}

function CharacterCard({ name, character, profile_path }: CharacterProps) {
  const IMG_URL = "https://image.tmdb.org/t/p/w500";

  return (
    <div className="CharacterCard">
      <div className="CharacterCardDivImg">
        <img
          src={
            profile_path
              ? IMG_URL + profile_path
              : "https://via.placeholder.com/150"
          }
          alt={name}
        />
      </div>
      <div className="CharacterCardDivText">
        <h3>{name}</h3>
        <p>
          <span>Rôle :</span> {character}
        </p>
      </div>
    </div>
  );
}

export default CharacterCard;
