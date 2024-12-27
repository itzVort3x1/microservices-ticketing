import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@kaustubhtech/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: "concert",
        price: 10,
        userId: "asdasd",
    });

    await ticket.save();

    // create a fake data event
    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: "asdasd",
        ticket: {
            id: ticket.id,
            price: 10,
        },
    };
    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };
    // return all of this stuff
    return { listener, data, msg };
};

describe("listeners module", () => {
    it("sets the userId of the ticket", async () => {
        const { listener, data, msg } = await setup();

        await listener.onMessage(data, msg);

        const updatedTicket = await Ticket.findById(data.ticket.id);

        expect(updatedTicket!.orderId).toEqual(data.id);
    });

    it("acks the message", async () => {
        const { listener, data, msg } = await setup();

        await listener.onMessage(data, msg);

        expect(msg.ack).toHaveBeenCalled();
    });

    it("publishes a ticket updated event", async () => {
        const { listener, data, msg } = await setup();

        await listener.onMessage(data, msg);

        expect(natsWrapper.client.publish).toHaveBeenCalled();

        const ticketUpdatedData = JSON.parse(
            (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
        );

        expect(data.id).toEqual(ticketUpdatedData.orderId);
    });
});
