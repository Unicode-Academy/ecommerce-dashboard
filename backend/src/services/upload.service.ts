import { HttpException } from "../exceptions/HttpException";
import { parse } from "file-type-mime";
import fs from "fs";
import { readdir } from "fs/promises";
import path from "path";
export const uploadService = {
    async uploadFile(file: Express.Multer.File | undefined) {
        if (!file) {
            throw new HttpException("File not found", 400);
        }
        const arrayBuffer = new ArrayBuffer(file.buffer.byteLength);
        new Uint8Array(arrayBuffer).set(file.buffer);
        const fileInfo = parse(arrayBuffer);

        if (!fileInfo) {
            throw new HttpException("Unable to determine the actual file type", 400)
        }

        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpeg'];

        if (!allowedMimeTypes.includes(fileInfo.mime)) {
            throw new HttpException(`Invalid file format: ${fileInfo.mime}`, 400)
        }

        const uploadDir = process.cwd() + '/uploads/images';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const filename = crypto.randomUUID() + '.' + fileInfo.ext;

        const fullPath = path.join(uploadDir, filename);

        fs.writeFileSync(fullPath, file.buffer);

        return filename;
    },

    async getFiles() {
        const uploadDir = process.cwd() + '/uploads/images';
        const entries = await readdir(uploadDir, { withFileTypes: true });
        const files = [];
        files.push({
            name: "images",
            isDirectory: true,
            path: "/images",

        })
        for (const entry of entries) {
            if (entry.isDirectory()) {
                files.push({
                    name: entry.name,
                    isDirectory: true,
                    path: "/images/" + entry.name,
                });
            } else if (entry.isFile()) {
                files.push({
                    name: entry.name,
                    isDirectory: false,
                    path: "/images/" + entry.name,
                });
            }
        }
        return files;
    },

    async deleteFile(filename: string) {
        const uploadDir = process.cwd() + '/uploads/images';
        fs.unlinkSync(`${uploadDir}/${filename}`);
    },

    async renameFile(oldFilename: string, newFilename: string) {
        const uploadDir = process.cwd() + '/uploads/images';
        fs.renameSync(`${uploadDir}/${oldFilename}`, `${uploadDir}/${newFilename}`);
    },


}