import express from "express";
import { getItemDetail, getItems, upsertItem } from "./items.service";
import { idNumberRequestSchema, itemPOSTRequestSchema } from "../types";
import { ZodObject, ZodNumber, ZodTypeAny } from "zod";
import { validate } from "../../middleware/validation.middleware";

export const itemsRouter = express.Router();

itemsRouter.get("/", async (req, res) => {
  const items = await getItems();
  items.forEach((item) => {
    item.imageUrl = buildImageUrl(req, item.id);
  });
  res.json(items);
} )

itemsRouter.get("/:id", validate(idNumberRequestSchema), async (req, res) => {
  const data = idNumberRequestSchema.parse(req);
  const id = parseInt(req.params.id);
  const item = await getItemDetail(id);  
  if (item != null){
    //item.imageUrl = buildImageUrl(req, item.id);
    res.json(item);
  }
  else{
    res.status(404).json({"message": "item not found"});
  }
})

itemsRouter.post("/", validate(itemPOSTRequestSchema), async (req, res) => {
  const data = itemPOSTRequestSchema.parse(req);
  const item = await upsertItem(data.body);

  if (item != null){
    res.status(201).json(item);
  } else {
    res.status(500).json({
      "message": "invalid data"
    })
  }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
function buildImageUrl(req: any, id: number): string {
  return `${req.protocol}://${req.get("host")}/images/${id}.jpg`;
}


