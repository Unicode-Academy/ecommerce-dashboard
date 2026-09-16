import { Request, Response } from "express";
import { uploadService } from "../services/upload.service";
export const uploadController = {
    async upload(req: Request, res: Response) {
        const data = await uploadService.uploadFile(req.file);
        return res.json({
            success: true,
            message: "Upload success",
            url: "/uploads" + data
        })
    },

    async getFiles(req: Request, res: Response) {
        const data = await uploadService.getFiles();
        return res.json({
            data,
            success: true,
            message: "Get file success"
        })
    },

    async deleteFile(req: Request, res: Response) {
        const { filename } = req.body;
        await uploadService.deleteFile(filename);
        return res.json({
            success: true,
            message: "Delete file success"
        })
    },

    async renameFile(req: Request, res: Response) {
        const { oldFilename, newFilename } = req.body;
        await uploadService.renameFile(oldFilename, newFilename);
        return res.json({})
    }
}