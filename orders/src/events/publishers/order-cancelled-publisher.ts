import { Publisher, OrderCancelledEvent, Subjects } from "@kaustubhtech/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
