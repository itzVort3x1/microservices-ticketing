import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/tickets";

const buildTicket = () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20,
    });
    return ticket.save();
};

describe("Orders Module index route.ts", () => {
    it("fetches orders for a particular user", async () => {
        // Create three tickets
        const ticket1 = await buildTicket();
        const ticket2 = await buildTicket();
        const ticket3 = await buildTicket();

        const userOne = global.signin();
        const userTwo = global.signin();

        // Create one order as User #1
        await request(app)
            .post("/api/orders")
            .set("Cookie", userOne)
            .send({
                ticketId: ticket1.id,
            })
            .expect(201);

        // Create two orders as User #2
        const { body: orderOne } = await request(app)
            .post("/api/orders")
            .set("Cookie", userTwo)
            .send({
                ticketId: ticket2.id,
            })
            .expect(201);

        const { body: orderTwo } = await request(app)
            .post("/api/orders")
            .set("Cookie", userTwo)
            .send({
                ticketId: ticket3.id,
            })
            .expect(201);

        // Make request to get orders for User #2
        const response = await request(app)
            .get("/api/orders")
            .set("Cookie", userTwo)
            .expect(200);

        // Make sure we only got the orders for User #2
        expect(response.body.length).toEqual(2);
        expect(response.body[0].id).toEqual(orderOne.id);
        expect(response.body[1].id).toEqual(orderTwo.id);
        expect(response.body[0].ticket.id).toEqual(ticket2.id);
        expect(response.body[1].ticket.id).toEqual(ticket3.id);
    });
});
