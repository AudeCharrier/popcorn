import "./CarousselLarge.css";
import LittleCard from "../LittleCard/LittleCard";

type CarouselItem = {
  id: number;
  img: string;
  title: string;
};

type CarousselProps = {
  titre?: string;
  items?: CarouselItem[];
};

function CarousselLarge({
  titre = "COUPS DE COEUR",
  items = [],
}: CarousselProps) {
  return (
    <div className="caroussel-container">
      <h2 className="caroussel-titre">{titre}</h2>

      <div className="caroussel-center">
        {items.length > 0
          ? items.map((item) => (
              <div key={item.id} className="caroussel-item"></div>
            ))
          : Array.from({ length: 6 }, (_, i) => `placeholder-${i}`).map(
              (key) => (
                <div key={key} className="caroussel-item">
                  <LittleCard />
                </div>
              ),
            )}
      </div>
    </div>
  );
}

export default CarousselLarge;
