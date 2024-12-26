import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../models/order";
import {
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
} from "@kaustubhtech/common";

const router = express.Router();

router.delete(
    "/api/orders/:orderId",
    requireAuth,
    async (req: Request, res: Response) => {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        order.status = OrderStatus.Cancelled;

        await order.save();

        // Publish an event saying that the order was cancelled

        res.send(204).send(order);
    }
);

export { router as deleteOrderRouter };
