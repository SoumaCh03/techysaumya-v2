"use client";

import React from "react";
import Link from "next/link";
import { FaWhatsapp, FaTelegramPlane, FaFileAlt } from "react-icons/fa";

export default function SocialFloat() {
  const [mounted, setMounted] = React.useState(false);
  const [greeting, setGreeting] = React.useState("Good Day");

  React.useEffect(() => {
    setMounted(true);
    // Dynamically calculate greeting based on client browser local time
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 12) {
      setGreeting("Good Morning");
    } else if (hr >= 12 && hr < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  const currentGreeting = mounted ? greeting : "Good Day";
  const defaultMessage = `Hi, Saumyadeep (${currentGreeting}). I'm [Your Name]. Glad to be here. Can we start a chat?`;
  
  const baseWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/919647084566";
  const whatsappUrl = baseWhatsapp.includes("text=") 
    ? baseWhatsapp 
    : `${baseWhatsapp}${baseWhatsapp.includes("?") ? "&" : "?"}text=${encodeURIComponent(defaultMessage)}`;

  const baseTelegram = process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/SaumyaCh";
  const telegramUrl = baseTelegram.includes("text=") 
    ? baseTelegram 
    : `${baseTelegram}${baseTelegram.includes("?") ? "&" : "?"}text=${encodeURIComponent(defaultMessage)}`;

  return (
    <>
      <style>{`
        .social-float-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          z-index: 45;
        }

        .social-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 26px;
          transition: all 0.3s ease;
          position: relative;
        }

        .social-btn:hover {
          transform: translateY(-4px) scale(1.05);
        }

        .social-btn-whatsapp {
          background-color: #25D366;
          box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
          animation: whatsapp-pulse 2s infinite;
        }

        .social-btn-telegram {
          background-color: #0088cc;
          box-shadow: 0 0 0 0 rgba(0, 136, 204, 0.7);
          animation: telegram-pulse 2s infinite;
          animation-delay: 0.5s;
        }

        .social-btn-resume {
          background-color: #0B0B0B;
          color: #00F0FF;
          border: 1.5px solid rgba(0, 240, 255, 0.45);
          box-shadow: 0 0 15px rgba(0, 240, 255, 0.15);
          animation: resume-pulse 2s infinite;
          animation-delay: 1s;
          font-size: 22px;
        }

        .social-btn-resume:hover {
          background-color: #00F0FF;
          color: #050505;
          border-color: #00F0FF;
          box-shadow: 0 0 25px rgba(0, 240, 255, 0.6);
        }

        @keyframes whatsapp-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5);
          }
          70% {
            box-shadow: 0 0 0 16px rgba(37, 211, 102, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }

        @keyframes telegram-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 136, 204, 0.5);
          }
          70% {
            box-shadow: 0 0 0 16px rgba(0, 136, 204, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 136, 204, 0);
          }
        }

        @keyframes resume-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 240, 255, 0.5);
          }
          70% {
            box-shadow: 0 0 0 16px rgba(0, 240, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 240, 255, 0);
          }
        }

        @media (max-width: 768px) {
          .social-float-container {
            bottom: 16px;
            right: 16px;
            gap: 10px;
          }
          .social-btn {
            width: 44px;
            height: 44px;
            font-size: 20px;
          }
          .social-btn-resume {
            font-size: 17px;
          }
        }

        @media print {
          .social-float-container {
            display: none !important;
          }
        }
      `}</style>
      <div className="social-float-container">
        {/* Resume Button */}
        <Link
          href="/resume"
          className="social-btn social-btn-resume"
          aria-label="Interactive Resume"
          title="Interactive Resume"
        >
          <FaFileAlt className="drop-shadow-md" />
        </Link>

        {/* Telegram Button */}
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn social-btn-telegram"
          aria-label="Chat on Telegram"
          title="Chat on Telegram"
        >
          <FaTelegramPlane className="drop-shadow-md" />
        </a>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn social-btn-whatsapp"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
        >
          <FaWhatsapp className="drop-shadow-md" />
        </a>
      </div>
    </>
  );
}
