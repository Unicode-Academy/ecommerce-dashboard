import multer from "multer";
const storage = multer.memoryStorage();
export const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 2
    }
});

// export const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, `${process.cwd()}/uploads`);
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         const filename = crypto.randomUUID() + ext;
//         cb(null, filename);
//     }
// });