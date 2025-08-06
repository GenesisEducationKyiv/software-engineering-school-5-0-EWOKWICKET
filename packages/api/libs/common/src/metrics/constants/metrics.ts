export const Metrics = Object.freeze({
  requestTotal: {
    name: 'appRequestTotal',
    help: 'total number of requests',
    labelNames: ['transport', 'route'],
  },
  requestDuration: {
    name: 'appRequestDurationMilliseconds',
    help: 'request duration in milliseconds',
    labelNames: ['transport', 'route'],
  },
  errorTotal: {
    name: 'appRequestErrorTotal',
    help: 'total number of failed requests',
    labelNames: ['transport', 'route'],
  },
  cacheHit: {
    name: 'cacheHit',
    help: 'cache hit times total',
  },
  cacheMiss: {
    name: 'cacheMiss',
    help: 'cache miss times total',
  },
});
