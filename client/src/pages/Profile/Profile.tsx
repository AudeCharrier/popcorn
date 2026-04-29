import { useEffect, useState } from "react";
import BadgeWatcher from "../../assets/images/badge_watcher_amateur.png";
import Nina from "../../assets/images/Nina.png";
import Pencil from "../../assets/images/pencil.webp";
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
  const carouselLarge = {
    width: "65vw",
    paddingLeft: "1.4rem",
    paddingRight: "0.4rem",
  };

  const [favorites, setFavorites] = useState<CarouselItem[]>([]);

  /*recuperer la liste favorites*/
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(stored);
  }, []);
  /*supprimer un favori*/
  const removeFavorite = (id: number) => {
    const updated = favorites.filter((movie) => movie.id !== id);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  const [toWatch, setToWatch] = useState<CarouselItem[]>([]);
  /*recuperer la liste watch*/
  useEffect(() => {
    const watchStored = JSON.parse(localStorage.getItem("towatch") || "[]");
    setToWatch(watchStored);
  }, []);
  /*supprimer un watch*/
  const removeToWatch = (id: number) => {
    const watchUpdated = toWatch.filter((movie) => movie.id !== id);
    localStorage.setItem("towatch", JSON.stringify(watchUpdated));
    setToWatch(watchUpdated);
  };

  return (
    <section className="profile-general-wrapper">
      <aside className="profile-menu">
        <ul className="profile-menu-list">
          <li className="profile-menu-titles profile-menu-my-profile profile-desktop">
            NinaRichard
          </li>
          <li className="profile-menu-titles profile-mobile">
            <img src={Nina} alt="avatar-nina" className="profile-avatar-nina" />
          </li>
          <li>
            <a href="#compte" className="profile-menu-titles" id="mon-compte">
              Mon Compte
            </a>
          </li>
          <li>
            <a href="#favoris" className="profile-menu-titles" id="mes-favoris">
              Mes Favoris
            </a>
          </li>
          <li>
            <a
              href="#watch-list"
              className="profile-menu-titles"
              id="ma-watch-list"
            >
              Ma Watch-List
            </a>
          </li>
          <li>
            <a
              href="#compte"
              className="profile-menu-titles"
              id="mes-parametres"
            >
              Paramètres
            </a>
          </li>
          <li>
            <p className="profile-menu-titles" id="deconnexion">
              Déconnexion
            </p>
          </li>
        </ul>
      </aside>
      <section className="profile-layout" id="compte">
        <h2 className="profile-account-title profile-list-title">Mon compte</h2>
        <div className="profile-account-wrapper">
          <div className="profile-my-account">
            <h3>Pseudo</h3>
            <div className="profile-infos-pencil">
              <p>NinaRichard</p>
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
              Ajoute encore 10 films en favoris pour passer au rang supérieur !
            </p>
            <p> Membre depuis le 24/04/26</p>
          </div>
        </div>

        <div className="profile-list-wrapper" id="favoris">
          <h2 className="profile-list-title">Mes favoris</h2>
          <div className="profile-list">
            <CarousselLarge
              items={favorites}
              isProfilePage={true}
              listType="favorites"
              onRemoveFav={removeFavorite}
              style={carouselLarge}
            />
          </div>
        </div>

        <div className="profile-list-wrapper" id="watch-list">
          <h2 className="profile-list-title">WATCH-LIST</h2>
          <div className="profile-list">
            <CarousselLarge
              items={toWatch}
              isProfilePage={true}
              listType="watchlist"
              onRemoveWatch={removeToWatch}
              style={carouselLarge}
            />
          </div>
        </div>
      </section>
    </section>
  );
}

export default Profile;

//REFACTO !!
