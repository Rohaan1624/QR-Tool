# QR Tool

**Live Demo:** https://rohaan1624.github.io/QR-Tool/

A lightweight web application that generates QR codes from URLs and allows users to download the generated QR code as a PNG image.

## Features

- Paste any valid URL
- Generate a QR code instantly
- Download the QR code as a PNG
- Clean, responsive interface
- No build step required

## Project Structure

```text
QR-Tool/
├── index.html      # Application markup
├── styles.css      # Styling
├── app.js          # QR generation and download logic
└── vendor/
    └── qrcode.js   # QR code library
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/rohaan1624/QR-Tool.git
cd QR-Tool
```

2. Open `index.html` in any modern web browser.

Alternatively, serve the folder with any static web server.

## Usage

1. Enter or paste a URL.
2. Click **Generate QR Code**.
3. The QR code will appear below the input.
4. Click **Download PNG** to save the image.

## Technologies

- HTML5
- CSS3
- JavaScript (ES6)
- qrcode.js

## Browser Support

Works in current versions of Chrome, Edge, Firefox, and Safari.

## Notes

This is a client-side application. No server, database, or external API is required, and no user data is transmitted anywhere.
