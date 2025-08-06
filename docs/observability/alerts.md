# Application Monitoring Alerts

Alerts are based on:

- **Logging**
- **Metrics** — `REDMetrics`/`CacheMetrics`

---

## RED Metrics

### 1. High Error Rate

- **Condition**: `errorTotal` count > 10% of total requests in the last 5 minutes
- **Why**: Potential service degradation or external dependency failure

### 2. High Request Duration

- **Condition**: 95-th percentile of `requestDuration` > 1000ms
- **Why**: May signal performance bottlenecks or infrastructure issues

### 3. Sudden Drop in Request Rate

- **Condition**: `requestTotal` count drops > 80% compared to the previous hour
- **Why**: Could indicate system downtime, microservices communication issues, or traffic loss

---

## Cache Metrics

### 4. Low Cache Hit Correlation

- **Condition**: `cacheHit / (cacheHit + cacheMiss)` < 40% over the last 10 minutes
- **Why**: Could indicate cache issues/misconfigurations or broken caching logic

---

## Logging Alerts

### 5. High Volume of Error Logs

- **Condition**: More than N `error`-level logs in the last 5 minutes
- **Why**: Can reveal silent failures

### 6. Repeated Error Type

- **Condition**: More than 10 `error` logs with the same message within 5 minutes
- **Why**: Helps identify recurring failures in a specific functionality
