import { Request, Response } from "express";
import { productService } from "../services/product.service";
import { ProductQuery } from "../types/product.type";

export const productController = {
  async findAll(req: Request, res: Response) {
    const [products, count] = await productService.findAll(req.query as unknown as ProductQuery);
    return res.json({
      success: true,
      message: "Get products success",
      data: products,
      meta: {
        total: count,
        limit: req.query.limit ? req.query.limit : 10,
      },
    });
  },
  async find(req: Request, res: Response) {
    const { id } = req.params;
    const product = await productService.find(+id!);
    return res.json({
      success: true,
      message: "Get product success",
      data: product,
    });
  },
  async create(req: Request, res: Response) {
    const product = await productService.create(req.body);
    return res.json({
      success: true,
      message: "Create product success",
      data: product,
    });
  },
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const body = req.body;
    const product = await productService.update(body, +id!);
    return res.json({
      success: true,
      message: "Update product success",
      data: product,
    })
  },
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const product = await productService.delete(+id!);
    return res.json({
      success: true,
      message: "Delete product success",
      data: product,
    })
  },

};
