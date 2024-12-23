import express, { Request, Response } from "express";
import { requireAuth, NotFoundError } from "@kaustubhtech/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
    const tickets = await Ticket.find({});

    res.status(200).send(tickets);
});

export { router as indexTicketRouter };
