require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { createServer } = require("http");

const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const initializeSocket = require("./socket");

const { port, mongoUri, nodeEnv } = require("./config");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(helmet({ crossOriginResourcePolicy: false }));

app.use("/uploads", express.static("uploads"));

app.use("/api", routes);

app.use((req, res) => res.status(404).json({ message: "Not Found" }));
app.use(errorHandler);

const startServer = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected");

    const httpServer = createServer(app);

    initializeSocket(httpServer);

    httpServer.listen(port, () => {
      console.log(`🚀 Server running on ${port} (${nodeEnv})`);
    });
  } catch (err) {
    console.error(err);
  }
};

startServer();
