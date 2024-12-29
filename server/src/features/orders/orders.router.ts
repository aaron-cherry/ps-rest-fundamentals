import express from "express";
import { addOrderItems, deleteOrder, deleteOrderItem, getOrderDetail, getOrders, upsertOrder } from "./orders.service";
import { idItemIdUUIDRequestSchema, idUUIDRequestSchema, orderItemsDTORequestSchema, orderPOSTRequestSchema, pagingRequestSchema } from "../types";
import { validate } from "../../middleware/validation.middleware";

export const ordersRouter = express.Router();

ordersRouter.get("/", validate(pagingRequestSchema),  async(req, res) => {
    const data = pagingRequestSchema.parse(req);
    const orders = await getOrders(data.query.skip, data.query.take);
    res.json(orders);
})

ordersRouter.get("/:id", validate(idUUIDRequestSchema), async(req, res) => {
    const data = idUUIDRequestSchema.parse(req);
    const order = await getOrderDetail(data.params.id);
    if(order != null){
        res.json(order);
    }
    else{
        res.status(404).json({"message": "order not found"});
    }
})

ordersRouter.post("/", validate(orderPOSTRequestSchema), async(req, res) => {
    const data = orderPOSTRequestSchema.parse(req);
    const order = upsertOrder(data.body);

    if (order != null){
        res.status(201).json(order);
    } else {
        res.status(501).json({"message": "invalid data"});
    }
})

ordersRouter.post("/:id/items", validate(orderItemsDTORequestSchema), async(req, res) => {
    const data = orderItemsDTORequestSchema.parse(req);
    const order = await addOrderItems(data.params.id, data.body);

    if (order != null){
        res.status(201).json(order);
    } else {
        res.status(500).json({message: "Addition falied"});
    }
})

ordersRouter.delete("/:id", validate(idUUIDRequestSchema), async(req, res) => {
    const data = idUUIDRequestSchema.parse(req);
    const order = await deleteOrder(data.params.id);

    if (order != null){
        res.json(order);
    } else {
        res.status(404).json({"message": "Order Not Found"});
    }
})

ordersRouter.delete(":id/items/:itemId", validate(idItemIdUUIDRequestSchema), async(req, res) => {
    const data = idItemIdUUIDRequestSchema.parse(req);
    const order = await deleteOrderItem(data.params.id, data.params.itemId);

    if (order != null){
        res.json(order);
    } else {
        res.status(404).json({"message": "Order Or Item Not Found"});
    }
})
