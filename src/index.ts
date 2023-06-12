import express, {
  NextFunction,
  Request,
  Response,
  json,
  urlencoded,
} from "express";
import cors from "cors";
import morgan from "morgan";
import connectToDB from "./config/db";
import { allRoutes } from "./routes";

const PORT = process.env.PORT;

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

const app = express();

app.use(morgan("dev"));
app.use(cors(options));
app.use(json());
app.use(urlencoded({ extended: false }));

app.use("/", allRoutes);

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).send(error.message);
});

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "development"
) {
  (async () => {
    await connectToDB();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Listening on PORT ${PORT} 🚀`);
    });
  })();
}

export default app;
