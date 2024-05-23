import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import swagger from "./swagger.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adRoutes from "./routes/adRoutes.js";
import propertyRequestRoutes from "./routes/propertyRequestRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/property-requests", propertyRequestRoutes);

swagger(app);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app };
