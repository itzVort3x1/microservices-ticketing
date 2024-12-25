import { Publisher, Subjects, TicketUpdatedEvent } from "@kaustubhtech/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
