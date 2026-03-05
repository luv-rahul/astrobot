const express = require("express");
const app = express();
require("dotenv").config();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

const port = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  }),
);

/*Routes*/
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/ai", chatRoutes);

/*HealthRoute*/
app.use("/health", (req, res) => {
  res.status(200).json({ message: "Hello, Server!" });
});

const startServer = async () => {
  try {
    // Database Connection
    await connectDB();

    // Running Server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}...`);
    });
  } catch (error) {
    console.error("Server Connection Failed:", error);
  }
};

startServer();
