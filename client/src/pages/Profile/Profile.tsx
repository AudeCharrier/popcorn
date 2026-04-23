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
    width: "50vw",
  };

  return (
    <>
      <div>
        <div className="block-control">
          <div className="home-current">
            <div className="home-current__block">
              <div className="home-title">
                <h2 className="titre-current">FAVORIS</h2>
              </div>
              <div className="favorites">
                <CarousselLarge
                  items={favorites}
                  isProfilePage={true}
                  onRemoveFav={removeFavorite}
                  onRemoveWatch={removeToWatch}
                  style={width}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="block-control">
          <div className="home-current">
            <div className="home-current__block">
              <div className="home-title">
                <h2 className="titre-current">WATCH-LIST</h2>
              </div>
              <div className="watch-list">
                <CarousselLarge
                  items={toWatch}
                  isProfilePage={true}
                  onRemoveFav={removeFavorite}
                  onRemoveWatch={removeToWatch}
                  style={width}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;

//REFACTO !!
//verifier si toutes les div sont indispensables
//quand aucun film en watch ou favorites : ne pas afficher de cards...
//raccourcir le trait sous les carousel favorite et watch
//aligner les titres dans pageprofile
