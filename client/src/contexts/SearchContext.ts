import { createContext } from "react";

type SearchResult = {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  poster_path: string | null;
};

const SearchContext = createContext({
  results: [] as SearchResult[],
  affichage: [] as SearchResult[],
  setAffichage: (_: SearchResult[]) => {},
});
export default SearchContext;
