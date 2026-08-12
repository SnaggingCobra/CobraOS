# CobraOS

A lightweight browser-based desktop simulation built with HTML, CSS, and JavaScript.

## Overview

CobraOS is a simple web project that displays a welcome screen and launches a desktop-style interface with a top bar, clock, date, system status icons, and a dock. 

## Features

- Welcome screen with a launch button
- Desktop interface with blurred glass-like styling
- Real-time clock and date display
- Battery level indicator (when the browser supports Battery Status API)
- Dock with app-style icons

## Files

- `index.html` - Main application markup
- `style.css` - Visual styling, layout, and desktop effects
- `script.js` - Interaction logic for launching the desktop, updating time/date, and battery status
- `images/` - Background images used by the welcome screen and desktop

## How to Run

1. Open `index.html` in a web browser.
2. Click the **Start CobraOS** button to show the desktop interface.

> For local development, you can also serve the folder with a simple static server if needed.

## Notes

- The battery indicator uses the browser Battery Status API, which may not be supported in all browsers.
- The dock icons are currently decorative and do not open applications.

## AI Usage

- Any AI usages is for API integration guidance, unexpected error handling, UI improvement ideas, CSS enhancement suggestions, and JavaScript improvement ideas.
- AI has written the ReadME.md 
- 
- All code in this project was written by the initial owner.

## Improvements

Possible next steps:

- Add clickable app windows for the dock icons
- Add taskbar/menu interaction
- Animate transitions between screens
- Add support for keyboard shortcuts and widgets

## License

Feel free to use or modify this project for learning and experimentation.
