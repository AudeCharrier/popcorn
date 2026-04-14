import "./Footer.css";
import logoFacebook from "../../assets/images/facebook-icon.png";
import logoInstagram from "../../assets/images/instagram-logo.png";
import logoTiktok from "../../assets/images/tiktok-logo.png";
import logoX from "../../assets/images/twitter-logo.png";

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-copy">© 2026 Popcorn. Tous droits réservés.</p>
      <div className="footer-logo-link">
        <a
          href="https://x.com/?lang=fr"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={logoX} className="logo-col" alt="Logo X" />
        </a>
        <a
          href="https://www.facebook.com/?locale=fr_FR"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={logoFacebook} className="logo-footer" alt="Logo facebook" />
        </a>
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={logoInstagram}
            className="logo-footer"
            alt="Logo Instagram"
          />
        </a>
        <a
          href="https://www.tiktok.com/fr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={logoTiktok} className="logo-col" alt="Logo Tiktok" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
