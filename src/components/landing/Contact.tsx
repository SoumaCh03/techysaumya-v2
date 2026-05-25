"use client";

import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: null, message: "" });

    try {
      // 1. Attempt to use our secure server-side SMTP endpoint first
      const apiRes = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await apiRes.json();

      if (apiRes.ok && result.success) {
        if (result.fallbackToClient) {
          // 2. Local/production fallback to client-side EmailJS if SMTP not set up
          await fireEmailJS();
        } else {
          // Success from Server SMTP
          handleSuccess();
        }
      } else {
        // Fallback to EmailJS on direct server API errors
        await fireEmailJS();
      }
    } catch (error) {
      console.warn("Server API failed, attempting EmailJS fallback...", error);
      try {
        await fireEmailJS();
      } catch (err) {
        setStatus({
          type: "error",
          message: "Unable to dispatch message. Please email me directly.",
        });
      }
    } finally {
      setSending(false);
    }
  };

  const fireEmailJS = async () => {
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

    if (!publicKey || !serviceId || !templateId) {
      throw new Error("Missing EmailJS credentials");
    }

    emailjs.init({ publicKey });

    await emailjs.send(serviceId, templateId, {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      time: new Date().toLocaleString(),
    });

    handleSuccess();
  };

  const handleSuccess = () => {
    setStatus({
      type: "success",
      message: "Message sent successfully! I will get back to you shortly.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
    
    // Confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#00F0FF", "#FF8C42", "#ffffff"],
    });
  };

  return (
    <section
      id="contact"
      className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 relative bg-gradient-to-b from-bg-base via-bg-surface/10 to-bg-base border-b border-white/5 overflow-hidden"
    >
      <div className="absolute w-[350px] h-[350px] bg-cyan-accent/2 filter blur-[100px] bottom-0 left-0 rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Header */}
        <span className="text-[11px] font-sans font-bold tracking-[3px] uppercase text-cyan-accent mb-3">
          GET IN TOUCH
        </span>
        <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-white mb-6 text-center select-none">
          Let&apos;s Connect
        </h2>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed text-center max-w-xl mb-12 font-sans font-medium">
          Have an opportunity, a project to collaborate on, or just want to chat about code or motorcycles? Drop me a message.
        </p>

        {/* Contact Form Container */}
        <div className="w-full glass-panel border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold tracking-wider text-text-secondary mb-2 uppercase">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/40 font-sans transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-text-secondary mb-2 uppercase">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/40 font-sans transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider text-text-secondary mb-2 uppercase">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="Topic of discussion"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/40 font-sans transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider text-text-secondary mb-2 uppercase">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your thoughts..."
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/40 font-sans transition-all text-sm resize-none"
              />
            </div>

            {status.type && (
              <div
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border font-sans text-sm font-medium ${
                  status.type === "success"
                    ? "bg-cyan-accent/5 border-cyan-accent/20 text-cyan-accent"
                    : "bg-red-500/5 border-red-500/20 text-red-400"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-fit px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-accent to-cyan-500 text-bg-base font-bold text-sm tracking-wider uppercase hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Message...
                </>
              ) : (
                <>
                  Send Message
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
