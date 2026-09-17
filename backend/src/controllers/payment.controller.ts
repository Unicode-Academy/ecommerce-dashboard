import { Request, Response } from "express";
import { paymentService } from "../services/payment.service";

export const paymentController = {
    async getListMethod(req: Request, res: Response) {
        const data = await paymentService.getListMethod();
        return res.json({
            data,
            success: true,
            message: "Get list payment method success"
        })
    },
    async createMethod(req: Request, res: Response) {
        const data = await paymentService.createMethod(req.body);
        return res.json({
            data,
            success: true,
            message: "Create payment method success"
        })
    },
    async updateMethod(req: Request, res: Response) {
        const { id } = req.params;
        const data = await paymentService.updateMethod(req.body, +id!);
        return res.json({
            data,
            success: true,
            message: "Update payment method success"
        })
    },
    async deleteMethod(req: Request, res: Response) {
        const { id } = req.params;
        const data = await paymentService.deleteMethod(+id!);
        return res.json({
            data,
            success: true,
            message: "DElete payment method success"
        })
    }
}