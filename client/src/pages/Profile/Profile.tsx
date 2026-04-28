import { useEffect, useState } from "react";
import CarousselLarge from "../../components/CarousselLarge/CarousselLarge";
import "./Profile.css";
import BadgeWatcher from "../../assets/images/badge_watcher_amateur.png";
import Pencil from "../../assets/images/pencil.webp";

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
    width: "60vw",
  };

  return (
    <>
      <section className="profile-menu">
        <p>Mon Profil</p>
        <p>Mon Compte</p>
        <p>Mes Favoris</p>
        <p>Ma Watch-List</p>
        <p>Paramètres</p>
        <p>Déconnexion</p>
      </section>
      <section className="profile-layout">
        <h2 className="profile-account-title profile-list-title">Mon compte</h2>
        <div className="profile-account-wrapper">
          <div className="profile-my-account">
            <h3>Pseudo</h3>
            <div className="profile-infos-pencil">
              <p>Ninadanslombre</p>
              <button type="button" className="profile-hidden-btn">
                <img src={Pencil} alt="pencil" className="pencil-img" />
              </button>
            </div>
            <h3>Email</h3>
            <div className="profile-infos-pencil">
              <p>nina.richard42@google.com</p>
              <button type="button" className="profile-hidden-btn">
                <img src={Pencil} alt="pencil" className="pencil-img" />
              </button>
            </div>
            <h3>Mot de passe</h3>
            <p>*********</p>
            <button type="button" className="btn-voir profile-mdp-btn">
              Changer le mot de passe
            </button>
          </div>
          <div className="profile-member-status">
            <img src={BadgeWatcher} alt="" className="profile-badge" />
            <p className="profile-bold">Watcher amateur</p>
            <p>Prochain rang : Serial Watcher</p>
            <p className="profile-italic">
              Ajoute encore 10 films en favoris
              <br />
              pour passer au rang supérieur !
            </p>
            <p> Membre depuis le 24/04/26</p>
          </div>
        </div>

        <div className="profile-list-wrapper">
          <h2 className="profile-list-title">Mes favoris</h2>
          <div className="profile-list">
            <CarousselLarge
              items={favorites}
              isProfilePage={true}
              onRemoveFav={removeFavorite}
              onRemoveWatch={removeToWatch}
              style={width}
            />
          </div>
        </div>

        <div className="profile-list-wrapper">
          <h2 className="profile-list-title">Ma Watch-List</h2>
          <div className="profile-list">
            <CarousselLarge
              items={toWatch}
              isProfilePage={true}
              onRemoveFav={removeFavorite}
              onRemoveWatch={removeToWatch}
              style={width}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;

//REFACTO !!
//raccourcir le trait sous les carousel favorite et watch

/*  <h3>Bio</h3>
          <div className="profile-infos-pencil">
            <p className="profile-max-width">
              Curieuse de tout, souvent touchée par les histoires bien
              racontées, sans forcément aller chercher le spectaculaire. J’aime
              prendre le temps de regarder, de comprendre, de ressentir.
            </p>
            <button type="button" className="profile-hidden-btn">
              <img src={Pencil} alt="pencil" className="pencil-img" />
            </button>
          </div>
          <h3>Réplique favorite</h3>
          <div className="profile-infos-pencil">
            <p>“Life is like a box of chocolates.”</p>
            <button type="button" className="profile-hidden-btn">
              <img src={Pencil} alt="pencil" className="pencil-img" />
            </button>
          </div>
 */
