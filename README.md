# Discord Workspace Manager

A multi-session Discord desktop application built with Electron, React, and Tailwind CSS.

## Features

- **Multi-Session Management**: Run multiple independent Discord accounts simultaneously.
- **Isolated Partitions**: Each session has its own persistent storage and cookies.
- **Dashboard**: Overview of all active sessions and bulk invite management.
- **Modern UI**: Dark-themed, Discord-inspired design with smooth transitions.
- **Secure**: Uses official Discord web pages only; no automation or token extraction.

## Getting Started

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

### Building for Windows

1. Build the renderer and pack the app:
   ```bash
   npm run build
   ```

2. The installer will be available in the `release` folder.

## Security Rules

- This app acts as a browser wrapper for Discord.
- It does NOT automate any actions (joins, messages, etc.).
- It does NOT access or store user tokens directly.
- All interactions must be performed manually by the user within the webviews.
