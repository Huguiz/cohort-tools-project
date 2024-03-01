const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
// const { errorHandler, notFoundHandler } = require('./middleware/error-handling');
const dotenv = require("dotenv");
const path = require('path');

const envPath = path.join(__dirname, './.env');
dotenv.config({ path: envPath });

// STATIC DATA
const PORT = process.env.PORT;

// INITIALIZE EXPRESS APP
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose
  .connect("mongodb://localhost:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// MAIN ROUTES

const cohortRouter = require('./routes/cohort.routes');
app.use('/api/cohorts', cohortRouter);

const studentRouter = require('./routes/student.routes');
app.use('/api/students', studentRouter);

const userRouter = require('./routes/user.routes');
app.use('/api/users', userRouter);

const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);

// DOCS ROUTES

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
