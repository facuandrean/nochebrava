import type { Request, Response } from "express";
import { AppError } from "../errors";
import type { Category, CategoryBodyPost, CategoryBodyUpdate } from "../types/types";
import { categoryService } from "../services/categoryService";

/**
 * Retrieves all categories available in the system.
 * 
 * @description This function fetches all categories stored in the database.
 * If no categories are found, returns a 404 error with an empty array.
 * On success, returns an array with all found categories.
 * 
 * @param {Request} _req - Express request object (unused)
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories: Category[] = await categoryService.getCategories();

    res.status(200).json({
      status: "Operación exitosa.",
      message: categories.length === 0 ? "No se encontraron categorías." : "Categorías obtenidas correctamente.",
      data: categories
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida",
      message: "Error interno del servidor.",
      data: []
    });
    return;
  }
}

/**
 * Retrieves a specific category by its ID.
 * 
 * @description This function searches for a category in the database using its unique ID.
 * If the category doesn't exist, returns a 404 error.
 * On success, returns the complete data of the found category.
 * 
 * @param {Request} req - Express request object that must contain category_id in parameters
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const category_id = req.params.category_id as string;

    const category: Category | undefined = await categoryService.getCategoryById(category_id);

    if (!category) {
      res.status(404).json({
        status: "Operación exitosa.",
        message: "No se encontró la categoría.",
        data: []
      });
      return;
    };

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Categoría obtenida correctamente.",
      data: category
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida",
      message: "Error interno del servidor.",
      data: []
    });
    return;
  }
}

/**
 * Creates a new category in the system.
 * 
 * @description This function creates a new category with the data provided in the request body.
 * Automatically assigns creation and update dates.
 * Returns the created category with all its data, including the generated ID.
 * 
 * @param {Request} req - Express request object that must contain category data in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs (validation, duplicates, etc.)
 * @throws {Error} When an internal server error occurs
 */
const postCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const dataCategory: CategoryBodyPost = req.body;

    const category: Category = await categoryService.postCategory(dataCategory);

    res.status(201).json({
      status: "Operación exitosa.",
      message: "Categoría creada correctamente.",
      data: category
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida",
      message: "Error interno del servidor.",
      data: []
    });
    return;
  }
}

/**
 * Updates an existing category by its ID.
 * 
 * @description This function updates the data of an existing category.
 * First verifies that the category exists, then combines existing data with new provided data.
 * Automatically updates the modification date.
 * 
 * @param {Request} req - Express request object that must contain category_id in parameters and data to update in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const patchCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category_id = req.params.category_id as string;
    const dataCategory = req.body as CategoryBodyUpdate;

    const oldDataCategory: Category | undefined = await categoryService.getCategoryById(category_id);

    if (!oldDataCategory) {
      res.status(404).json({
        status: "Operación exitosa.",
        message: "No se encontró la categoría.",
        data: []
      });
      return;
    };

    const categoryUpdated: Category = await categoryService.patchCategory(category_id, dataCategory);

    res.status(201).json({
      status: "Operación exitosa.",
      message: "Categoría actualizada correctamente.",
      data: categoryUpdated
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida",
      message: "Error interno del servidor.",
      data: []
    });
    return;
  }
};

/**
 * Deletes a category from the system by its ID.
 * 
 * @description This function permanently removes a category from the database.
 * First verifies that the category exists before proceeding with deletion.
 * Once deleted, returns a confirmation of the operation.
 * 
 * @param {Request} req - Express request object that must contain category_id in parameters
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category_id = req.params.category_id as string;

    const category: Category | undefined = await categoryService.getCategoryById(category_id);

    if (!category) {
      res.status(404).json({
        status: "Operación exitosa.",
        message: "No se encontró la categoría.",
        data: []
      });
      return;
    };

    await categoryService.deleteCategory(category_id);

    res.status(201).json({
      status: "Operación exitosa.",
      message: "Categoría eliminada correctamente.",
      data: []
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida",
      message: "Error interno del servidor.",
      data: []
    });
    return;
  }
};

export const categoryController = {
  getCategories,
  getCategoryById,
  postCategory,
  patchCategory,
  deleteCategory
}