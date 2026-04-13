import "./Littlecard.css";

function LittleCard() {
  return (
    <div className="card">
      <div className="card__side card__side--front card__side--front-1">
        <div className="card__description">
          <img
            src="https://image.tmdb.org/t/p/original/4TBdF7nFw2aKNM0gPOlDNq3v3se.jpg"
            alt="img-film"
          />
          <h2>Tittle</h2>
          <p>Note</p>
          <p>Année sortie</p>
        </div>
      </div>
      <div className="card__side card__side--back card__side--back-1">
        <div className="card__description">
          <p>
            À Los Angeles, plusieurs histoires de criminels s’entremêlent dans
            un récit éclaté et non chronologique. Vincent Vega et Jules
            Winnfield, deux tueurs à gages au service du redouté Marsellus
            Wallace, doivent récupérer une mystérieuse mallette dont le contenu
          </p>
          <button className="card__side--back button" type="button">
            Plus d'infos
          </button>
        </div>
      </div>
    </div>
  );
}
export default LittleCard;
