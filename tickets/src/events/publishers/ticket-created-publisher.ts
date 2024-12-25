import { Publisher, Subjects, TicketCreatedEvent } from "@kaustubhtech/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
