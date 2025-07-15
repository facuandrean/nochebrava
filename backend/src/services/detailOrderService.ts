import { db } from "../database/database";
import { detailOrders } from "../database/db/detailOrderScheme";
import type { DetailOrder, DetailOrderBody, UUIDInput } from "../types/types";
import { AppError } from "../errors";
import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm";
import { getCurrentDate } from "../utils/date";

const getDetailOrders = async (): Promise<DetailOrder[]> => {
  try {
    const allDetailOrders: DetailOrder[] = await db.select().from(detailOrders).all();
    return allDetailOrders;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener los detalles de las ordenes.", 400, []);
  }
}

const getDetailOrdersById = async (order_detail_id: string | UUIDInput): Promise<DetailOrder | undefined> => {
  try {
    const detailOrder: DetailOrder | undefined = await db.select().from(detailOrders).where(eq(detailOrders.order_detail_id, order_detail_id)).get();
    return detailOrder;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener el detalle de la orden.", 400, []);
  }
}

const postDetailOrder = async (dataDetailOrder: DetailOrderBody): Promise<DetailOrder> => {
  try {
    const newDetailOrder: DetailOrder = {
      order_detail_id: uuid(),
      created_at: getCurrentDate(),
      ...dataDetailOrder
    };
    const detailOrder: DetailOrder = await db.insert(detailOrders).values(newDetailOrder).returning().get();
    return detailOrder;
  } catch (detailOrder) {
    throw new AppError("Ocurrió un error al crear el detalle de la orden.", 400, []);
  }
}

const deleteDetailOrder = async (order_detail_id: string): Promise<void> => {
  try {
    await db.delete(detailOrders).where(eq(detailOrders.order_detail_id, order_detail_id));
    return;
  } catch (error) {
    throw new AppError("Ocurrió un error al eliminar el detalle de la orden.", 400, []);
  }
};

/**
 * Obtiene todos los detalles de una orden específica
 */
const getDetailOrdersByOrderId = async (order_id: string): Promise<DetailOrder[]> => {
  try {
    const detailOrdersList: DetailOrder[] = await db.select().from(detailOrders).where(eq(detailOrders.order_id, order_id)).all();
    return detailOrdersList;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener los detalles de la orden.", 500, []);
  }
}

export const detailOrderService = {
  getDetailOrders,
  getDetailOrdersById,
  getDetailOrdersByOrderId,
  postDetailOrder,
  deleteDetailOrder
}