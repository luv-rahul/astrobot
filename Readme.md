# AstroBot Backend

## Requirements

**Initiliaze Project**

- npm init

**Install Dependencies**

- npm i express mongoose validator cors cookie-parser jsonwebtoken dotenv

package.json

```json
{
  "name": "astrobot-backend",
  "version": "1.0.0",
  "description": "This is the backend application of AI Astrobot",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  },
  "keywords": ["javascript", "nodejs", "expressjs", "mongodb"],
  "author": "Rahul",
  "license": "ISC",
  "dependencies": {
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.2.4",
    "nodemon": "^3.1.14",
    "validator": "^13.15.26"
  }
}
```

**Creating Server**

app.js

```js
const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT;

app.use("/health", (req, res) => {
  res.status(200).json({ message: "Hello, Server!." });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
```

**File Structure**
📦AstroBot
┃ ┣ 📂src
┃ ┃ ┣ 📂config
┃ ┃ ┃ ┗ database.js
┃ ┃ ┣ 📂controller
┃ ┃ ┃ ┗ 📜userController.js
┃ ┃ ┣ 📂models
┃ ┃ ┃ ┗ 📜user.js
┃ ┃ ┣ 📂routes
┃ ┃ ┃ ┗ 📜userRoutes.js
┃ ┃ ┣ 📂services
┃ ┃ ┃ ┗ 📜userService.js
┃ ┃ ┣ 📂utils
┃ ┃ ┃ ┗ 📜validation.js
┃ ┃ ┗ 📜app.js
┃ ┣ 📜.env
┃ ┣ 📜.gitignore
┃ ┣ 📜package-lock.json
┃ ┣ 📜package.json
┃ ┗ 📜Readme.md

**Database Integration**

database.js

```js
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

module.exports = { connectDB };
```

app.js

```js
const express = require("express");
const app = express();
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connectDB } = require("./config/database");

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
app.use("/user", userRoutes);

/*HealthRoute*/
app.use("/health", (req, res) => {
  res.status(200).json({ message: "Hello, Server!." });
});

const startServer = async () => {
  try {
    // Database Connection
    await connectDB();
    console.log("Database Connected");

    // Running Server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}...`);
    });
  } catch (error) {
    console.error("Database Connection Failed:", err);
  }
};

startServer();
```