import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import engine from 'ejs-mate';
import PostRoutes from './routes/posts.routes.js';

dotenv.config();

const app = express();
app.engine('ejs', engine);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use("/", PostRoutes);

const connectionString = process.env.DB_URL;
mongoose.set('useCreateIndex', true);
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;
conn.once("open", function () {
  console.log("MongoDB connected.");
  const isProduction = process.env.APP_STATUS === 'production';
  const port = isProduction ? 7500 : 3000;
  app.listen(port, function () {
    console.log(`listening on ${port}`);
  });
});
