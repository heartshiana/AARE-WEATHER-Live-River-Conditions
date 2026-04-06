AARE WEATHER — Live River Conditions

A modern Electron-based desktop application that displays real-time river and weather data across Switzerland. This app provides users with live insights into air temperature, water temperature, flow rates, and current weather conditions using the Aareguru API.

Features
Live Swiss River Data
Air & Water Temperature Monitoring
Flow Rate Tracking
Real-Time Weather Conditions
City Selection Dropdown
Fast & Lightweight (No API Key Required)
Desktop App via Electron
Preview

The app includes:

A bold hero landing page
Interactive city selector
Real-time weather results dashboard
Smooth animations and modern UI styling
Tech Stack
Frontend: HTML, CSS, JavaScript
Desktop Framework: Electron
API: Aareguru (Existenz)
Styling: Custom CSS (Bebas Neue + Noto Sans JP)
Project Structure
├── index.html     # Main UI layout :contentReference[oaicite:0]{index=0}
├── styles.css     # Styling and layout :contentReference[oaicite:1]{index=1}
├── script.js      # API handling & UI logic :contentReference[oaicite:2]{index=2}
├── main.js        # Electron entry point :contentReference[oaicite:3]{index=3}
├── package.json   # App configuration & dependencies :contentReference[oaicite:4]{index=4}
Installation & Setup
Clone the repository
git clone https://github.com/your-username/aare-weather.git
cd aare-weather
Install dependencies
npm install
Run the app
npm start
API Reference

This project uses:

Aareguru API
https://aareguru.existenz.ch

Endpoints used:

/cities → Fetch available locations
/current?city={city} → Fetch live weather data

No API key required.

How It Works
On load, the app fetches available cities
User selects a city from the dropdown
The app retrieves:
Air temperature
Water temperature
Flow rate
Weather condition
Data is rendered dynamically with animations and visual indicators
Design Highlights
Bold editorial yellow theme
Responsive layout
Smooth transitions and micro-interactions
Clean, modern typography
Error Handling
Handles:
Network failures
API errors
Empty responses
Includes retry functionality for better UX
Future Improvements
Add more regions beyond Switzerland
Mobile/web version
Historical data charts
Notifications for extreme conditions
Author

Heart Shiana Ursua

License

This project is for educational and personal use.
