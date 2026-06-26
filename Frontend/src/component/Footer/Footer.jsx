import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        <h2>Mayur Kargatiya</h2>

        <p>
          A secure and modern note-taking application
          designed to help users organize, manage,
          and access their notes anytime.
        </p>

        <div className="footer-links">
          <span>Privacy Policy</span>
          <span>Terms & Conditions</span>
          <span>Help Center</span>
        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © 2026 Mayur Kargatiya. All Rights Reserved.
        </p>

        <p>
          🔒 Your notes are protected and securely managed.
        </p>

      </div>

    </footer>
  );
}

export default Footer;