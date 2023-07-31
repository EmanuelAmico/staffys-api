import express, {
  NextFunction,
  Request,
  Response,
  json,
  urlencoded,
} from "express";
import cors from "cors";
import morgan from "morgan";
import { envs } from "./config/env/env.config";
import connectToDB from "./config/db";
import { allRoutes } from "./routes";
import { APIError } from "./utils/error.utils";
import helmet from "helmet";
import fileUpload from "express-fileupload";
const {
  PORT,
  BACKOFFICE_CLIENT_HOST,
  DELIVERY_CLIENT_HOST,
  BACKOFFICE_CLIENT_HOST_LOCAL,
  DELIVERY_CLIENT_HOST_LOCAL,
} = envs;
const app = express();

const options: cors.CorsOptions = {
  origin: [
    BACKOFFICE_CLIENT_HOST,
    DELIVERY_CLIENT_HOST,
    BACKOFFICE_CLIENT_HOST_LOCAL,
    DELIVERY_CLIENT_HOST_LOCAL,
  ],
};

// Health check
app.get("/ping", (_req, res) => res.send("OK"));

app.use(morgan("dev"));
app.use(cors(options));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(helmet());
app.use(
  fileUpload({ useTempFiles: true, tempFileDir: "./assets/profile-picture" })
);
app.use("/", allRoutes);

app.use(
  (error: APIError, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error);
    res.status(error.status || 500).send({
      status: error.status || 500,
      message: error.message,
      data: null,
    });
  }
);

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "development"
) {
  (async () => {
    await connectToDB();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Listening on port ${PORT} 🚀`);
    });
  })();
}

export default app;
