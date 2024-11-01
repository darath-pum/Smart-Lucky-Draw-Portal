import dotenv from "dotenv";
import express from "express";
import { setupTable } from "./controllers/db_connect";
import authRoute from "./routes/auth";
import userRoute from "./routes/user_route";
import campaignRoute from "./routes/campaign_route";
import prizeRoute from "./routes/prize_route";
import cookieParser from "cookie-parser";
import cors from "cors";
import reportRoute from "./routes/report_route";
import gameRouter from "./routes/game_routes";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10MB" }));
app.use(cookieParser());
const configs = {
  origin: (origin, callback) => {
    if (process.env.NODE_ENV === "development") {
      return callback(null, true);
    }
    return callback(null, origin === process.env.FRONTEND_URL);
  },
  credentials: true,
};
app.use(cors(configs));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "5MB" }));
app.use(express.static("public"));
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/campaign", campaignRoute);
app.use("/prize", prizeRoute);
app.use("/report", reportRoute);
app.use("/game", gameRouter);
//set up server
async function startServer() {
  await setupTable();
  const port = process.env.PORT || 4545;
  app.listen(port, () => {
    console.log("Server is running on port", port);
  });
}

startServer();
