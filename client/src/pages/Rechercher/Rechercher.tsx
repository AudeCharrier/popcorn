import { useEffect, useState } from "react";
import "./Rechercher.css";
import { useParams } from "react-router";
import LittleCard from "../../components/LittleCard/LittleCard";
import SortFilter from "../../components/SortFilter/SortFilter";

type Movie = {
  id: number;
  title?: string;
  name?: string;
  vote_average: number;
  release_date: string;
  first_air_date: string;
  overview: string;
  poster_path: string;
};

function Rechercher() {
  const { id } = useParams();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Movie[]>([]);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };

    // Films
    fetch(
      "https://api.themoviedb.org/3/movie/popular?language=fr-FR&page=1",
      options,
    )
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results);
      });

    // Séries
    fetch(
      "https://api.themoviedb.org/3/tv/popular?language=fr-FR&page=1",
      options,
    )
      .then((res) => res.json())
      .then((data) => {
        setSeries(data.results);
      });
  }, []);

  if (id === "1") {
    return (
      <section className="container">
        <SortFilter />
        <div className="Rechercher">
          {movies.map((item) => (
            <LittleCard
              key={item.id}
              title={item.title || item.name || ""}
              vote_average={item.vote_average}
              release_date={
                item.release_date?.split("-")?.reverse().join("/") ||
                item.first_air_date?.split("-").reverse().join("/")
              }
              overview={item.overview.slice(0, 200)}
              poster_path={item.poster_path}
            />
          ))}
        </div>
      </section>
    );
  }

  if (id === "2") {
    return (
      <section className="container">
        <SortFilter />
        <div className="Rechercher">
          {series.map((item) => (
            <LittleCard
              key={item.id}
              title={item.title || item.name || ""}
              vote_average={item.vote_average}
              release_date={
                item.release_date?.split("-").reverse().join("/") ||
                item.first_air_date?.split("-").reverse().join("/") ||
                ""
              }
              overview={item.overview.slice(0, 200)}
              poster_path={item.poster_path}
            />
          ))}
        </div>
      </section>
    );
  }

  return <div>Aucun résultat</div>;
}

export default Rechercher;
