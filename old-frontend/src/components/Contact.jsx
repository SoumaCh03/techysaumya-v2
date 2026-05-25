import React, { useState } from "react";
import emailjs from "@emailjs/browser";

// Initialize EmailJS once
emailjs.init({
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
});

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  // SOCIAL LINKS
  const socialLinks = [
    {
      icon: "G",
      url: "https://github.com/SoumaCh03",
    },
    {
      icon: "f",
      url: "https://facebook.com",
    },
    {
      icon: "in",
      url: "https://www.linkedin.com/in/saumyadeep-c-34342a177/",
    },
    {
      icon: "ig",
      url: "https://instagram.com",
    },
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          time: new Date().toLocaleString(),
        }
      );

      alert("Thank you! Message sent successfully ✅");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("EMAILJS ERROR:", error);
      alert("Sorry, failed to send message ❌");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      style={{
        height: "auto",
        background: "rgba(3, 7, 18, 0.72)",
        padding: "100px 80px",
        color: "#E8F4FF",
      }}
    >
      <h2
        style={{
          fontSize: "3rem",
          marginBottom: "20px",
          textShadow: "0 0 18px rgba(0,255,255,0.15)",
        }}
      >
        Let's Connect
      </h2>

      <p
        style={{
          opacity: 0.75,
          marginBottom: "50px",
          fontSize: "1.1rem",
        }}
      >
        Feel free to reach out for collaborations,
        opportunities, or just a friendly chat.
      </p>

      <div
        className="contact-layout"
        style={{
          display: "flex",
          gap: "50px",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT FORM */}
        <form
          onSubmit={handleSubmit}
          style={{
            flex: 1.3,
            minWidth: "350px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <textarea
            name="message"
            placeholder="Your message..."
            rows="6"
            value={formData.message}
            onChange={handleChange}
            required
            style={{
              ...inputStyle,
              minHeight: "180px",
              resize: "none",
            }}
          />

          <button
            type="submit"
            disabled={sending}
            style={{
              padding: "16px 28px",
              background: "#00FFFF",
              color: "#030712",
              border: "none",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(0,255,255,0.35)",
              transition: "0.3s ease",
              width: "fit-content",
            }}
          >
            {sending ? "Sending..." : "SEND MESSAGE"}
          </button>
        </form>

        {/* RIGHT PANEL */}
        <div
          style={{
            flex: 1,
            minWidth: "300px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(0,255,255,0.1)",
              borderRadius: "18px",
              padding: "30px",
              marginBottom: "30px",
            }}
          >
            <p style={{ marginBottom: "18px" }}>
              <strong>Email:</strong><br />
              saumyadeephere@zohomail.in
            </p>

            <p>
              <strong>Address:</strong><br />
              H. N. Road Bye-Lane, East Hazrapara,
              Rupshi house, Cooch Behar,
              West Bengal, India.
            </p>
          </div>

          <h3 style={{ marginBottom: "20px" }}>Find me on</h3>

          <div
            style={{
              display: "flex",
              gap: "18px",
              flexWrap: "wrap",
            }}
          >
            {socialLinks.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    border: "1px solid rgba(0,255,255,0.2)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 0 12px rgba(0,255,255,0.06)",
                    color: "#E8F4FF",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 22px rgba(0,255,255,0.55)";
                    e.currentTarget.style.border =
                      "1px solid rgba(0,255,255,0.8)";
                    e.currentTarget.style.transform =
                      "translateY(-4px) scale(1.06)";
                    e.currentTarget.style.background =
                      "rgba(0,255,255,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 12px rgba(0,255,255,0.06)";
                    e.currentTarget.style.border =
                      "1px solid rgba(0,255,255,0.2)";
                    e.currentTarget.style.transform =
                      "translateY(0) scale(1)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {item.icon}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const inputStyle = {
  width: "100%",
  padding: "18px 20px",
  borderRadius: "14px",
  border: "1px solid rgba(0,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  color: "#E8F4FF",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};