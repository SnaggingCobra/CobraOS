# CobraOS

A web-based desktop environment built with HTML, CSS, and JavaScript.

CobraOS started as a small WebOS project for the Hack Club WebOS Jam, but I wanted to take the basic idea further and make it feel like my own desktop rather than just following the guide.

The design is mainly inspired by the Fedora Linux GNOME desktop I use myself. I didn't want to simply copy the example from the WebOS guide, so most of the visual design, layout ideas, and the way the applications work came from experimenting with my own ideas.

## What is CobraOS?

CobraOS is a desktop environment that runs inside a web browser.

It has a welcome screen that launches into a desktop with a top system bar, dock, wallpaper, and application windows.

The goal was to recreate some of the small things that make a desktop feel like an actual operating system:

- Applications that open from a dock
- Draggable windows
- Window controls
- A system status bar
- Live date and time
- Battery information
- Network status
- Volume controls
- A desktop wallpaper
- Settings
- Local notes
- Local music playback
- A browser interface
- A file manager interface

It is not intended to replace a real operating system. It is a web project exploring how much of a desktop experience can be recreated using frontend technologies.

## Features

### Welcome Screen

CobraOS starts with a custom welcome screen and a Start CobraOS button.

Pressing the button transitions into the desktop environment.

### Desktop

The desktop includes a custom wallpaper and a GNOME-inspired layout.

The top bar contains:

- CobraOS branding
- Current time
- Current date
- Logout button
- Battery status
- Network status
- Volume control

There is also a bottom application dock for launching the built-in applications.

### Browser

CobraOS includes a browser-style application.

It has:

- Address bar
- Back button
- Forward button
- Reload button
- Go button
- Browser window controls
- Draggable window
- Minimize
- Maximize
- Close

The browser uses an iframe for displaying web content.

Some websites do not allow themselves to be embedded in iframes because of their own security policies. That is a browser/web security restriction rather than a CobraOS bug.

### Files

The Files application is designed to look and behave like a simple desktop file manager.

It includes a sidebar with locations such as:

- Home
- Desktop
- Documents
- Downloads
- Music

and a main file area for displaying folders and files.

The current implementation focuses mainly on the desktop/file-manager experience rather than trying to access the real filesystem of the computer running CobraOS.

### Notes

CobraOS has a built-in Notes application.

It provides a simple editor where notes can be written and cleared.

Notes are saved using browser local storage, allowing them to remain available after refreshing the page.

### Music

The Music application is one of the more functional parts of CobraOS.

It can load local audio files directly from the user's computer.

It includes:

- Play / pause
- Previous
- Next
- Track progress
- Current playback time
- Track duration
- Volume control
- Local audio file selection
- Track title display

The audio is handled directly in the browser using JavaScript and the HTML Audio API.

### Settings

CobraOS also includes a Settings application.

The settings interface is divided into different sections, including:

- Appearance
- Sound
- Network
- Battery

Appearance settings include things such as theme, accent color, and animation preferences.

Some preferences are stored using local storage so they can persist between sessions.

## Window System

One of the main parts of CobraOS is its application window system.

Applications open as desktop windows instead of taking over the entire page.

Windows can be:

- Opened from the dock
- Moved around the desktop
- Minimized
- Maximized
- Closed

The window headers are used as the draggable area.

This became one of the more interesting parts of the project because every application needed to behave consistently while still having its own content and controls.

## Design

The visual design of CobraOS is mostly based on my own Fedora Linux GNOME desktop.

I use Fedora Linux with GNOME, so that became the main reference for how I wanted the desktop to feel.

I didn't want CobraOS to look exactly like the WebOS tutorial.

The Hack Club guide gave me the basic direction for creating a web operating system, but I spent a lot of time changing the layout, wallpaper, dock, top bar, windows, and application designs to make it feel more like something I would personally use.

The goal was to keep the interface simple, dark, and clean without filling the desktop with unnecessary elements.

## Built With

CobraOS currently uses:

- HTML
- CSS
- JavaScript
- DOM APIs
- Local Storage
- Browser APIs
- HTML Audio API
- iframe-based web content

There is no backend required for the main desktop environment.

## Project Structure

```text
CobraOS/
├── images/
├── index.html
├── script.js
├── style.css
└── README.md


## AI Usage

AI was used as a development assistant during the creation of CobraOS.

It was **not used to generate the entire project**. Most of the project was built through my own coding, experimentation, design decisions, testing, and debugging.

I used AI mainly when I got stuck, needed help understanding an error, or wanted ideas for implementing a feature.

### Where AI was used

**JavaScript debugging and implementation**

The JavaScript became one of the hardest parts of the project after adding multiple applications and interactive windows.

I ran into many issues involving:

- Event listeners
- DOM elements
- Draggable windows
- Window controls
- Battery detection
- Network detection
- Volume controls
- Music playback
- Settings
- Local storage
- Application state

AI helped me understand some of these errors, find possible causes, and work through fixes. It also helped turn some of my ideas into working JavaScript.

**Browser integration**

AI was used while integrating the browser application into CobraOS.

It helped with ideas for:

- Opening the browser from the dock
- Browser window controls
- Address bar behavior
- Browser window interaction
- Handling iframe limitations

The browser also exposed a real-world web security issue where some websites prevent themselves from being embedded in iframes.

**CSS improvements**

AI was used for some basic CSS improvements and UI ideas.

This included:

- Window styling
- Spacing
- Buttons
- Popups
- Volume controls
- Window layouts
- Small visual improvements
- Making the interface feel more consistent

The overall visual direction and design decisions were still my own.

**Problem solving**

There were several points where I knew what I wanted CobraOS to do but wasn't sure how to implement it.

In those situations, I used AI to get suggestions, understand different approaches, and troubleshoot problems.

I then tested the changes myself and modified them when they didn't work or didn't fit the project.

### What AI did not do

AI did not design the entire operating system or independently build CobraOS from start to finish.

The project was developed through my own experimentation and coding, with AI being used as a tool for assistance.

The overall concept, Fedora GNOME-inspired design direction, application ideas, project structure, testing, and decisions about what to build were driven by me.

AI was essentially used as a **coding assistant and debugging partner**, not as a replacement for development.

## Why I used AI

The main reason for using AI was to learn and keep moving when I got stuck.

Instead of stopping whenever I encountered a JavaScript error or didn't know how to implement something, I could use AI to understand the problem, try a solution, and then test it myself.

That was especially useful once CobraOS grew from a simple webpage into a desktop environment with several applications and interacting components.