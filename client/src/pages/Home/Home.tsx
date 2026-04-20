import { useEffect, useState } from "react";
import BoxMoodEmoji from "../../components/BoxMoodEmoji/BoxMoodEmoji";
import CarousselCourt from "../../components/CarousselCourt/CarousselCourt";
import CarousselLarge from "../../components/CarousselLarge/CarousselLarge";
import "./Home.css";

type CarouselItem = {
  id: number;
  title: string;
  vote_average: number;
  release_date: string;
  overview: string;
  poster_path: string;
  media_type: "movie" | "tv";
};

type CarousselProps = {
  id?: number;
  items?: CarouselItem[];
};

function Home({ items }: CarousselProps) {
  const [movieLike, setMovieLike] = useState<CarouselItem[]>([]);
  console.log(items);

  const [currentMovie, setCurrentMovie] = useState<CarouselItem[]>([]);

  const [upcomingMovie, setUpcomingMovie] = useState<CarouselItem[]>([]);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };
    fetch(
      "https://api.themoviedb.org/3/movie/popular?language=fr-FR&page=1",
      options,
    )
      .then((res) => res.json())
      .then((res) => {
        const moviesWithImages = res.results.map((movie: CarouselItem) => ({
          ...movie,
          poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }));
        setMovieLike(moviesWithImages);
      });

    fetch(
      "https://api.themoviedb.org/3/movie/now_playing?language=fr-FR&page=2",
      options,
    )
      .then((res) => res.json())
      .then((res) => {
        const moviesWithImages = res.results.map((movie: CarouselItem) => ({
          ...movie,
          poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }));
        setCurrentMovie(moviesWithImages);
      });

    fetch(
      "https://api.themoviedb.org/3/movie/upcoming?language=fr-FR&page=2",
      options,
    )
      .then((res) => res.json())
      .then((res) => {
        const moviesWithImages = res.results.map((movie: CarouselItem) => ({
          ...movie,
          poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }));
        setUpcomingMovie(moviesWithImages);
      });
  }, []);

  if (movieLike.length === 0) return <p>Chargement...</p>;

  return (
    <div className="wrapper">
      <div className="Banniere-picture"></div>
      <div className="home-heart">
        <h2 className="titre-coup">COUP DE COEUR</h2>
        <CarousselLarge items={movieLike} />
      </div>

      <div className="block-control">
        <div className="home-current">
          <div className="home-current__block">
            <h2 className="titre-current">PROCHAINEMENT</h2>
            <CarousselCourt items={currentMovie} />
          </div>
          <div className="home-current__block">
            <h2 className="titre-current">ACTUELLEMENT EN SALLE</h2>
            <CarousselCourt items={upcomingMovie} />
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
