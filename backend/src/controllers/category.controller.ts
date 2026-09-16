import { Request, Response } from "express";
import { categoryService } from "../services/category.service";
import { CategoryQuery } from "../types/category.type";

export const categoryController = {
  async findAll(req: Request, res: Response) {
    const [categories, count] = await categoryService.findAll(
      req.query as unknown as CategoryQuery,
    );
    res.json({
      message: "Get categories success",
      data: categories,
      meta: {
        total: count,
        limit: req.query.limit ? req.query.limit : 10,
      },
      success: true,
    });
  },
  async create(req: Request, res: Response) {
    const category = await categoryService.create(req.body);
    res.status(201).json({
      message: "Create category success",
      data: category,
      success: true,
    });
  },
  async find(req: Request, res: Response) {
    const category = await categoryService.find(+req.params.id!);
    res.status(201).json({
      message: "Get category success",
      data: category,
      success: true,
    });
  },
  async update(req: Request, res: Response) {
    const category = await categoryService.update(req.body, +req.params.id!);
    res.json({
      message: "Update category success",
      data: category,
      success: true,
    });
  },
  async delete(req: Request, res: Response) {
    const category = await categoryService.delete(+req.params.id!);
    res.json({
      message: "Delete category success",
      data: category,
      success: true,
    });
  },
};
