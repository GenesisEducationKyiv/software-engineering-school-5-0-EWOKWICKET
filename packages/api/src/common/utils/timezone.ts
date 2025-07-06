export const localTimestampFormat = () =>
  new Date().toLocaleString('uk-UA', {
    timeZone: 'Europe/Kyiv',
    hour12: false,
  });
