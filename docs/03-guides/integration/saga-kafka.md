# Sử dụng Saga Pattern với Kafka

Tài liệu này hướng dẫn cách áp dụng Saga Pattern khi sử dụng Kafka thông qua thư viện Muonroi Building Block.

## Đăng ký Saga

Phương thức `AddMessageBus` hỗ trợ truyền thêm một `Action<IBusRegistrationConfigurator>` để cấu hình MassTransit. Bạn có thể dùng tham số này để đăng ký Saga State Machine.

```csharp
services.AddMessageBus(configuration, Assembly.GetExecutingAssembly(), cfg =>
{
    cfg.SetKebabCaseEndpointNameFormatter();
    cfg.AddSagaStateMachine<OrderStateMachine, OrderState>()
       .InMemoryRepository();
});
```

Ví dụ trên sử dụng kho lưu trữ InMemory. Trong môi trường microservice bạn nên thay thế bằng kho bền vững như Entity Framework hoặc MongoDB.

## Mô hình Saga đơn giản

```csharp
public record SubmitOrder(Guid OrderId);
public record OrderAccepted(Guid OrderId);

public class OrderState : SagaStateMachineInstance
{
    public Guid CorrelationId { get; set; }
    public int CurrentState { get; set; }
}

public class OrderStateMachine : MassTransitStateMachine<OrderState>
{
    public State Submitted { get; private set; }
    public State Accepted { get; private set; }

    public Event<SubmitOrder> SubmitOrder { get; private set; } = null!;
    public Event<OrderAccepted> OrderAccepted { get; private set; } = null!;

    public OrderStateMachine()
    {
        InstanceState(x => x.CurrentState);

        Event(() => SubmitOrder, x => x.CorrelateById(m => m.Message.OrderId));
        Event(() => OrderAccepted, x => x.CorrelateById(m => m.Message.OrderId));

        Initially(
            When(SubmitOrder)
                .TransitionTo(Submitted)
                .Publish(ctx => new OrderAccepted(ctx.Saga.CorrelationId)));

        During(Submitted,
            When(OrderAccepted)
                .TransitionTo(Accepted)
                .Finalize());

        SetCompletedWhenFinalized();
    }
}
```

## Tích hợp trong dự án

Trong dự án monolith hoặc microservice, bạn chỉ cần triển khai các message và state machine như trên, sau đó đăng ký `AddMessageBus` với cấu hình Saga. Khi chạy, MassTransit sẽ sử dụng Kafka làm message broker để điều phối các bước trong Saga.
