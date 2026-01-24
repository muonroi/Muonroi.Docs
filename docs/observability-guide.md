# Observability Guide

This library now provides end-to-end observability using [OpenTelemetry](https://opentelemetry.io/).

## Enabling OpenTelemetry

1. Add the configuration section to your `appsettings.json`:

```json
"OpenTelemetry": {
  "ServiceName": "MyService",
  "OtlpEndpoint": "http://localhost:4317"
}
```

2. Register observability services in `Program.cs`:

```csharp
services.AddObservability(configuration);
```

The extension enables tracing for HTTP, gRPC, MassTransit publish/consume pipelines and background jobs. Metrics are also collected and both are exported via OTLP so that backends such as Tempo or Jaeger can receive the data.

## ECS Logging for MassTransit

The MassTransit pipeline automatically enriches the Serilog log context with [Elastic Common Schema](https://www.elastic.co/guide/en/ecs/current/ecs-reference.html) fields like `message.id`, `correlation.id` and `conversation.id` for both published and consumed messages. This makes querying logs in Elasticsearch or OpenSearch straightforward.
