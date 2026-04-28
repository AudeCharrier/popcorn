import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import logoCalendrier from "../../assets/images/logo-calendrier.png";
import logoCoeur from "../../assets/images/logo-coeur.png";
import logoPopcorn from "../../assets/images/logo-popcorn.png";
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
  type: "movie" | "tv";
};

type MovieDetails = {
  id: number;
  title: string;
  vote_average: number;
  release_date: string;
  overview: string;
  runtime: number;
};

type CarousselProps = {
  id?: number;
  items?: CarouselItem[];
};

function Home({ items }: CarousselProps) {
  const navigate = useNavigate();

  const [movieLike, setMovieLike] = useState<CarouselItem[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<MovieDetails | null>(null);
  const [currentMovie, setCurrentMovie] = useState<CarouselItem[]>([]);
  const [upcomingMovie, setUpcomingMovie] = useState<CarouselItem[]>([]);
  const [trailerUrl, setTrailerUlr] = useState<string | null>(null);
  const [hasTrailer, setHasTrailer] = useState(false);

  console.log(items);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };

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

        const firstMovieId =
          res.results[Math.floor(Math.random() * res.results.length)].id;
        return fetch(
          `https://api.themoviedb.org/3/movie/${firstMovieId}?language=fr-FR&append_to_response=videos`,
          options,
        );
      })
      .then((res) => res.json())
      .then((movieDetails) => {
        setFeaturedMovie({
          id: movieDetails.id,
          title: movieDetails.title,
          vote_average: movieDetails.vote_average,
          release_date: movieDetails.release_date,
          overview: movieDetails.overview,
          runtime: movieDetails.runtime,
        });
        const trailer = movieDetails.videos.results.find(
          (video: { site: string; type: string; key: string }) =>
            video.site === "YouTube" && video.type === "Trailer",
        );
        if (trailer) {
          setTrailerUlr(`https://www.youtube.com/watch?v=${trailer.key}`);
          setHasTrailer(true);
        } else {
          setHasTrailer(false);
        }
      });
  }, []);

  if (movieLike.length === 0) return <p>Chargement...</p>;

  return (
    <div className="wrapper">
      <div className="Banniere-picture">
        <div className="texte-bloc">
          {featuredMovie && (
            <div className="featured-film">
              <div className="featured-badge">COUP DE CŒUR DE LA SEMAINE</div>

              <h2 className="featured-title">{featuredMovie.title}</h2>

              <div className="featured-infos">
                <p>⭐ {(featuredMovie.vote_average / 2).toFixed(1)}/5</p>
                <p>{new Date(featuredMovie.release_date).getFullYear()}</p>
                <p>{featuredMovie.runtime} min</p>
              </div>

              <p className="featured-description">{featuredMovie.overview}</p>

              <div className="featured-buttons">
                <button
                  type="button"
                  className="btn-voir"
                  onClick={() =>
                    navigate(`/films-series/movie/${featuredMovie.id}`)
                  }
                >
                  VOIR LE FILM
                </button>
                {hasTrailer && (
                  <button
                    type="button"
                    className="btn-bande"
                    onClick={() =>
                      trailerUrl && window.open(trailerUrl, "_blank")
                    }
                  >
                    ▶ BANDE-ANNONCE
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* MOOD */}
      <div className="home-mood">
        <BoxMoodEmoji />
      </div>
      <div className="home-heart">
        <div className="home-heart__block">
          <div className="home-title">
            <img src={logoCoeur} alt="Coeur" className="home-title-icon" />
            <h2 className="titre-coup">COUP DE COEUR</h2>
          </div>

          <CarousselLarge items={movieLike} />
        </div>
      </div>

      <div className="block-control">
        <div className="home-current">
          <div className="home-current__block">
            <div className="home-title">
              <img
                src={logoCalendrier}
                alt="Calendrier"
                className="home-title-icon"
              />

              <h2 className="titre-current">ACTUELLEMENT EN SALLE</h2>
            </div>

            <CarousselCourt items={currentMovie} />
          </div>

          <div className="home-current__block">
            <div className="home-title">
              <img
                src={logoPopcorn}
                alt="Popcorn"
                className="home-title-icon"
              />

              <h2 className="titre-current">PROCHAINEMENT</h2>
            </div>

            <CarousselCourt items={upcomingMovie} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
