import {
    Listener,
    NotFoundError,
    OrderCreatedEvent,
    Subjects,
} from "@kaustubhtech/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        // Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);
        // If no ticket, throw an error
        if (!ticket) {
            throw new NotFoundError();
        }

        // Mark the ticket as being reserved by setting its orderId property
        ticket.set({ orderId: data.id });
        // Save the ticket
        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            orderId: ticket.orderId,
            userId: ticket.userId,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
        });

        // Ack the message
        msg.ack();
    }
}
