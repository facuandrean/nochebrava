import type { Request, Response } from "express";
import { productService } from "../services/productService";
import type { Product } from "../types/type";
import { AppError } from "../errors";


const getProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products: Product[] = await productService.getProducts();

    if (products.length === 0) {
      res.status(404).json({
        status: 'Operación fallida',
        message: 'No se han encontrado productos.',
        data: []
      });
    }

    res.status(200).json({
      status: 'Operación exitosa',
      message: 'Productos obtenidos correctamente.',
      data: products
    });

    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: 'Operación fallida',
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: 'Operación fallida',
      message: 'Error interno del servidor.',
      data: []
    });
    return;
  }
};


const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_product = req.params.id_product as string;

    const product: Product | undefined = await productService.getProductById(id_product);

    if (!product) {
      res.status(404).json({
        status: 'Operación fallida',
        message: 'No se ha encontrado el producto de id: ' + id_product,
        data: []
      });
      return;
    }

    res.status(200).json({
      status: 'Operación exitosa',
      message: 'Producto obtenido correctamente.',
      data: product
    });

    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: 'Operación fallida',
        message: error.message,
        data: error.data
      });
    }

    res.status(500).json({
      status: 'Operación fallida',
      message: 'Error interno del servidor.',
      data: []
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