import "./CinemaCard.css";

function CinemaCard() {
  return (
    <div className="cinema-card">
      <img
        src="https://salles-cinema.com/wp-content/uploads/2014/11/gaumont-reims_02.jpg"
        alt="image-cinema"
      />
      <h2>Ville</h2>
      <p>Cinema</p>
      <a href="https://www.bing.com/ck/a?!&&p=59cfc227577053634f554a0ab54cd7cc9684d61354b7129dce7f7df92f23dc65JmltdHM9MTc3NjAzODQwMA&ptn=3&ver=2&hsh=4&fclid=36b83380-2772-631d-17d8-26712692623e&u=a1aHR0cHM6Ly93d3cuYmluZy5jb20vYWxpbmsvbGluaz91cmw9aHR0cHMlM2ElMmYlMmZ3d3cucGF0aGUuZnIlMmZjaW5lbWFzJTJmY2luZW1hLXBhdGhlLXdpbHNvbiZzb3VyY2U9c2VycC1sb2NhbCZoPUR2ajB3V2phYk1jVEFDamtBdUFPeiUyYlJqSjlxYlhvYiUyZnBJUlNVeVZ4aWpjJTNkJnA9bHdfbWFnc3R3dCZpZz0wMUNFNTA4NDY0Mjg0ODc3QTEzM0U1MDkzNkQ1NjhFMCZ5cGlkPVlOOTY3OEE0NDQxRUYzREUzNw">
        Voir les séances
      </a>
    </div>
  );
}

export default CinemaCard;
