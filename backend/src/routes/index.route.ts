import express from "express";
import { categoryController } from "../controllers/category.controller";
import { validate } from "../middlewares/validate.middleware";
import { crateCategorySchema } from "../validators/category.validator";
import { createProductSchema, updateProductSchema } from "../validators/product.validator";
import { productController } from "../controllers/product.controller";
import { uploadController } from "../controllers/upload.controller";
import { upload } from "../utils/multer";
import { orderController } from "../controllers/order.controller";
import { createOrderSchema } from "../validators/order.validator";
import { paymentController } from "../controllers/payment.controller";
import { createPaymentMethod, updatePaymentMethod } from "../validators/payment.validator";
const router = express.Router();
router.get("/categories", categoryController.findAll);
router.get("/categories/:id", categoryController.find);
router.post(
  "/categories",
  validate(crateCategorySchema),
  categoryController.create,
);
router.put(
  "/categories/:id",
  validate(crateCategorySchema),
  categoryController.update,
);
router.delete("/categories/:id", categoryController.delete);

router.get("/products", productController.findAll);
router.get('/products/:id', productController.find);
router.post(
  "/products",
  validate(createProductSchema),
  productController.create,
);

router.patch('/products/:id', validate(updateProductSchema), productController.update)
router.delete('/products/:id', productController.delete);

router.get('/uploads', uploadController.getFiles);
router.post('/uploads', upload.single('file'), uploadController.upload);
router.delete('/uploads', uploadController.deleteFile)
router.patch('/uploads', uploadController.renameFile);

router.get('/orders', orderController.findAll);
router.post('/orders', validate(createOrderSchema), orderController.create);
router.get('/orders/status', orderController.findStatusList);
router.get('/orders/payment-status', orderController.findPaymentStatusList);
router.patch('/orders/:id/status', orderController.updateStatus);
router.get('/orders/:id', orderController.find);
router.patch('/orders/:id/payment-status', orderController.updatePaymentStatus);
router.patch('/orders/:id/note', orderController.updateNote);

router.get('/payments/method', paymentController.getListMethod);
router.post('/payments/method', validate(createPaymentMethod), paymentController.createMethod);
router.patch('/payments/method/:id', validate(updatePaymentMethod), paymentController.updateMethod);
router.delete('/payments/method/:id', paymentController.deleteMethod);


export default router;
