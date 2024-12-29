import express from "express";
import { getCustomerDetail, getCustomers, searchCustomers, upsertCustomer } from "./customers.service";
import { getOrdersForCustomer } from "../orders/orders.service";
import { customerPOSTRequestSchema, idUUIDRequestSchema } from "../types";
import { validate } from "../../middleware/validation.middleware";

export const customersRouter = express.Router();

customersRouter.get("/", async (req, res) => {
    const customers = await getCustomers();
    res.json(customers);
})

customersRouter.get("/:id", validate(idUUIDRequestSchema),  async (req, res) => {
    const customer = await getCustomerDetail(req.params.id);
    if (customer != null){
        res.json(customer);
    }
    else{
        res.status(404).json({"message": "customer not found"});
    }
})

customersRouter.get("/:id/orders", async(req, res) => {
    const orders = await getOrdersForCustomer(req.params.id);
    res.json(orders);
})

customersRouter.get("/search/:query", async (req, res) => {
    const customers = await searchCustomers(req.params.query);
    res.json(customers);
})

customersRouter.post("/", validate(customerPOSTRequestSchema), async(req, res) => {
    const data = customerPOSTRequestSchema.parse(req);
    const customer = await upsertCustomer(data.body);

    if (customer != null){
        res.status(201).json(customer);
    } else {
        res.status(500).json({"message": "invalid data"});
    }
})