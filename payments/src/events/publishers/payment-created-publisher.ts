import { Subjects, Publisher, PaymentCreatedEvent } from "@kaustubhtech/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}
