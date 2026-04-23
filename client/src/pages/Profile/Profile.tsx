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

  const width = {
    width: "50vw",
  };

  //function watchlist --> setstate
  return (
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
                onRemove={removeFavorite}
                style={width}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

//caroussellarge : 50vw --> passer en % dans caroussellarge css ? et définir la div favorites, comme ça chaque carousellarge sera adaptable à sa div parente
