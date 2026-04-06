/**
 * Aare Weather — script.js
 * Fetches city list and live weather data from aareguru.existenz.ch
 * Uses async/await throughout. No API key required.
 */

// ─── API Endpoints ───────────────────────────────────────────────────────────
const API_BASE    = 'https://aareguru.existenz.ch/v2018';
const CITIES_URL  = `${API_BASE}/cities`;
const WEATHER_URL = (city) => `${API_BASE}/current?city=${encodeURIComponent(city)}&app=aare-weather-app`;

// ─── DOM References ───────────────────────────────────────────────────────────
const citySelect      = document.getElementById('citySelect');
const loadingState    = document.getElementById('loadingState');
const errorState      = document.getElementById('errorState');
const errorMsg        = document.getElementById('errorMsg');
const retryBtn        = document.getElementById('retryBtn');
const weatherResult   = document.getElementById('weatherResult');

const cityNameEl      = document.getElementById('cityName');
const weatherCondEl   = document.getElementById('weatherCondition');
const airTempEl       = document.getElementById('airTemp');
const waterTempEl     = document.getElementById('waterTemp');
const flowRateEl      = document.getElementById('flowRate');
const conditionTextEl = document.getElementById('conditionText');
const weatherEmojiEl  = document.getElementById('weatherEmoji');
const updatedAtEl     = document.getElementById('updatedAt');
const cityBanner      = document.getElementById('cityBanner');
const airTempFill     = document.getElementById('airTempFill');
const waterTempFill   = document.getElementById('waterTempFill');

/** Last selected city for Retry */
let lastSelectedCity = null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Maps a condition string to an emoji */
function getWeatherEmoji(condition = '') {
  const c = condition.toLowerCase();
  if (c.includes('sun') || c.includes('clear') || c.includes('sonnig'))    return '☀️';
  if (c.includes('partly') || c.includes('wolkig') || c.includes('cloud')) return '⛅';
  if (c.includes('overcast') || c.includes('bedeckt'))                     return '☁️';
  if (c.includes('rain') || c.includes('regen') || c.includes('shower'))   return '🌧';
  if (c.includes('thunder') || c.includes('gewitter'))                     return '⛈';
  if (c.includes('snow') || c.includes('schnee'))                          return '❄️';
  if (c.includes('fog') || c.includes('nebel') || c.includes('mist'))     return '🌫';
  if (c.includes('wind'))                                                   return '💨';
  if (c.includes('night') || c.includes('nacht'))                          return '🌙';
  return '🌤';
}

/** Maps temperature to a 0-100% bar width (-10°C → 0%, 40°C → 100%) */
function tempToPercent(tempC) {
  return Math.min(100, Math.max(0, ((tempC - (-10)) / (40 - (-10))) * 100));
}

// ─── UI State ─────────────────────────────────────────────────────────────────

function showLoading() {
  loadingState.classList.remove('hidden');
  errorState.classList.add('hidden');
  weatherResult.classList.add('hidden');
}

function showError(message) {
  loadingState.classList.add('hidden');
  errorState.classList.remove('hidden');
  weatherResult.classList.add('hidden');
  errorMsg.textContent = message;
}

function showWeather() {
  loadingState.classList.add('hidden');
  errorState.classList.add('hidden');
  weatherResult.classList.remove('hidden');
}

function hideAll() {
  loadingState.classList.add('hidden');
  errorState.classList.add('hidden');
  weatherResult.classList.add('hidden');
}

// ─── API Calls ────────────────────────────────────────────────────────────────

