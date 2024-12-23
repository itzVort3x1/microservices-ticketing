import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("has a route handler listening to /api/tickets for post requests", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/tickets/${id}`).send({}).expect(404);
});

it("can only be access if the user is signed in", async () => {
    const title = "concert";
    const price = 20;

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title,
            price: 20,
        })
        .expect(201);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
});
