import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent } from "@kaustubhtech/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: "concert",
        price: 10,
        userId: "asdasd",
    });

    ticket.set({ orderId });
    await ticket.save();

    // create a fake data event
    const data: OrderCancelledEvent["data"] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        },
    };
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };
    // return all of this stuff
    return { listener, ticket, data, msg, orderId };
};

describe("order cancelled listener test", () => {
    it("updates the ticket, publishes and event and acks the message", async () => {
        const { msg, data, ticket, listener, orderId } = await setup();

        await listener.onMessage(data, msg);

        const updatedTicket = await Ticket.findById(ticket.id);

        expect(updatedTicket!.orderId).not.toBeDefined();
        expect(msg.ack).toHaveBeenCalled();
        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
});
