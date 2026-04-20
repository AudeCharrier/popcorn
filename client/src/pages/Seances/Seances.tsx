import "./Seances.css";
import CarousselLarge from "../../components/CarousselLarge/CarousselLarge";

function Seances() {
  return (
    <div className="Seances">
      <div className="containers">
        <h1>ACTUELLEMENT EN SALLE</h1>

        <div className="section-box">
          <h2 className="h2-seances">SORTIES DE LA SEMAINE</h2>
          <div className="carousel-wrapper-fix">
            <CarousselLarge />
          </div>
        </div>

        <div className="section-box">
          <h2 className="h2-seances">TOUJOURS À L'AFFICHE</h2>
          <div className="carousel-wrapper-fix">
            <CarousselLarge />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Seances;
