import express, {
  NextFunction,
  Request,
  Response,
  json,
  urlencoded,
} from "express";
import cors from "cors";
import morgan from "morgan";
import envsValidation, { envs } from "./config/env/env.config";
import connectToDB from "./config/db";
import { allRoutes } from "./routes";

envsValidation();
const { PORT, BACKOFFICE_CLIENT_HOST, DELIVERY_CLIENT_HOST } = envs;
const app = express();

const options: cors.CorsOptions = {
  origin: [BACKOFFICE_CLIENT_HOST, DELIVERY_CLIENT_HOST],
};
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
      console.log(`Listening on port ${PORT} 🚀`);
    });
  })();
}

export default app;
