import { Publisher, OrderCreatedEvent, Subjects } from "@kaustubhtech/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
