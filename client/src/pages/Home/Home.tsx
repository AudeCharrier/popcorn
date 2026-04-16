import BoxMoodEmoji from "../../components/BoxMoodEmoji/BoxMoodEmoji";
import CarousselCourt from "../../components/CarousselCourt/CarousselCourt";
import CarousselLarge from "../../components/CarousselLarge/CarousselLarge";

import "./Home.css";

function Home() {
  return (
    <div className="wrapper">
      <div className="home-heart">
        <CarousselLarge />
      </div>

      <div className="block-control">
        <div className="home-titles">
          <h2 className="titre-current">ACTUELLEMENT EN SALLE</h2>
          <h2 className="titre-current">PROCHAINEMENT</h2>
        </div>

        <div className="home-current">
          <div className="home-current__block">
            <CarousselCourt />
          </div>
          <div className="home-current__block">
            <CarousselCourt />
          </div>
        </div>
      </div>

      <div className="home-mood">
        <BoxMoodEmoji />
      </div>
    </div>
  );
}

export default Home;
