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

type Mood = {
  id: number;
  image: string;
  label: string;
  color: string;
  path: string;
};

const moods: Mood[] = [
  {
    id: 1,
    image: rire,
    label: "Comédie",
    color: "#FFD700",
    path: "/movies/comedie",
  },
  {
    id: 2,
    image: romance,
    label: "Romance",
    color: "#FF4FC3",
    path: "/movies/romance",
  },
  {
    id: 3,
    image: guerre,
    label: "Guerre",
    color: "#FF3B3B",
    path: "/movies/guerre",
  },
  {
    id: 4,
    image: scifi,
    label: "Sci-Fi",
    color: "#7B61FF",
    path: "/movies/scifi",
  },
  {
    id: 5,
    image: prof,
    label: "Legend",
    color: "#0B1D3A",
    path: "/movies/legend",
  },
  {
    id: 6,
    image: drame,
    label: "Drame",
    color: "#2F4F4F",
    path: "/movies/drame",
  },
  {
    id: 7,
    image: animation,
    label: "Animation",
    color: "#39FF14",
    path: "/movies/animation",
  },
  {
    id: 8,
    image: fun,
    label: "Fun",
    color: "#FFA500",
    path: "/movies/aventure",
  },
  {
    id: 9,
    image: action,
    label: "Action",
    color: "#00BFFF",
    path: "/movies/action",
  },
];

export default function BoxMoodEmoji() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="mood-container">
      <h3 className="mood-title">FILMS PAR AMBIANCE</h3>

      <div className="mood-box">
        {moods.map((mood, index) => (
          <Link
            key={mood.id}
            to={mood.path}
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