/** Loads city list into the dropdown */
async function loadCities() {
  try {
    citySelect.disabled = true;
    citySelect.innerHTML = '<option value="">Loading cities…</option>';

    const response = await fetch(CITIES_URL);
    if (!response.ok) throw new Error(`Cities API returned ${response.status}`);

    const cities = await response.json();
    if (!Array.isArray(cities) || cities.length === 0) throw new Error('No cities returned');

    citySelect.innerHTML = '<option value="">— Select a city —</option>';
    cities.forEach((entry) => {
      const slug  = entry.city || entry.slug;
      const label = entry.longname || entry.city;
      if (!slug) return;
      const option = document.createElement('option');
      option.value = slug;
      option.textContent = label;
      citySelect.appendChild(option);
    });

    citySelect.disabled = false;

  } catch (err) {
    console.error('[loadCities]', err);
    citySelect.innerHTML = '<option value="">Failed to load cities</option>';
    citySelect.disabled = false;
    showError(`Could not load cities: ${err.message}`);
  }
}

/** Loads weather for a given city slug */
async function loadWeather(city) {
  if (!city) { hideAll(); return; }

  lastSelectedCity = city;
  showLoading();

  try {
    const response = await fetch(WEATHER_URL(city));
    if (!response.ok) throw new Error(`Weather API returned ${response.status}`);

    const data = await response.json();
    renderWeather(data, city);

  } catch (err) {
    console.error('[loadWeather]', err);
    if (err instanceof TypeError) {
      showError('Network error — please check your connection and try again.');
    } else {
      showError(`Could not load weather data: ${err.message}`);
    }
  }
}

// ─── Render ───────────────────────────────────────────────────────────────────

function renderWeather(data, city) {
  const aare    = data.aare    || {};
  const current = data.current || {};
  const weather = data.weather || {};

  // ── City name ──
  const displayName =
    aare.city_longname || aare.name ||
    current.city_longname || weather.city_longname ||
    city.charAt(0).toUpperCase() + city.slice(1);

  cityNameEl.textContent = displayName;

  // Update the bg watermark text on the banner
  if (cityBanner) cityBanner.setAttribute('data-city', displayName);

  // ── Air temperature ──
  const airTempRaw =
    aare.temperature_current ?? aare.temperature ??
    current.temperature_current ?? current.temperature ??
    weather.temperature_current ?? weather.temperature ?? null;

  if (airTempRaw !== null) {
    airTempEl.textContent = `${Number(airTempRaw).toFixed(1)} °C`;
    if (airTempFill) {
      requestAnimationFrame(() => {
        airTempFill.style.width = `${tempToPercent(Number(airTempRaw))}%`;
      });
    }
  } else {
    airTempEl.textContent = 'N/A';
  }

  // ── Water temperature ──
  const waterVal =
    data.aare?.temperature ?? aare.water_temperature ??
    current.aare_temperature ?? current.water_temperature ?? null;

  if (waterVal !== null && waterVal !== undefined) {
    waterTempEl.textContent = `${Number(waterVal).toFixed(1)} °C`;
    if (waterTempFill) {
      requestAnimationFrame(() => {
        waterTempFill.style.width = `${tempToPercent(Number(waterVal))}%`;
      });
    }
  } else {
    waterTempEl.textContent = 'N/A';
  }

  // ── Flow rate ──
  const flow = aare.flow ?? current.flow ?? aare.abfluss ?? current.abfluss ?? null;
  flowRateEl.textContent = flow !== null ? `${Number(flow).toFixed(0)} m³/s` : 'N/A';

  // ── Condition ──
  const conditionRaw =
    weather.current?.desc ?? weather.current?.description ??
    weather.today?.desc ?? weather.desc ??
    aare.condition ?? current.condition ?? 'Unknown';

  conditionTextEl.textContent = conditionRaw;
  weatherCondEl.textContent   = conditionRaw;
  weatherEmojiEl.textContent  = getWeatherEmoji(conditionRaw);

  // ── Timestamp ──
  const now = new Date();
  updatedAtEl.textContent = `Updated: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · ${now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}`;

  showWeather();

  // Smooth scroll to result
  weatherResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Events ───────────────────────────────────────────────────────────────────

citySelect.addEventListener('change', (e) => loadWeather(e.target.value));

retryBtn.addEventListener('click', () => {
  if (lastSelectedCity) loadWeather(lastSelectedCity);
  else loadCities();
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
loadCities();
