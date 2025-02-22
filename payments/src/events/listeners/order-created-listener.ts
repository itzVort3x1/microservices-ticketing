import {
    Listener,
    OrderCreatedEvent,
    OrderStatus,
    Subjects,
} from "@kaustubhtech/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const order = Order.build({
            id: data.id,
            version: data.version,
            price: data.ticket.price,
            status: OrderStatus.Created,
            userId: data.userId,
        });

        await order.save();

        msg.ack();
    }
}
