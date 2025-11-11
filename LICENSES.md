# Licenses for Ant Queen Game

This document lists all third-party assets and libraries used in the Ant Queen idle/clicker game.

## Implementation Note

The game is implemented using vanilla HTML5, CSS3, and JavaScript (ES6+) without external dependencies, making it fully self-contained and suitable for static hosting. The implementation draws inspiration from the following open-source libraries and game design patterns:

## Design References & Inspirations

### break_infinity.js
- **Description**: Big number library for idle games
- **License**: MIT License
- **Source**: https://github.com/Patashu/break_infinity.js
- **Usage**: Inspired the BigNum class implementation for handling large currency values
- **Note**: Custom simplified implementation; not using the actual library

### Phaser 3
- **Description**: HTML5 game framework
- **License**: MIT License
- **Source**: https://phaser.io/
- **Documentation**: https://photonstorm.github.io/phaser3-docs/
- **Usage**: Reference for game loop patterns and animation concepts

### EasyStar.js
- **Description**: Asynchronous A* pathfinding library
- **License**: MIT License
- **Source**: https://github.com/prettymuchbryce/easystarjs
- **Website**: https://easystarjs.com/
- **Usage**: Reference for pathfinding concepts (infrastructure in place for future enhancement)

### tsParticles
- **Description**: Lightweight particle animation library
- **License**: MIT License
- **Source**: https://github.com/matteobruni/tsparticles
- **Website**: https://particles.js.org/
- **Usage**: Reference for particle effect concepts (implemented with Canvas API)

## Game Assets

### Kenney Assets
- **Description**: UI elements, buttons, panels
- **License**: CC0 1.0 Universal (Public Domain)
- **Source**: https://kenney.nl/
- **Licensing Statement**: https://kenney.nl/support
- **Usage**: All interactive UI controls and visual elements
- **Quote from Kenney**: "All assets available at Kenney.nl are completely free to use for both personal and commercial projects. Credit (Kenney or www.kenney.nl) is not required but highly appreciated."

### OpenGameArt - Walking Ant Sprite
- **Description**: Ant sprite with idle, walk, eat, death animations
- **License**: CC0 1.0 Universal (Public Domain)
- **Source**: https://opengameart.org/content/walking-ant-with-parts-spriter-rig
- **Artist**: OpenGameArt contributors
- **Usage**: Primary ant character sprites and animations
- **Note**: Includes SVG parts and Spriter rig for customization

## Design References

### Cookie Clicker
- **Reference**: Idle game mechanics and progression patterns
- **Source**: https://orteil.dashnet.org/cookieclicker/
- **Usage**: Inspiration for building/upgrade tier cadence, synergy thresholds (25/50/100), and prestige system design
- **Note**: Game mechanics adapted and reimplemented; no content, assets, or code copied

## License Compliance

All libraries are used under their respective open-source licenses (MIT).
All assets are used under CC0 1.0 Universal (Public Domain) license.

No proprietary assets or copyrighted content has been included in this game.

## Credits

- **Game Design**: Based on idle/clicker genre conventions
- **Implementation**: Custom code using Phaser 3 framework
- **UI Assets**: Kenney (CC0)
- **Character Sprites**: OpenGameArt (CC0)
- **Libraries**: Phaser, EasyStar.js, break_infinity.js, tsParticles (all MIT)

---

Last Updated: 2025-01-11
