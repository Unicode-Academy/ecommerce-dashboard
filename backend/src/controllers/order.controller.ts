import { Request, Response } from "express";
import { orderService } from "../services/order.service";

export const orderController = {
    async findAll(req: Request, res: Response) {
        const data = await orderService.findAll();
        return res.json({
            success: true,
            message: "Get order list success",
            data
        })
    },

    async find(req: Request, res: Response) {
        const { id } = req.params;
        const data = await orderService.find(+id!);
        return res.json({
            success: true,
            message: "Get order success",
            data
        })
    },

    async create(req: Request, res: Response) {
        const data = await orderService.create(req.body);
        return res.status(201).json({
            data,
            success: true,
            message: "Create order success"
        })
    },

    async findStatusList(req: Request, res: Response) {
        return res.json({
            data: ['PENDING', 'PROCESSING', 'ON_HOLD', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'REFUNDED'],
            success: true,
            message: "Get status list"
        })
    },

    async findPaymentStatusList(req: Request, res: Response) {
        return res.json({
            data: ['PENDING', 'FAILED', 'CANCELED', 'PAID'],
            success: true,
            message: "Get payment status list"
        })
    },

    async updateStatus(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;
        const data = await orderService.updateStatus(+id!, status);
        return res.json(
            {
                data,
                success: true,
                message: "Update status success"
            }
        );
    },

    async updatePaymentStatus(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;
        await orderService.updateOrderStatus(+id!, status);
        return res.json({
            success: true,
            message: "Update status success"
        })
    },

    async updateNote(req: Request, res: Response) {
        const { id } = req.params;
        const { note } = req.body;
        const data = await orderService.updateNote(+id!, note);
        return res.json({
            success: true,
            message: "Update note success",
            data
        })
    },

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const data = await orderService.delete(+id!);
        return res.json({
            data,
            success: true,
            message: "Delete order success"
        })
    }
}