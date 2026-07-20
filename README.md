# TechySaumya v2 — Full Stack Developer Portfolio & Publishing Platform

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)

</div>

**TechySaumya v2** is a premium, enterprise-grade developer portfolio, photography showcase, and content publishing system. Built on **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**, it features a cyber-dark, glassmorphic visual system designed to deliver an engaging user experience with zero layout shifts.

---

## 🚀 Key Features & Architecture

### 1. Progressive Skeletal Loading & Speed Optimization
* **Nested Skeleton Loaders**: Heavy data-fetching routes (like the Blog index, Blog Details, and Photography Grid) render their page shells (Navbar, header, and search bars) instantly and display custom glassmorphic pulsing skeleton cards. This eliminates jarring layout shifts (CLS) and enhances perceived loading speed.
* **97% Hero Portrait Compression**: The above-the-fold hero portrait has been optimized from a heavy 3.08 MB down to **100 KB** using progressive Sharp JPEG compression, improving the Largest Contentful Paint (LCP) speed on slow networks.
* **Lazy-Loaded Offscreen Assets**: Featured projects and visual gallery grids utilize native browser lazy-loading (`loading="lazy"`) to conserve bandwidth and speed up initial page paint times.

### 2. Full-Stack Blogging Engine
* **Markdown Workspace**: Admin blog editor equipped with writing helpers (headers, lists, blockquotes, bold text).
* **Media Attacher Widget**: Select or drop image attachments. The server-side backend compresses the files using **Sharp**, converts them to WebP (saving bandwidth), pushes them to Cloudinary CDN, and inserts the Markdown syntax `![title](url)` directly at the cursor.
* **Tag Navigation & Client-Side Search**: A public blog index page (`/blog`) featuring real-time client-side search filtering and tag categorization.
* **Safe Parser**: Custom regex-based parser that translates Markdown into clean, semantic HTML styled with premium typography without adding bloated rich-text packages.

### 3. Visual Gallery & Interactive Album Management
* **Native HTML5 Draggable Reordering**: Admin can click and drag album cards or individual photos inside an album to dynamically update their visual display order. Changes are synced instantly to MongoDB.
* **Inline Configurations**: Rename photograph titles inline, set album covers, and edit titles, descriptions, and slugs on-screen with custom confirm modals.

### 4. SMTP Security & Recovery Layers
* **Session Management**: Session tokens are saved to MongoDB Atlas and verified using secure, HTTP-only, SameSite cookies.
* **SMTP Recovery Connector**: Hashed, token-based flows for "Forgot Username", "Forgot Password", and tokenized password resets with 1-hour expirations sent via a Gmail SMTP connector.

### 5. ATS-Compliant Resume & Print Layout
* **ATS Print Styling**: Clean `@media print` CSS overrides force a professional white-background, black-text ATS resume layout. This guarantees 100% readability for recruiters and automatic resume scanner software.
* **Milestones Timeline**: Interactive, reverse-chronological presentation of educational qualifications and Persistent Systems corporate experience.

---

## 🛠️ Environment Variables Configuration

Create a `.env.local` file in the root of your project directory and configure the following keys:

| Environment Variable | Description | Example Value |
| :--- | :--- | :--- |
| **SMTP_EMAIL_HOST** | Outgoing SMTP host provider | `smtp.gmail.com` |
| **SMTP_EMAIL_PORT** | SMTP TLS port | `587` |
| **SMTP_EMAIL_USER** | Sender email address | `sender@gmail.com` |
| **SMTP_EMAIL_PASS** | App-specific password (not primary password) | `abcd efgh ijkl mnop` |
| **ADMIN_USERNAME** | Root Administrator username | `admin_sa` |
| **ADMIN_PASSWORD** | Root Administrator password | `your-secure-password` |
| **ADMIN_RECOVERY_EMAIL** | Backup email to receive recovery links | `recovery@example.com` |
| **MONGODB_URI** | MongoDB Atlas connection pool connection string | `mongodb+srv://...` |
| **CLOUDINARY_CLOUD_NAME**| Cloudinary Cloud Name identifier | `my-cloudinary-cloud` |
| **CLOUDINARY_API_KEY** | Cloudinary API Key | `1234567890` |
| **CLOUDINARY_API_SECRET**| Cloudinary API Secret | `secret_abc123` |
| **NEXT_PUBLIC_SITE_URL** | Canonical base URL (for dynamic sitemaps & emails) | `https://saumyadeep.co.in` |

---

## 📦 Deployment Instructions

### 1. Deploying on Vercel (Recommended)
1. Push your code to a GitHub repository.
2. Link your repository in the Vercel Dashboard.
3. Vercel automatically detects the Next.js setup:
   * **Framework Preset**: `Next.js`
   * **Build Command**: `next build`
   * **Output Directory**: `.next`
4. Add all environment variables listed above in the project's **Environment Variables** settings.
5. Deploy. Dynamic endpoints (`sitemap.xml`, blog articles, and photography API routes) will automatically build serverless endpoints.

### 2. Deploying on Railway
1. Create a new service on Railway connected to your GitHub repository.
2. In Railway, click **Variables** and add all environment variables.
3. Expose the port by setting the variable `PORT=3000`.
4. Railway will build using the Node.js Buildpack. Ensure the build command runs `npm run build` and starts with `npm run start`.

### 3. Deploying on Render
1. Create a new **Web Service** on Render and link your GitHub repository.
2. Configure the following settings:
   * **Environment**: `Node`
   * **Build Command**: `npm run build`
   * **Start Command**: `npm run start`
3. Under **Advanced**, add all of the environment variables.
4. Render will deploy the Next.js application in server-runner mode.

---

## 💻 Tech Stack & Packages

* **Core**: Next.js 16 (App Router), React 19, TypeScript
* **Database**: MongoDB Atlas, Mongoose ODM
* **Media Storage**: Cloudinary CDN, Sharp (Server-side WebP converter & image optimizer)
* **Styling**: Vanilla Tailwind CSS v4, Lucide Icons, React Icons
* **Animations**: Framer Motion, Lenis (Smooth scrolling context)
* **Mail Dispatch**: Nodemailer, SMTP Connector
