import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { connectDatabase } from "./config/database.js";
import { startUserRegistrationConsumer } from "./kafka/userRegistration.consumer.js";

const app = express();

app.use(express.json());

app.get("/health",(req, res) => {
    res.status(200).json({
      success: true,
      service: "auth-service",
      status: "UP"
    });
  }
);

app.use("/auth",authRoutes);

app.use((req, res) => {
    res.status(404).json({success: false,message: "Route not found"
    });
  }
);

app.use(errorHandler);

const PORT = Number(process.env.PORT || 3002);

async function startApplication() {
  try {
    await connectDatabase();
    await startUserRegistrationConsumer();
    app.listen(PORT,() => {
        console.log(`Auth service running on port ${PORT}`);
      }
    );

  } catch (error) {
    console.error("Application startup failed:",error);
    process.exit(1);
  }
}

startApplication();

export default app;