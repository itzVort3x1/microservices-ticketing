import { Message } from "node-nats-streaming";
import {
    Subjects,
    Listener,
    TicketUpdatedEvent,
    NotFoundError,
} from "@kaustubhtech/common";
import { Ticket } from "../../models/tickets";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
            throw new NotFoundError();
        }

        const { title, price } = data;
        ticket.set({ title, price });
        await ticket.save();

        msg.ack();
    }
}
