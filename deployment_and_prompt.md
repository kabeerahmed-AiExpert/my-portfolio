# AI Developer Portfolio - Deployment & Prompts Guide

This document contains step-by-step instructions on where and how to deploy your website online for free, along with the full development prompt that describes your website for future reference.

---

## 1. Where & How to Deploy (Free Hosting Options)

Since your portfolio website is a high-performance static site (HTML, CSS, JavaScript) that plays a local video and renders real-time graphics on canvas, it does not require a database server or custom Node.js backend. It runs entirely on the browser (client-side), which means you can deploy it online **100% free** using premium edge hosting providers.

Here are the top three recommended platforms:

### Option A: Vercel (Recommended)
Vercel is extremely fast and provides automatic SSL certificates, a clean control panel, and free subdomains.
1. Sign up for a free account at [Vercel](https://vercel.com).
2. Install the Vercel CLI (optional) or download the **Vercel Desktop App**.
3. **Easiest Method**: Drag and drop your `portfiolo` folder onto the Vercel dashboard online deployment panel.
4. Vercel will instantly upload and build your files, providing a link like `kabeer-ahmed-portfolio.vercel.app` in under 30 seconds!

### Option B: Netlify
Netlify is another industry-standard hosting provider with a simple drop-in deployment flow.
1. Sign up at [Netlify](https://netlify.com).
2. Go to the **Sites** tab in your dashboard.
3. Scroll to the bottom where it says *"Want to deploy a new site without connecting to Git? Drag and drop your site folder here"*.
4. Drag and drop the `portfiolo` folder. It will deploy instantly.

### Option C: GitHub Pages
If you want to host it directly from your GitHub repository `https://github.com/kabeerahmed-AiExpert`:
1. Push your portfolio code to a public GitHub repository (e.g., named `portfolio`).
2. Go to the **Settings** tab of the repository.
3. Under the left sidebar, click **Pages**.
4. In the **Build and deployment** section, select `Deploy from a branch`.
5. Set the Branch to `main` (or `master`) and folder to `/ (root)`, then click **Save**.
6. Your portfolio will go live at `kabeerahmed-aiexpert.github.io/portfolio/`.

---

## 2. Complete Design & System Prompt (For Reference)

If you ever need to recreate or modify this website in another platform, here is the complete design and engineering prompt summarizing this portfolio's system:

```text
Build a premium, futuristic AI Developer & Engineer split-screen portfolio website with modern cybernetic visual aesthetics.

1. Layout & Architecture:
   - Split-screen viewport landing page:
     - Left: Big typography header stating "Hi, I'm Kabeer Ahmed. An AI Developer & Engineer.", high-contrast modern description focused on Deep Learning, CV, and MLOps, call-to-action buttons (View Projects, Let's Talk), and custom social platforms icon buttons (GitHub, LinkedIn, Upwork, Fiverr).
     - Right: Floating glassmorphic macOS-styled window container hosting a video player playing a 16:9 demo reel. The player has subtle X/Y parallax rotation, a play/mute button overlay, and speeds up playback by 25% on hover.
   - Core portfolio sections as you scroll down: About Me (with bullet lists focused on Deep Learning/MLOps), Technical Expertise (Interactive Skill Cards), Featured Work (Project Cards with Github/Demo links), and a glassmorphic Get In Touch contact form.
   - Responsive scaling: Reflows seamlessly from split-screen desktop layout to stacked single-column mobile viewports.

2. Visual Styles & Animations:
   - Palette: Extremely dark background (#0f1013), soft white text (#f0f2f5), glowing cyan (#00d2ff) and neon-green (#00ff88) gradient highlights.
   - Cards and Header use glassmorphism with blur (backdrop-filter: blur(12px)) and fine border shadows.
   - Smooth reveal transitions: Sections fade-in and slide-up smoothly as they enter the screen using an IntersectionObserver. Nav links highlight active section based on viewport scroll position.

3. Interactive Background (AI Canvas):
   - A full-screen background HTML5 Canvas rendering a large rotating 3D particle sphere representing an AI Core neural net.
   - 3D coordinates projected dynamically to 2D viewports. It must speed up rotation dynamically on scroll.
   - Cursor attraction/repulsion: Cursor movement warps/pushes particles away on hover, returning back via spring decay logic.
   - Connect lines: Render glowing, thin neural network wireframes between front-facing particles (X/Y proximity logic).

4. Custom Cursor Avatar:
   - The user profile picture is transformed into a stylized futuristic cartoon avatar (avatar.png).
   - The avatar icon (48px circle, glowing cyan outline) lag-follows the real mouse pointer smoothly on every frame using a linear interpolation (lerp factor: 0.12).
   - Hover scaling: Avatar scales up to 64px with a green glowing shadow when hovering over clickable elements.

5. Client-Side AI Chatbot Agent:
   - Floating chat button in the bottom right corner with a glowing pulse ring.
   - Clicking toggle opens a sleek glassmorphic chatbot modal hosting Kabeer's Agent.
   - Implements automated, responsive client-side Q&A conversation. Users click quick replies (Skills, Projects, Contact, About) and the agent responds with customized Markdown-formatted message bubbles using typewriter animation lags (750ms).
```
