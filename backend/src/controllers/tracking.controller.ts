import { Request, Response } from "express";
import { trackingService } from "../services/tracking.service";
import { OrderStatus } from "../generated/prisma/enums";

export const trackingController = {
    async findByStatus(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.query;
        const data = await trackingService.findByStatus(+id!, status as OrderStatus);
        return res.json({
            data,
            success: true,
            message: "Get tracking success"
        })
    }
}