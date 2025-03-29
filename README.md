<p align="center">
  <img src="extension/icon.png" alt="MindLine Logo" width="650" />
</p>

# 🧠 Mindline – Your Textbook, Now Interactive

Mindline is a Chrome extension that turns static PDFs into interactive, AI-powered textbooks.

> Tap a line. Understand everything.  
> Get inline explanations in the same tone and style as your book — without switching tabs or losing focus.

---

## 🚀 Features
- Inline AI explanations for any concept or formula
- Styled to match the textbook (font, size, layout)
- Multilingual support (coming soon)
- Collapsible explanations & personal notes
- Smart "Do you want help?" auto-suggestions

---

## 🧰 Tech Stack
- JavaScript (Vanilla)
- Chrome Extensions API (Manifest V3)
- PDF.js
- OpenAI API (GPT-4 Turbo)

---

## 📁 Project Structure

extension/
├── manifest.json       # Chrome extension config
├── background.js       # Background worker (future storage/API)
├── content.js          # Injected into PDFs
├── popup.html          # Extension popup interface
├── styles.css          # AI overlay styles
└── icon.png            # Extension icon

---

## 🛠️ Setup (for Devs)

1. Clone this repo
2. Go to Chrome → Extensions → Enable Developer Mode
3. Click "Load Unpacked" → select `extension/` folder
4. Open a PDF in Chrome → AI-ready interaction will show up (once built 😉)

---

## 📌 Roadmap
- [ ] v1.0.0 – Inline explanations from GPT
- [ ] v1.1.0 – Notes & Highlights
- [ ] v1.2.0 – Language selection
- [ ] v2.0.0 – Diagram interpretation, contextual solving

---

## 📄 License
MIT – build, use, or fork freely with credit.
