require('dotenv').config();
require('express-async-errors');
const express = require('express');

const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');

const connectDB = require("./db/connect") 
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const authenticateUser = require("./middleware/authentication");

const app = express();
app.use(helmet());
app.use(xss());
app.use(cors());
app.set('trust proxy', 1); // trust first proxy
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages

// routes
app.use("/api/v1/auth", authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();