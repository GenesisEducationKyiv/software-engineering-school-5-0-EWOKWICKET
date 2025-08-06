## Log Retention Policy

### Log Types and Retention Durations

| Log Level | Example Use Cases                               | Retention Period |
| --------- | ----------------------------------------------- | ---------------- |
| `error`   | Unexpected exceptions                           | **90 days**      |
| `info`    | Business events, operations                     | **60 days**      |
| `warn`    | Recoverable issues, potential misconfigurations | **30 days**      |
| `debug`   | Low-level details for dev troubleshooting       | **7 days**       |

---

### Archiving Strategy

- After expiration, `error` logs are optionally archived to cold storage for historical investigation.
- Other logs (`warn`, `info`, `debug`) are **deleted** automatically after their retention period.

---

### Deletion

- Logs are managed by the log aggregation system (**Loki**) with automatic **retention rules**.
- No manual deletion is needed — old logs are dropped or archived based on time-based policies.

---

### Why These Choices?

- **error logs** are retained longer because they are critical for root-cause analysis of past incidents.
- **info logs** are retained for a long time so as to be able to aggregate and collect more business metrics for analysis.
- **warn logs** are useful for tracking some occasional non-critical temporary issues(third-parties' exceptions in most).
- **debug logs** generate high volume and are mostly useful during short-term debugging sessions.
