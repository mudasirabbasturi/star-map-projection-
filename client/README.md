# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# For current platform

npm run build

# For specific platforms

npm run build-win
npm run build-mac  
npm run build-linux

npm install rimraf --save-dev
"scripts": {
"start": "electron .",
"dev": "electron . --dev",
"clean": "rimraf dist", <-- ADD THIS
"build": "npm run clean && electron-builder", <-- UPDATE THIS
"build:win": "npm run clean && electron-builder --win", <-- UPDATE THIS
"build:linux": "npm run clean && electron-builder --linux",
"build:all": "npm run clean && electron-builder -wml",
"dist": "npm run build"
},

npm install -g serve
serve -s dist
npm install -g pkg

## Electron js with react

npm install electron --save

npm install --save-dev concurrently wait-on
npm install --save-dev cross-env
npm run dev
For production build:

# First build React app

cd Client
npm run build

# Then run Electron

npm run electron
npm install --save-dev electron-builder

npm install -g pkg
pkg index.js --output starmap --targets node18-win-x64,node18-linux-x64
