export default function Footer() {
  const isMobile = window.innerWidth <= 768;

  const socialStyle = {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    border: "1px solid rgba(0,255,255,0.25)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#E8F4FF",
    background: "rgba(255,255,255,0.02)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 0 12px rgba(0,255,255,0.08)",
    textDecoration: "none",
  };

  const iconStyle = {
    width: "24px",
    height: "24px",
    fill: "#E8F4FF",
  };

  return (
    <footer
      style={{
        background: "#030712",
        color: "#E8F4FF",
        padding: isMobile ? "60px 20px 25px" : "70px 60px 25px",
        fontFamily: "Arial",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: isMobile ? "40px" : "50px",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT SIDE SOCIALS */}
        <div
          style={{
            flex: 1,
            minWidth: isMobile ? "100%" : "300px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: isMobile ? "auto" : "300px",
          }}
        >
          <h3
            style={{
              marginBottom: "28px",
              fontSize: isMobile ? "1.8rem" : "2rem",
              fontWeight: "700",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            Connect With Me
          </h3>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            {/* GitHub */}
            <a
              href="https://github.com/SoumaCh03"
              target="_blank"
              rel="noreferrer"
              style={socialStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(0,255,255,0.45)";
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 12px rgba(0,255,255,0.08)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <svg viewBox="0 0 24 24" style={iconStyle}>
                <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.21 11.39c.6.11.79-.26.79-.58v-2.16c-3.34.73-4.04-1.42-4.04-1.42-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.08 1.85 2.83 1.32 3.52 1 .11-.79.42-1.32.76-1.62-2.67-.31-5.47-1.33-5.47-5.91 0-1.3.46-2.36 1.22-3.2-.12-.3-.53-1.54.12-3.2 0 0 1-.32 3.3 1.22a11.4 11.4 0 016 0C17 4.6 18 4.92 18 4.92c.65 1.66.24 2.9.12 3.2.76.84 1.22 1.9 1.22 3.2 0 4.59-2.8 5.6-5.48 5.9.43.37.81 1.1.81 2.22v3.29c0 .32.19.69.8.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/SaumyanaCh03/"
              target="_blank"
              rel="noreferrer"
              style={socialStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(0,255,255,0.45)";
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 12px rgba(0,255,255,0.08)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <svg viewBox="0 0 24 24" style={iconStyle}>
                <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.47H15.2c-1.24 0-1.62.77-1.62 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0022 12z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
              style={socialStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(0,255,255,0.45)";
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 12px rgba(0,255,255,0.08)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <svg viewBox="0 0 24 24" style={iconStyle}>
                <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3.5A4.5 4.5 0 1016.5 12 4.5 4.5 0 0012 7.5zm0 7A2.5 2.5 0 1114.5 12 2.5 2.5 0 0112 14.5zm4.75-7.75a1 1 0 101 1 1 1 0 00-1-1z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/saumyadeep-c-34342a177/"
              target="_blank"
              rel="noreferrer"
              style={socialStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(0,255,255,0.45)";
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 12px rgba(0,255,255,0.08)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <svg viewBox="0 0 24 24" style={iconStyle}>
                <path d="M4.98 3.5A2.48 2.48 0 102.5 5.98 2.48 2.48 0 004.98 3.5zM3 8h4v13H3zm7 0h3.8v1.8h.05a4.17 4.17 0 013.75-2.05c4 0 4.75 2.63 4.75 6.05V21h-4v-6.3c0-1.5 0-3.42-2.08-3.42s-2.4 1.62-2.4 3.3V21h-4z" />
              </svg>
            </a>

            {/* X / Twitter */}
            <a
              href="https://x.com/ImSaumyaCh"
              target="_blank"
              rel="noreferrer"
              style={socialStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(0,255,255,0.45)";
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 12px rgba(0,255,255,0.08)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <svg viewBox="0 0 24 24" style={iconStyle}>
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.639 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.404z" />
              </svg>
            </a>
          </div>

          {/* SnappySaumya Link */}
          <div
            style={{
              marginTop: "18px",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <a
              href="https://snappysaumya.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "14px",
                color: "#67e8f9",
                textDecoration: "none",
                letterSpacing: "0.5px",
                transition: "all 0.3s ease",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow =
                  "0 0 12px rgba(0,255,255,0.7)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              📸 Explore My Photography (SnappySaumya)
            </a>
          </div>
        </div>

        {/* RIGHT SIDE MAP */}
        <div
          style={{
            flex: 1.2,
            width: "100%",
            minWidth: isMobile ? "100%" : "420px",
            maxWidth: "100%",
          }}
        >
          <h3
            style={{
              marginBottom: "20px",
              fontSize: isMobile ? "1.8rem" : "2rem",
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Location
          </h3>

          <div
            style={{
              width: "100%",
              maxWidth: "100%",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 0 20px rgba(0,255,255,0.1)",
            }}
          >
            <iframe
              title="location"
              src="https://www.google.com/maps?q=Cooch+Behar+West+Bengal&output=embed"
              width="100%"
              height={isMobile ? "260" : "300"}
              style={{
                border: 0,
                display: "block",
                width: "100%",
              }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      <p
        style={{
          opacity: 0.8,
          textAlign: "center",
          marginTop: "35px",
          fontSize: isMobile ? "0.95rem" : "1rem",
          lineHeight: "1.7",
        }}
      >
        Saumyadeep Chakraborty (TechySaumya) — Full Stack Developer,
        Backend Engineering Enthusiast, Photographer & Creative
        Technologist based in West Bengal, India.
      </p>

      <p
        style={{
          opacity: 0.7,
          textAlign: "center",
          marginTop: "18px",
          fontSize: isMobile ? "0.9rem" : "1rem",
        }}
      >
        © 2026 TechySaumya. All Rights Reserved.
      </p>

      <p
        style={{
          opacity: 0.55,
          textAlign: "center",
          marginTop: "10px",
          fontSize: isMobile ? "0.75rem" : "0.85rem",
          letterSpacing: "0.5px",
        }}
      >
        Best viewed on modern desktop & mobile browsers
        (Chrome, Edge, Firefox, Safari) at 1920 × 1080 and above.
      </p>
    </footer>
  );
}