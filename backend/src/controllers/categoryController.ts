import type { Request, Response } from "express";
import { AppError } from "../errors";
import type { Category, CategoryBodyPost, CategoryBodyUpdate, CategoryWithoutId } from "../types/types";
import { categoryService } from "../services/categoryService";
import { getCurrentDate } from "../utils/date";

const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories: Category[] = await categoryService.getCategories();

    if (categories.length === 0) {
      res.status(404).json({
        status: "Operación fallida",
        message: "No se encontraron categorías.",
        data: []
      });
      return;
    };

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Categorías obtenidas correctamente.",
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

const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const category_id = req.params.category_id as string;

    const category: Category | undefined = await categoryService.getCategoryById(category_id);

    if (!category) {
      res.status(404).json({
        status: "Operación fallida",
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

const postCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const date = getCurrentDate();
    const dataCategory: CategoryBodyPost = req.body;

    const newCategory: CategoryWithoutId = {
      ...dataCategory,
      created_at: date,
      updated_at: date
    }

    const category: Category = await categoryService.postCategory(newCategory);

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

const patchCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const date = getCurrentDate();
    const category_id = req.params.category_id as string;
    const dataCategory = req.body as CategoryBodyUpdate;

    const oldDataCategory: Category | undefined = await categoryService.getCategoryById(category_id);

    if (!oldDataCategory) {
      res.status(404).json({
        status: "Operación fallida",
        message: "No se encontró la categoría.",
        data: []
      });
      return;
    };

    const newCategoryData: Category = {
      ...oldDataCategory,
      ...dataCategory,
      updated_at: date
    }

    const categoryUpdated: Category = await categoryService.patchCategory(newCategoryData);

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

const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category_id = req.params.category_id as string;

    const category: Category | undefined = await categoryService.getCategoryById(category_id);

    if (!category) {
      res.status(404).json({
        status: "Operación fallida",
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