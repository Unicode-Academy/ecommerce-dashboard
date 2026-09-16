import express from "express";
import cors from "cors";
import indexRoute from "./routes/index.route";
import { errorHandlingMiddleware } from "./middlewares/errorHandling.middleware";
import path from "node:path";
const app = express();
const PORT = 3000;
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));
app.use(express.json());
app.use("/api", indexRoute);

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(`Server running port: ${PORT}`);
});
