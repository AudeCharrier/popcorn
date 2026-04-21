import { useState } from "react";
import { Link } from "react-router";
import action from "../../assets/images/emoji-action.png";
import animation from "../../assets/images/emoji-animation.png";
// IMAGES
import rire from "../../assets/images/emoji-comedie.png";
import drame from "../../assets/images/emoji-drame.png";
import fun from "../../assets/images/emoji-fun.png";
import guerre from "../../assets/images/emoji-guerre.png";
import romance from "../../assets/images/emoji-romance.png";
import scifi from "../../assets/images/emoji-science-fiction.png";
import prof from "../../assets/images/Simon.png";
import "./BoxMoodEmoji.css";

export default function BoxMoodEmoji() {
  const [active, setActive] = useState<number | null>(null);

  type Mood = {
    id: number;
    image: string;
    label: string;
    color: string;
    path: string;
    genres: number[];
  };

  const moods: Mood[] = [
    {
      id: 1,
      image: rire,
      label: "Comédie",
      color: "#FFD700",
      path: "comedie",
      genres: [35],
    },
    {
      id: 2,
      image: romance,
      label: "Romance",
      color: "#FF4FC3",
      path: "romance",
      genres: [10749, 18],
    },
    {
      id: 3,
      image: scifi,
      label: "Sci-Fi",
      color: "#7B61FF",
      path: "scifi",
      genres: [878, 28],
    },

    {
      id: 4,
      image: guerre,
      label: "Guerre",
      color: "#FF3B3B",
      path: "guerre",
      genres: [10752, 18],
    },
    {
      id: 5,
      image: drame,
      label: "Drame",
      color: "#2F4F4F",
      path: "drame",
      genres: [18],
    },
    {
      id: 6,
      image: prof,
      label: "thriller",
      color: "#0B1D3A",
      path: "thriller",
      genres: [53],
    },
    {
      id: 7,
      image: animation,
      label: "Animation",
      color: "#39FF14",
      path: "animation",
      genres: [16, 10751],
    },
    {
      id: 8,
      image: fun,
      label: "Fun",
      color: "#FFA500",
      path: "aventure",
      genres: [12],
    },
    {
      id: 9,
      image: action,
      label: "Action",
      color: "#00BFFF",
      path: "action",
      genres: [28, 53],
    },
  ];

  return (
    <div className="mood-container">
      <h3 className="mood-title">FILMS PAR AMBIANCE</h3>

      <div className="mood-box">
        {moods.map((mood, index) => (
          <Link
            key={mood.id}
            to={`/rechercher/${mood.path}`}
            className={`mood-circle 
              ${active === index ? "active" : ""} 
              ${mood.label === "Legend" ? "mood-special" : ""}
            `}
            style={{ backgroundColor: mood.color }}
            onClick={() => setActive(index)}
          >
            <img src={mood.image} alt={mood.label} />
          </Link>
        ))}
      </div>
    </div>
  );
}
