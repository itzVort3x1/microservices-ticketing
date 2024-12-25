import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
    var signin: () => string[];
}

let mongo: any;

jest.mock("../nats-wrapper");

beforeAll(async () => {
    process.env.JWT_KEY = "testkey";
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    jest.clearAllMocks();
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = () => {
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: "test@test.com",
    };

    const token = jwt.sign(payload, process.env.JWT_KEY!);

    const session = { jwt: token };

    const base64 = Buffer.from(JSON.stringify(session)).toString("base64");

    return [`session=${base64}`];
};
