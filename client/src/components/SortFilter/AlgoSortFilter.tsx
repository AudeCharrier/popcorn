const movies = [
  {
    title: "Eclipse of Tomorrow",
    vote_average: 7.8,
    release_date: "2023-06-14",
    overview:
      "In a near future, a scientist discovers a way to predict global disasters.",
    poster_path: "/eclipse_tomorrow.jpg",
    popularite: 1245,
    genres: [
      { id: 1, name: "sci-fi" },
      { id: 7, name: "drame" },
    ],
  },
  {
    title: "Silent Horizon",
    vote_average: 6.5,
    release_date: "2021-11-02",
    overview: "A lone astronaut drifts beyond known space.",
    poster_path: "/silent_horizon.jpg",
    popularite: 845,
    genres: [
      { id: 1, name: "sci-fi" },
      { id: 6, name: "aventure" },
    ],
  },
  {
    title: "Fragments of Us",
    vote_average: 8.3,
    release_date: "2022-02-18",
    overview: "A story about memory and love after a tragic accident.",
    poster_path: "/fragments_us.jpg",
    popularite: 1560,
    genres: [
      { id: 7, name: "drame" },
      { id: 3, name: "romance" },
    ],
  },
  {
    title: "Neon Streets",
    vote_average: 7.1,
    release_date: "2020-09-25",
    overview: "A hacker uncovers a massive conspiracy.",
    poster_path: "/neon_streets.jpg",
    popularite: 980,
    genres: [
      { id: 2, name: "action" },
      { id: 1, name: "sci-fi" },
    ],
  },
  {
    title: "The Last Garden",
    vote_average: 8.9,
    release_date: "2024-04-10",
    overview: "A botanist tries to save the last ecosystem.",
    poster_path: "/last_garden.jpg",
    popularite: 2100,
    genres: [
      { id: 7, name: "drame" },
      { id: 6, name: "aventure" },
    ],
  },
  {
    title: "Broken Signals",
    vote_average: 5.9,
    release_date: "2019-07-30",
    overview: "A journalist exposes a dangerous network.",
    poster_path: "/broken_signals.jpg",
    popularite: 620,
    genres: [{ id: 7, name: "drame" }],
  },
  {
    title: "Echoes in the Dark",
    vote_average: 7.6,
    release_date: "2023-10-31",
    overview: "A woman hears mysterious voices.",
    poster_path: "/echoes_dark.jpg",
    popularite: 1320,
    genres: [
      { id: 7, name: "drame" },
      { id: 9, name: "thriller" },
    ],
  },
  {
    title: "Parallel Lives",
    vote_average: 8.1,
    release_date: "2022-12-05",
    overview: "Two people live the same life in parallel worlds.",
    poster_path: "/parallel_lives.jpg",
    popularite: 1740,
    genres: [
      { id: 1, name: "sci-fi" },
      { id: 3, name: "romance" },
    ],
  },
  {
    title: "Dust and Steel",
    vote_average: 6.8,
    release_date: "2021-03-12",
    overview: "Survivors navigate a post-apocalyptic world.",
    poster_path: "/dust_steel.jpg",
    popularite: 910,
    genres: [
      { id: 2, name: "action" },
      { id: 6, name: "aventure" },
    ],
  },
  {
    title: "The Infinite Loop",
    vote_average: 9.2,
    release_date: "2024-01-20",
    overview: "A programmer trapped in a time loop.",
    poster_path: "/infinite_loop.jpg",
    popularite: 2500,
    genres: [
      { id: 1, name: "sci-fi" },
      { id: 7, name: "drame" },
    ],
  },
  {
    title: "Love & Laughter",
    vote_average: 7.4,
    release_date: "2020-02-14",
    overview: "A chaotic romantic comedy.",
    poster_path: "/love_laughter.jpg",
    popularite: 1100,
    genres: [
      { id: 4, name: "comédie" },
      { id: 3, name: "romance" },
    ],
  },
  {
    title: "Battlefront Echo",
    vote_average: 8.0,
    release_date: "2023-05-08",
    overview: "A soldier struggles during wartime.",
    poster_path: "/battlefront_echo.jpg",
    popularite: 1400,
    genres: [
      { id: 5, name: "guerre" },
      { id: 7, name: "drame" },
    ],
  },
  {
    title: "Jungle Quest",
    vote_average: 6.9,
    release_date: "2021-08-19",
    overview: "An expedition deep into an unknown jungle.",
    poster_path: "/jungle_quest.jpg",
    popularite: 970,
    genres: [
      { id: 6, name: "aventure" },
      { id: 2, name: "action" },
    ],
  },
  {
    title: "Cartoon Chaos",
    vote_average: 7.0,
    release_date: "2022-06-01",
    overview: "Animated characters break out of their world.",
    poster_path: "/cartoon_chaos.jpg",
    popularite: 1300,
    genres: [
      { id: 8, name: "animation" },
      { id: 4, name: "comédie" },
    ],
  },
  {
    title: "Hearts at War",
    vote_average: 7.7,
    release_date: "2023-11-11",
    overview: "A love story during wartime.",
    poster_path: "/hearts_war.jpg",
    popularite: 1500,
    genres: [
      { id: 5, name: "guerre" },
      { id: 3, name: "romance" },
      { id: 7, name: "drame" },
    ],
  },
];

