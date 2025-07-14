import { db } from "../database/database";
import { orders } from "../database/db/orderScheme";
import type { Order, OrderBodyPost, UUIDInput } from "../types/types";
import { AppError } from "../errors";
import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm";
import { getCurrentDate } from "../utils/date";

const getOrders = async (): Promise<Order[]> => {
  try {
    const allOrders: Order[] = await db.select().from(orders).all();
    return allOrders;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener las ordenes.", 400, []);
  }
}

const getOrderById = async (order_id: string | UUIDInput): Promise<Order | undefined> => {
  try {
    const order: Order | undefined = await db.select().from(orders).where(eq(orders.order_id, order_id)).get();
    return order;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener la orden.", 400, []);
  }
}

const postOrder = async (dataOrder: OrderBodyPost): Promise<Order> => {
  try {

    const newOrder: Order = {
      order_id: uuid(),
      date: getCurrentDate(),
      created_at: getCurrentDate(),
      ...dataOrder
    };

    const order: Order = await db.insert(orders).values(newOrder).returning().get();
    return order;
  } catch (error) {
    throw new AppError("Ocurrió un error al crear la orden.", 400, []);
  }
}

const deleteOrder = async (order_id: string): Promise<void> => {
  try {
    await db.delete(orders).where(eq(orders.order_id, order_id));
    return;
  } catch (error) {
    throw new AppError("Ocurrió un error al eliminar la orden.", 400, []);
  }
};

export const orderService = {
  getOrders,
  getOrderById,
  postOrder,
  deleteOrder
}