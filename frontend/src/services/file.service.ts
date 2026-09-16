import { instance } from "@/lib/axios"

export const getFiles = async () => {
    const response = await instance.get('/uploads');
    return response.data.data;
}

export const deleteFile = async (filename: string) => {
    await instance.delete('/uploads', {
        data: { filename }
    });
}

export const renameFile = async (oldFilename: string, newFilename: string) => {
    await instance.patch('/uploads', {
        oldFilename,
        newFilename
    });
}