type Movie = {
  id?: number;
  title?: string;
  name?: string;
  vote_average: number;
  release_date: string;
  first_air_date?: string;
  overview: string;
  poster_path: string;
  genres: Genre[];
};

type Genre = {
  id: number;
  name: string;
};

//faux tableau : trier par une clé

//SORT
//NUMBERS

//sort compare les elements 2 à 2. par defaut il trie en croissant :
// si différence > 0 : il switche les 2. si différence < 0 : il switche pas
//pour inverser le tri :
/*a-b > 0 -> a >b -> il inverse
or là on veut garder l'ordre decroissant
donc on fait b-a < 0 -> b < a -> il inverse pas et on reste bien decroissant*/

function _sortCroissant(arrayMedias: Movie[]) {
  return arrayMedias.sort((a, b) => a.vote_average - b.vote_average);
}
/* 
console.log(sortCroissant(movies)) */

function _sortDecroissant(arrayMedias: Movie[]) {
  return arrayMedias.sort((a, b) => b.vote_average - a.vote_average);
}

/* console.log(sortDecroissant(movies)) */

//je dois récup ce qui est affiché dans grdi-cards : classe .Rechercher
//quand on clique sur un bouton croissant/decr de trier,
//je lui injecte les données de grid-cards avec props
//il doit trier selon le bouton cliqué

//STRING

/* function sortCroisantString(array) {
  return array.sort((a, b) => a.release_date.localeCompare(b.release_date));
}
 
/* console.log(sortCroisantString(movies)) */

/* function sortDecroisantString(array) {
  return array.sort((a, b) => b.release_date.localeCompare(a.release_date));
}

console.log(sortDecroisantString(movies))   */

//FILTER

//GENRES

type GenresId = number[];

const idGenresToFilter = [5, 6]; //extraits des checkbox genres checked

function filterGenres(arrayMedias: Movie[], arrayGenresId: GenresId) {
  return arrayMedias.filter((element) =>
    element.genres.some((genre) => arrayGenresId.includes(genre.id)),
  );
}

console.log(filterGenres(movies, idGenresToFilter));

//idme pour types : associer un id 1 ou 2 aux checkbox films/series... actualiser useparams ?

//fetch api movies => setMovies (toutes les infos api)

//qqn fait une recherche sans préciser films séries (ou en cochant les 2)
//ON PART DE RESULTATS MOVIES + SERIES : results  (avec set)
//dans le .map, il faut faire un usestate : {affichage}.map
//set affichage -> results

//l'utilisateur filtre seulement un type de media : il a checked (ou uncheck l'autre)

//au check, actvier la fonction :
//fonction ??:
//--> prend dans results (ou movies ? quand il fera rech faut partir de movies)
// et filtre : item.media_type === "movie" -> setfiltermovies //si aucun -> setfitlermovies à vide ?
//si filtre-films checked :
//return -> setaffichage ->filtermovies
//si filtre-films uncheck :
//return ->  setfiltermovies à vide

//code a améliorer

//IDEAL
// la fonction a les données filtrées, mais ça s'affiche seulement si c coché/décoché. elle ne recalcule pas
