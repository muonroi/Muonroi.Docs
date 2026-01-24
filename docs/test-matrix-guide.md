# Ma trận kiểm thử

Tài liệu gợi ý một số kịch bản kiểm thử tối thiểu cho từng thành phần chính của thư viện.

## AuthN/AuthZ

- Ma trận vai trò × endpoint (allow/deny)
- Refresh token
- Key rollover theo tenant
- Tham khảo [OWASP ASVS V2/V4](https://owasp.org/ASVS/)

## Multi-tenant

- Isolation test (row-level)
- Connection resolver test (DB-per-tenant)
- Migration / add tenant
- Tham khảo *Building SPAs* - Carl Rippon

## Rule engine

- Conflict / ordering
- Backward compatibility khi thay rule
- Kiểm tra "facts contract" để tránh breaking change
- Tham khảo tài liệu và ví dụ trên GitHub

## Messaging / Jobs

- Retry / backoff
- Idempotency
- Outbox / inbox
- Dead letter queue (DLQ)
- Schedule misfire (Quartz) hoặc delayed jobs (Hangfire)
