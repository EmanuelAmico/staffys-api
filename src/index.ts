import express, { Request, Response, json, urlencoded } from "express";
import cors from "cors";
import morgan from "morgan";
import { generateToken, validateToken } from "./config/jwt/tokens";

const port = process.env.PORT;
const app = express();
app.use(morgan("dev"));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(json());
app.use(urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader)
    return res.status(401).send("Unauthorized. Missing token.");

  const [bearer, token] = authorizationHeader.split(" ");
  if (bearer !== "Bearer" || !token)
    return res.status(401).send("Invalid authorization token.");

  const payload = validateToken(token);
  if (!payload)
    return res.status(401).send("Authorization token payload is invalid.");

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

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port} 🚀`);
});
