const express = require("express");
const connection = require("./db");
const userRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swggerUi = require("swagger-ui-express");
require("dotenv").config();

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use("/users", userRouter);
app.use("/posts", postRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log(`connected to DB at port ${process.env.PORT}`);
  } catch (error) {
    console.log(error.message);
  }
});

const swaggerOption = {
  swaggerDefination: {
    openapi: "3.0.0",
    info: {
      title: "API DOCS",
      version: "2.0.0",
      description: "Documentation",
    },
    server: [
      {
        usl: "http://localhost:7000",
      },
    ],
  },
  apis: ["/routes/*.js"],
};

app.get("/", () => {
  resizeBy.send("Welcome to Home Page");
});
