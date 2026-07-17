# Dockerfile to run voice-bot-only with Chromium for Puppeteer
FROM node:24-bullseye-slim

# Install system deps for Chromium
RUN apt-get update && apt-get install -y \
    ca-certificates \
    wget \
    gnupg \
    fonts-liberation \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    libnss3 \
    libasound2 \
    libgbm1 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libgtk-3-0 \
  --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Install Chromium from Debian repos (best-effort)
RUN apt-get update && apt-get install -y chromium --no-install-recommends || true && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Avoid downloading Chromium during npm install since we'll use system chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_HEADLESS=true

COPY package*.json ./
RUN npm install --production --no-audit --no-fund --legacy-peer-deps

COPY . .

EXPOSE 3000
ENV PORT=3000

CMD ["node","voice-bot-only.js"]
