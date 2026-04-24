import { createContext, type Dispatch, type SetStateAction } from "react";

type SearchResult = {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  genre_ids?: number[];
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  poster_path: string | null;
  popularity: number;
};

type Filters = {
  mediaTypes: number[];
  genres: number[];
  keyword: string;
};

type SearchContextType = {
  results: SearchResult[];
  affichage: SearchResult[];
  setAffichage: Dispatch<SetStateAction<SearchResult[]>>;
  activeFilters: Filters;
  setActiveFilters: Dispatch<SetStateAction<Filters>>;
};

const SearchContext = createContext<SearchContextType>({
  results: [],
  affichage: [],
  setAffichage: () => {},
  activeFilters: { mediaTypes: [], genres: [], keyword: "" },
  setActiveFilters: () => {},
});

export default SearchContext;
export type { Filters, SearchResult };
