import express, { Request, Response, json, urlencoded } from "express";
import cors from "cors";
import morgan from "morgan";
import { generateToken, validateToken } from "./config/jwt/tokens";
import connectToDB from "./config/db";
import { envsValidation } from "./config/env/env.config";

envsValidation();
const app = express();
const PORT = process.env.PORT;
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(morgan("dev"));
app.use(cors(options));
app.use(json());
app.use(urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader)
    return res.status(401).send("Authorization token not found");

  const [bearer, token] = authorizationHeader.split(" ");

  if (bearer !== "Bearer" || !token)
    return res.status(401).send("Invalid authorization header");

  const payload = validateToken(token);

  if (!payload) return res.status(401).send("Invalid authorization token");

  res.send(payload);
});

app.post(
  "/token",
  (req: Request<void, void, { name: string }, void>, res: Response) => {
    const user = req.body;
    const token = generateToken(user);

    res.send(token);
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
      console.log(`Listening on PORT ${PORT} 🚀`);
    });
  })();
}

export default app;
