import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/tickets";

describe("Orders module delete route", () => {
    it("marks an order as cancelled", async () => {
        // Create a ticket
        const ticket = Ticket.build({
            title: "concert",
            price: 20,
        });
        await ticket.save();

        const user = global.signin();

        // Make a request to build an order with this ticket
        const { body: order } = await request(app)
            .post("/api/orders")
            .set("Cookie", user)
            .send({
                ticketId: ticket.id,
            })
            .expect(201);

        // Make request to fetch the order
        await request(app)
            .delete(`/api/orders/${order.id}`)
            .set("Cookie", user)
            .send()
            .expect(204);

        const updatedOrder = await Order.findById(order.id);

        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    });

    it.todo("emits an order cancelled event");
});
