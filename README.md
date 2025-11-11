# SeraBunni - Digimon Arcade Landing Page

An immersive Digimon-themed retro arcade experience with privacy-safe contact handling and ad-free games, featuring:

- 🔒 Password protection for personalized access
- 🎨 Five theme options (Pink, Dark, Holiday, Halloween, **Digimon Mode**)
- 🎮 Five ad-free HTML5 games (Snake, Breakout, Tetris, Space Invaders, Platform Runner)
- 🐉 Digimon Adventure aesthetic with digital aura and data motifs
- 🌌 Rotating background visualizations (starfield, data grid, particles)
- 🔐 Privacy-enhanced contact information (obfuscated in source, click-to-reveal)
- 🎵 Background music toggle with 8-bit looped theme
- ✨ Theme-specific visual effects and animations
- 💕 Personalized content and milestones
- 📱 Mobile responsive design
- 🎁 Enhanced Easter eggs (try the Konami code in Digimon mode!)

## Features

### Password Protection
- Secure access with password "1998"
- Session storage remembers authentication
- Smooth fade-out animation on successful entry

### Profile Section
- Name and contact information
- About Me section with personalized details:
  - 🌉 San Francisco location
  - 🎂 April birthday
- Special Moments section:
  - 💕 Three-month anniversary (November 10)
  - ✨ Personal messages
- Social media links (Call, Text, Email, Instagram, Twitter, YouTube, LinkedIn)
- Interests tags including favorites:
  - 🎯 Pinball
  - 🐉 Digimon
  - 📖 May I Ask for One Final Thing?

### Theme Switcher
Choose from five unique themes:
- 💖 **Pink Theme** (Default) - Classic MySpace pink/purple gradients
- 🌙 **Dark Theme** - Sleek dark mode with magenta accents
- 🎄 **Holiday Theme** - Festive red and green with snowfall animation
- 🎃 **Halloween Theme** - Spooky orange/purple/black with floating bats and ghosts
  - Auto-enables between October 25 - November 3
- 🐉 **Digimon Mode** - Immersive Digimon Adventure cyber-realm theme
  - Digital grid overlay and data motifs
  - Cyan/blue color scheme with glowing effects
  - Click anywhere for data burst animations
  - Enhanced Konami code "evolution sequence"

### Ad-Free Games Arcade
Enjoy classic retro games built locally with HTML5 Canvas (no external ads or trackers):
- 🐍 **Classic Snake** - Navigate the grid and grow your snake
- 🧱 **Breakout** - Break all the bricks with your paddle
- 🟦 **Tetris** - Stack falling blocks and clear lines
- 👾 **Space Invaders** - Defend Earth from alien invasion
- 🏃 **Platform Runner** - Jump over obstacles in endless runner
- 🐉 **Digimon Animation** - Animated Digimon sprite showcase (CodePen embed)

All games are:
- ✅ Completely ad-free
- ✅ No external trackers
- ✅ Lightweight and fast-loading
- ✅ Keyboard and mouse/touch controls
- ✅ High scores and lives system

### Interactive Elements
- **Dynamic Background Toggle** (🎨) - Cycle through visualizations:
  - Starfield with moving stars
  - Data grid with flowing lines
  - Colorful particle system
  - Pixel city nightscape
  - Digital ocean waves
- **Background Music Toggle** (🎵) - 8-bit style looped theme
- Sparkle effect animations
- Theme-specific floating elements (emojis, snowflakes, bats, ghosts, Digimon symbols)
- Custom animated cursor with sparkle effect
- Smooth scrolling
- Button hover effects with glowing shadows
- Enhanced Konami code Easter egg (↑↑↓↓←→←→BA)
  - Rainbow effect in standard themes
  - Digimon "evolution sequence" with data bursts in Digimon mode

### Privacy & Security Features
- **Contact Information Obfuscation**
  - Name and contact details assembled via JavaScript at runtime
  - Strings split and encoded to hide from static source inspection
  - Phone number hidden behind "Click to reveal" interaction
  - Smooth reveal animation when clicked
- **Search Engine Privacy**
  - `<meta name="robots" content="noindex,nofollow">` prevents indexing
  - Contact info not visible in page source or search results
- **Session-based Password Protection**
  - Password required on first visit
  - Authentication stored in sessionStorage (cleared when browser closes)

## Usage

This landing page is designed to be QR code friendly and features password protection for a personalized experience. 

1. Visit the GitHub Pages URL
2. Enter the password "1998" to access the content
3. Explore the profile, switch themes, and play games!
4. Your authentication is remembered during your browser session

## GitHub Pages Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the main branch.

## Local Development

To run locally:
```bash
# Clone the repository
git clone https://github.com/abhidya/serabunni.git

# Navigate to the directory
cd serabunni

# Open index.html in your browser
# Or start a simple HTTP server:
python3 -m http.server 8080
```

Then visit `http://localhost:8080` in your browser.

## License

Made with 💖 in the spirit of MySpace