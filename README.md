# Typing Speed Test

A free, minimalist typing speed test built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 60-second typing test
- Real-time WPM (Words Per Minute) calculation
- Live accuracy tracking
- Character-by-character error highlighting
- 25 different text passages
- Mobile-responsive design
- No registration required
- Instant results
- **Resume-Ready Typing Certificate** (95%+ accuracy)
  - Canvas-generated professional certificate
  - Unique certification ID
  - PNG download for LinkedIn/resume
  - Celebration confetti animation

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React 19
- Canvas API (certificate generation)
- canvas-confetti (celebration effects)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
/app
  /layout.tsx          - Root layout with SEO metadata
  /page.tsx            - Homepage/landing page
  /test/page.tsx       - Typing test page
  /globals.css         - Global styles
/components
  /TypingTest.tsx           - Main test component with logic
  /Timer.tsx                - Timer display component
  /Results.tsx              - Results display component with certificate
  /CertificateGenerator.tsx - Canvas-based certificate generator
/data
  /passages.json            - 25 typing test passages
/lib
  /certificate.ts           - Certificate ID generation utilities
```

## WPM Calculation

```
WPM = (Total Characters Typed / 5) / (Time Elapsed in Minutes)
Accuracy = ((Total Characters - Errors) / Total Characters) × 100
```

## Deployment

This project is optimized for Vercel deployment:

1. Push to GitHub
2. Import to Vercel
3. Deploy (no environment variables needed)

## Certificate Feature

Users who achieve **95%+ accuracy** on the 60-second test qualify for a professional typing certificate:

1. **Automatic qualification check** after test completion
2. **Confetti celebration** animation triggers
3. **Optional name input** for personalization
4. **Live certificate preview** (1200x850px Canvas rendering)
5. **PNG download** with unique certification ID
6. **Resume-ready format** for LinkedIn/job applications

### Certificate Design
- Professional gradient background (blue-white)
- Gold and teal accent borders
- Displays: WPM, accuracy, date, unique ID
- System fonts for universal compatibility
- High-resolution (1200x850px) for print quality

## Future Enhancements

- [ ] AdSense integration
- [ ] Analytics tracking
- [ ] Difficulty levels (easy/medium/hard)
- [ ] Custom time options (30s/60s/120s)
- [ ] Leaderboard (requires backend)
- [ ] User accounts (optional)
- [ ] Certificate verification system
- [ ] Social sharing for certificates

## License

MIT
