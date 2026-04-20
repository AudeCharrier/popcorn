import { useEffect, useState } from "react";
import "./Seances.css";
// import CalendarIcon from "../../assets/images/logo-calendar.png";
// import CinemaIcon from "../../assets/images/logo-cinema.png";
// import NeonLogo from "../../assets/images/neon-actuellement-en-salle.png";
import CarousselLarge from "../../components/CarousselLarge/CarousselLarge";

type CarouselItem = {
  id: number;
  title: string;
  vote_average: number;
  release_date: string;
  overview: string;
  poster_path: string;
  media_type: "movie" | "tv";
};

function Seances() {
  const [thisWeekMovies, setThisWeekMovies] = useState<CarouselItem[]>([]);
  const [currentsMovies, setCurrentsMovies] = useState<CarouselItem[]>([]);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };

    fetch(
      "https://api.themoviedb.org/3/movie/upcoming?language=fr-FR&page=1",
      options,
    )
      .then((res) => res.json())
      .then((res) => {
        const movies = res.results.map((movie: CarouselItem) => ({
          ...movie,
          poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }));

        setThisWeekMovies(movies);
      });

    fetch(
      "https://api.themoviedb.org/3/movie/now_playing?language=fr-FR&page=1",
      options,
    )
      .then((res) => res.json())
      .then((res) => {
        const movies = res.results.map((movie: CarouselItem) => ({
          ...movie,
          poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }));

        setCurrentsMovies(movies);
      });
  }, []);

  return (
    <div className="seances-page">
      <header className="seances-header">
        {/* <img src={NeonLogo} alt="Actuellement en salle" className="neon-logo" /> */}
      </header>

      <main className="seances-content">
        <section className="seances-section">
          <div className="section-title">
            {/* <img src={CalendarIcon} alt="Calendrier" className="section-icon" /> */}
            <h2>SORTIES DE LA SEMAINE</h2>
          </div>

          <div className="carousel-container">
            <CarousselLarge items={thisWeekMovies} />
          </div>
        </section>

        <section className="seances-section">
          <div className="section-title">
            {/* <img src={CinemaIcon} alt="Cinéma" className="section-icon" /> */}
            <h2>TOUJOURS À L'AFFICHE</h2>
          </div>

          <div className="carousel-container">
            <CarousselLarge items={currentsMovies} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Seances;
