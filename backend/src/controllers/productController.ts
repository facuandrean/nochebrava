import type { Request, Response } from "express";
import { productService } from "../services/productService";
import type { Product, ProductBodyPost, ProductBodyUpdate, ProductWithoutId } from "../types/types";
import { AppError } from "../errors";
import { getCurrentDate } from "../utils/date";

const getProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products: Product[] = await productService.getProducts();

    if (products.length === 0) {
      res.status(404).json({
        status: 'Operación fallida',
        message: 'No se han encontrado productos.',
        data: []
      });
      return;
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


const postProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const date = getCurrentDate();
    const productData = req.body as ProductBodyPost;

    const newProduct: ProductWithoutId = {
      ...productData,
      created_at: date,
      updated_at: date
    }

    const product: Product = await productService.postProduct(newProduct);

    res.status(201).json({
      status: 'Operación exitosa',
      message: 'Producto creado correctamente.',
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


const patchProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const date = getCurrentDate();
    const id_product = req.params.id_product as string;
    const productData = req.body as ProductBodyUpdate;

    const oldProductData: Product | undefined = await productService.getProductById(id_product);

    if (!oldProductData) {
      res.status(404).json({
        status: 'Operación fallida',
        message: 'No se ha encontrado el producto de id: ' + id_product,
        data: []
      });
      return;
    }

    const newProductData = {
      ...oldProductData,
      ...productData,
      updated_at: date
    }

    const updatedProduct: Product = await productService.patchProduct(id_product, newProductData);

    res.status(200).json({
      status: 'Operación exitosa',
      message: 'Producto actualizado correctamente.',
      data: updatedProduct
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


const deleteProduct = async (req: Request, res: Response): Promise<void> => {
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

    await productService.deleteProduct(id_product);

    res.status(200).json({
      status: 'Operación exitosa',
      message: 'Producto eliminado correctamente.',
      data: []
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

export const productController = {
  getProducts,
  getProductById,
  postProduct,
  patchProduct,
  deleteProduct,
};