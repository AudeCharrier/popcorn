import { useEffect, useState } from "react";
import CarousselLarge from "../../components/CarousselLarge/CarousselLarge";
import "./Profile.css";

type CarouselItem = {
  id: number;
  title: string;
  vote_average: number;
  release_date: string;
  overview: string;
  poster_path: string;
  media_type: "movie" | "tv";
  type: "movie" | "tv";
};

function Profile() {
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

  const [toWatch, setToWatch] = useState<CarouselItem[]>([]);

  useEffect(() => {
    const watchStored = JSON.parse(localStorage.getItem("towatch") || "[]");
    setToWatch(watchStored);
  }, []);

  const removeToWatch = (id: number) => {
    const watchUpdated = toWatch.filter((movie) => movie.id !== id);
    localStorage.setItem("towatch", JSON.stringify(watchUpdated));
    setToWatch(watchUpdated);
  };

  const width = {
    width: "60vw",
  };

  return (
    <section className="profile-layout">
      <div className="profile-list-wrapper">
        <h2 className="profile-list-title">FAVORIS</h2>
        <div className="profile-list">
          <CarousselLarge
            items={favorites}
            isProfilePage={true}
            listType="favorites"
            onRemoveFav={removeFavorite}
            style={width}
          />
        </div>
      </div>

      <div className="profile-list-wrapper">
        <h2 className="profile-list-title">WATCH-LIST</h2>
        <div className="profile-list">
          <CarousselLarge
            items={toWatch}
            isProfilePage={true}
            listType="watchlist"
            onRemoveWatch={removeToWatch}
            style={width}
          />
        </div>
      </div>
    </section>
  );
}

export default Profile;

//REFACTO !!
//raccourcir le trait sous les carousel favorite et watch
