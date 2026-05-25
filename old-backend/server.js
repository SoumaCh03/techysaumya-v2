const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")

const app = express()

app.use(cors())
app.use(express.json())

// Zoho Mail SMTP transporter
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 587,
  secure: false, // IMPORTANT
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000
})

// Health route (helps Render + browser testing)
app.get("/", (req, res) => {
  res.send("Portfolio backend is running successfully 🚀")
})

// Contact route
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact from ${name}`,
      html: `
        <h2>New Portfolio Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    })

    res.status(200).json({
      message: "Thank You. Message sent successfully!"
    })
  } catch (error) {
    console.error("Mail Error:", error)

    res.status(500).json({
      message: "Sorry. Message sending failed."
    })
  }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})