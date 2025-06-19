const BASE = (() => {
  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || '3000';
  return `http://${host}:${port}/weatherapi.app/api`;
})();

export const Url = Object.freeze({
  CONFIRM: `${BASE}/confirm`,
  UNSUBSCRIBE: `${BASE}/unsubscribe`,
  OUTER_WEATHER_API: 'http://api.weatherapi.com/v1',
});
