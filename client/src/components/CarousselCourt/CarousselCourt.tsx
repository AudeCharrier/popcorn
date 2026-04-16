import { useState } from "react";
import "./CarousselCourt.css";
import LittleCard from "../LittleCard/LittleCard";

type CarouselItem = {
  id: number;
  title: string;
  vote_average: number;
  release_date: string;
  overview: string;
  poster_path: string;
};

type CarousselCourtProps = {
  items?: CarouselItem[];
};

function CarousselCourt({ items = [] }: CarousselCourtProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayedItems =
    items.length > 0
      ? items
      : Array.from({ length: 3 }, (_, i) => ({
          id: i,
          title: "Titre",
          vote_average: 0,
          release_date: "N/A",
          overview: "Aucune description",
          poster_path: "",
        }));

  const STEP = 250;

  const handlePrev = () =>
    setCurrentIndex((prev) =>
      prev <= 0 ? displayedItems.length - 1 : prev - 1,
    );

  const handleNext = () =>
    setCurrentIndex((prev) =>
      prev >= displayedItems.length - 1 ? 0 : prev + 1,
    );

  return (
    <div className="carousselseconde-container">
      <div className="caroussel-court-container">
        <div className="caroussel-court-wrapper">
          <button
            type="button"
            className="caroussel-court-button caroussel-court-button-left"
            onClick={handlePrev}
          >
            ◀
          </button>

          <div className="caroussel-court-overflow">
            <div
              className="caroussel-court-center"
              style={{ transform: `translateX(-${currentIndex * STEP}px)` }}
            >
              {displayedItems.map((item) => (
                <div key={item.id} className="caroussel-court-item">
                  <LittleCard
                    id={item.id}
                    title={item.title}
                    vote_average={item.vote_average}
                    release_date={item.release_date}
                    overview={item.overview}
                    poster_path={item.poster_path}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="caroussel-court-button caroussel-court-button-right"
            onClick={handleNext}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarousselCourt;
