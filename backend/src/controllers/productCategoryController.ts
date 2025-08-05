import type { Request, Response } from 'express';
import { AppError } from '../errors';
import { productCategoryService } from '../services/productCategoryService';
import type { Category, Product, ProductCategoryBodyPost, ProductCategoryBodyUpdate, ProductCategoriesBatchBodyPost, ProductCategoriesBatchBodyPut, UUIDInput } from '../types/types';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

/**
 * Retrieves all products by category from the database.
 * 
 * @description This function fetches all products that belong to a specific category
 * through the product-category service. First validates that the category exists,
 * then retrieves all products associated with that category.
 * If no products are found for the category, returns a 404 error with an empty array.
 * 
 * @param {Request} req - Express request object that must contain category_id in parameters
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When the category is not found
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category_id } = req.params as UUIDInput;

    const category: Category | undefined = await categoryService.getCategoryById(category_id);
    if (!category) {
      res.status(404).json({
        status: "Operación exitosa.",
        message: "Categoría no encontrada.",
        data: []
      });
      return;
    }

    const productsByCategory: Product[] = await productCategoryService.getProductsByCategory(category_id);

    if (productsByCategory.length === 0) {
      res.status(404).json({
        status: "Operación exitosa.",
        message: "No se encontraron productos para la categoría " + category_id,
        data: []
      });
      return;
    }

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Productos obtenidos correctamente.",
      data: productsByCategory
    });
    return;
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida.",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida.",
      message: "Error interno del servidor.",
      data: []
    });
    return;
  }
}


/**
 * Retrieves all categories by product from the database.
 * 
 * @description This function fetches all categories that are assigned to a specific product
 * through the product-category service. First validates that the product exists,
 * then retrieves all categories associated with that product.
 * If no categories are found for the product, returns a 404 error with an empty array.
 * 
 * @param {Request} req - Express request object that must contain product_id in parameters
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When the product is not found
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const getCategoriesByProduct = async (req: Request, res: Response): Promise<void> => {
  try {

    const { product_id } = req.params as UUIDInput;

    const product: Product | undefined = await productService.getProductById(product_id);
    if (!product) {
      res.status(404).json({
        status: "Operación exitosa.",
        message: "Producto no encontrado.",
        data: []
      });
      return;
    }

    const categoriesByProduct: Category[] = await productCategoryService.getCategoriesByProduct(product_id);
    if (categoriesByProduct.length === 0) {
      res.status(404).json({
        status: "Operación exitosa.",
        message: "No se encontraron categorías para el producto.",
        data: []
      });
      return;
    }

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Categorías obtenidas correctamente.",
      data: categoriesByProduct
    });
    return;
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida.",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida.",
      message: "Error interno del servidor.",
      data: []
    });
    return;
  }
}


/**
 * Assigns a category to a product in the database.
 * 
 * @description This function creates a new relationship between a product and a category
 * through the product-category service. First validates that both the product and category exist,
 * then establishes the relationship. This establishes that a product belongs to a specific category.
 * 
 * @param {Request} req - Express request object that must contain product_id and category_id in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When the product is not found
 * @throws {AppError} When the category is not found
 * @throws {AppError} When a specific application error occurs (validation, duplicates, etc.)
 * @throws {Error} When an internal server error occurs
 */
const assignCategoryToProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product_id, category_id } = req.body as ProductCategoryBodyPost;

    const product: Product | undefined = await productService.getProductById(product_id);
    if (!product) {
      res.status(404).json({
        status: "Operación exitosa.",
        message: "Producto no encontrado.",
        data: []
      });
      return;
    }

    const category: Category | undefined = await categoryService.getCategoryById(category_id);
    if (!category) {
      res.status(404).json({
        status: "Operación exitosa.",
        message: "Categoría no encontrada.",
        data: []
      });
      return;
    }

    await productCategoryService.assignCategoryToProduct(product_id, category_id);

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Categoría asignada al producto correctamente.",
      data: []
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida.",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida.",
      message: "Error interno del servidor.",
      data: []
    });
    return;
  }
}

/**
 * Updates the category assignment of a product in the database.
 * 
 * @description This function updates the relationship between products and categories.
 * It takes the old product-category relationship from parameters and the new relationship from the body.
 * First verifies that all products and categories exist (old and new), then updates the relationship.
 * 
 * @param {Request} req - Express request object that must contain product_id_old and category_id_old in parameters, and product_id and category_id in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When any of the products or categories are not found
 * @throws {AppError} When the new relationship already exists
 * @throws {AppError} When a database error occurs during the update
 * @throws {Error} When an internal server error occurs
 */
const updateProductCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product_id_old, category_id_old } = req.params as UUIDInput;
    const { product_id, category_id } = req.body as ProductCategoryBodyUpdate;

    const product_old: Product | undefined = await productService.getProductById(product_id_old);
    if (!product_old) {
      res.status(404).json({
        status: "Operación exitosa.",
        message: "Producto a actualizar no encontrado.",
        data: []
      });
      return;
    }

    const category_old: Category | undefined = await categoryService.getCategoryById(category_id_old);
    if (!category_old) {
      res.status(404).json({
        status: "Operación exitosa.",
        message: "Categoría a actualizar no encontrada.",
        data: []
      });
      return;
    }

    const product_new: Product | undefined = await productService.getProductById(product_id);
    if (!product_new) {
      res.status(404).json({
        status: "Operación exitosa.",
        message: "Producto a relacionar con una categoría no encontrado.",
        data: []
      });
      return;
    }

    const category_new: Category | undefined = await categoryService.getCategoryById(category_id);
    if (!category_new) {
      res.status(404).json({
        status: "Operación exitosa.",
        message: "Categoría a relacionar con un producto no encontrada.",
        data: []
      });
      return;
    }

    await productCategoryService.updateProductCategory(product_id_old, category_id_old, product_id, category_id);

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Categoría del producto actualizada correctamente.",
      data: []
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida.",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida.",
      message: "Error interno del servidor.",
      data: []
    });
    return;
  }
}


/**
 * Unassigns a category from a product in the database.
 * 
 * @description This function removes the relationship between a product and a category
 * through the product-category service. First validates that both the product and category exist,
 * then removes the category assignment from the product.
 * 
 * @param {Request} req - Express request object that must contain product_id and category_id in parameters
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When the product is not found
 * @throws {AppError} When the category is not found
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const unassignCategoryFromProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product_id, category_id } = req.params as UUIDInput;

    const product: Product | undefined = await productService.getProductById(product_id);
    if (!product) {
      res.status(404).json({
        status: "Operación exitosa.",
        message: "Producto no encontrado.",
        data: []
      });
      return;
    }

    const category: Category | undefined = await categoryService.getCategoryById(category_id);
    if (!category) {
      res.status(404).json({
        status: "Operación exitosa.",
        message: "Categoría no encontrada.",
        data: []
      });
      return;
    }

    await productCategoryService.unassignCategoryFromProduct(product_id, category_id);

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Categoría desasignada del producto correctamente.",
      data: []
    });
    return;
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida.",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida.",
      message: "Error interno del servidor.",
      data: []
    });
    return;
  }
}

/**
 * Assigns multiple categories to a product in the database.
 * 
 * @description This function creates multiple relationships between a product and categories
 * through the product-category service. First validates that the product exists and all 
 * categories exist, then establishes all the relationships in a single operation.
 * 
 * @param {Request} req - Express request object that must contain product_id and category_ids array in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When the product is not found
 * @throws {AppError} When any category is not found
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const assignMultipleCategoriesToProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product_id, category_ids } = req.body as ProductCategoriesBatchBodyPost;

    // Validate product exists
    const product: Product | undefined = await productService.getProductById(product_id);
    if (!product) {
      res.status(404).json({
        status: "Operación exitosa.",
        message: "Producto no encontrado.",
        data: []
      });
      return;
    }

    // Validate all categories exist
    for (const category_id of category_ids) {
      const category: Category | undefined = await categoryService.getCategoryById(category_id);
      if (!category) {
        res.status(404).json({
          status: "Operación exitosa.",
          message: `Categoría ${category_id} no encontrada.`,
          data: []
        });
        return;
      }
    }

    await productCategoryService.assignMultipleCategoriesToProduct(product_id, category_ids);

    res.status(200).json({
      status: "Operación exitosa.",
      message: `${category_ids.length} categorías asignadas al producto correctamente.`,
      data: []
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida.",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida.",
      message: "Error interno del servidor.",
      data: []
    });
    return;
  }
}

/**
 * Replaces all categories of a product with new ones.
 * 
 * @description This function completely replaces all existing category assignments 
 * for a product with a new set of categories. First validates that the product exists 
 * and all new categories exist, then replaces all relationships in a single operation.
 * 
 * @param {Request} req - Express request object that must contain product_id in parameters and category_ids array in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When the product is not found
 * @throws {AppError} When any category is not found
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const replaceProductCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product_id } = req.params as UUIDInput;
    const { category_ids } = req.body as ProductCategoriesBatchBodyPut;

    // Validate product exists
    const product: Product | undefined = await productService.getProductById(product_id);
    if (!product) {
      res.status(404).json({
        status: "Operación exitosa.",
        message: "Producto no encontrado.",
        data: []
      });
      return;
    }

    // Validate all categories exist
    for (const category_id of category_ids) {
      const category: Category | undefined = await categoryService.getCategoryById(category_id);
      if (!category) {
        res.status(404).json({
          status: "Operación exitosa.",
          message: `Categoría ${category_id} no encontrada.`,
          data: []
        });
        return;
      }
    }

    await productCategoryService.replaceProductCategories(product_id, category_ids);

    res.status(200).json({
      status: "Operación exitosa.",
      message: `Categorías del producto reemplazadas correctamente. ${category_ids.length} categorías asignadas.`,
      data: []
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida.",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida.",
      message: "Error interno del servidor.",
      data: []
    });
    return;
  }
}

export const productCategoryController = {
  getProductsByCategory,
  getCategoriesByProduct,
  assignCategoryToProduct,
  updateProductCategory,
  unassignCategoryFromProduct,
  assignMultipleCategoriesToProduct,
  replaceProductCategories
};