import type { Request, Response } from "express";
import { productService } from "../services/productService";
import type { Product, ProductBodyPost, ProductBodyUpdate } from "../types/types";
import { AppError } from "../errors";

/**
 * Retrieves all products available in the system.
 * 
 * @description This function fetches all products from the database through the product service.
 * If no products are found, returns a 404 error with an empty array.
 * On success, returns an array with all found products.
 * 
 * @param {Request} _req - Express request object (unused)
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const getProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products: Product[] = await productService.getProducts();

    if (products.length === 0) {
      res.status(404).json({
        status: 'Operación exitosa.',
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

/**
 * Retrieves a specific product by its ID.
 * 
 * @description This function searches for a product in the database using its unique ID.
 * If the product doesn't exist, returns a 404 error.
 * On success, returns the complete data of the found product.
 * 
 * @param {Request} req - Express request object that must contain id_product in parameters
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_product = req.params.id_product as string;

    const product: Product | undefined = await productService.getProductById(id_product);

    if (!product) {
      res.status(404).json({
        status: 'Operación exitosa.',
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

/**
 * Creates a new product in the system.
 * 
 * @description This function creates a new product with the data provided in the request body.
 * Automatically assigns creation and update dates.
 * Returns the created product with all its data, including the generated ID.
 * 
 * @param {Request} req - Express request object that must contain product data in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs (validation, duplicates, etc.)
 * @throws {Error} When an internal server error occurs
 */
const postProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = req.body as ProductBodyPost;

    const product: Product = await productService.postProduct(productData);

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

/**
 * Updates an existing product by its ID.
 * 
 * @description This function updates the data of an existing product.
 * First verifies that the product exists, then combines existing data with new provided data.
 * Automatically updates the modification date.
 * 
 * @param {Request} req - Express request object that must contain id_product in parameters and data to update in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const patchProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_product = req.params.id_product as string;
    const productData = req.body as ProductBodyUpdate;

    const oldProductData: Product | undefined = await productService.getProductById(id_product);

    if (!oldProductData) {
      res.status(404).json({
        status: 'Operación exitosa.',
        message: 'No se ha encontrado el producto de id: ' + id_product,
        data: []
      });
      return;
    }

    const updatedProduct: Product = await productService.patchProduct(id_product, productData);

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

/**
 * Deletes a product from the system by its ID.
 * 
 * @description This function permanently removes a product from the database.
 * First verifies that the product exists before proceeding with deletion.
 * Once deleted, returns a confirmation of the operation.
 * 
 * @param {Request} req - Express request object that must contain id_product in parameters
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_product = req.params.id_product as string;

    const product: Product | undefined = await productService.getProductById(id_product);

    if (!product) {
      res.status(404).json({
        status: 'Operación exitosa.',
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