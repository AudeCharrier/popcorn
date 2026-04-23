import { useEffect, useState } from "react";
import LittleCard from "../../components/LittleCard/LittleCard";
import "./Favorites.css";

type CarouselItem = {
  id: number;
  title: string;
  vote_average: number;
  release_date: string;
  overview: string;
  poster_path: string;
  media_type: "movie" | "tv";
};

function Favorites() {
  const [favorites, setFavorites] = useState<CarouselItem[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(stored);
  }, []);

  const removeFavorite = (id: number) => {
    const updated = favorites.filter((movie) => movie.id !== id);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  return (
    <div>
      <h1 className="fav-title">FAVORIS</h1>
      <div className="favorites">
        {favorites.length === 0 ? (
          <p className="text-fav">Aucun favori trouvé</p>
        ) : (
          favorites.map((item) => (
            <div key={item.id} className="fav-cards">
              <LittleCard
                id={item.id}
                type={item.media_type}
                title={item.title}
                vote_average={item.vote_average}
                release_date={item.release_date}
                overview={item.overview}
                poster_path={item.poster_path}
                isProfilePage={true}
                onRemoveFav={removeFavorite}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Favorites;
