import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import route from "./routes";
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

const PORT = parseInt(process.env.PORT || '3000');
const MONGODB_URL = process.env.MONGO_DB_CONNECTION_URL;

app.get('/', (req: any, res: any) => {
    console.log('welcome to express app');
});

app.use("/api", route);

mongoose
  .connect(MONGODB_URL || '')
  .then((con) => console.log("db is connected.", con.connection.host))
  .then(() =>
    app.listen(PORT, () => console.log(`Server is running on the port ${PORT}`))
  )
  .catch((err) => console.log(err.message));