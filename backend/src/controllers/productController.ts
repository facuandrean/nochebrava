import type { Request, Response } from "express";
import { productService } from "../services/productService";


const getProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      message: "Products fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
    });
  }
};


const getProductById = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      message: "Product fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
    });
  }
};


const postProduct = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      message: "Product created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
    });
  }
};


const patchProduct = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
    });
  }
};


const deleteProduct = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
    });
  }
};

export const productController = {
  getProducts,
  getProductById,
  postProduct,
  patchProduct,
  deleteProduct,
};