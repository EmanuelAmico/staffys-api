import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { generateToken, validateToken } from "./config/jwt/tokens";
// import { validateAuth } from "./middlewares/auth";

const port = 3001;
const app = express();
app.use(morgan("dev"));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader)
    return res.status(401).send("No se encuentra el token de autorización");

  const [bearer, token] = authorizationHeader.split(" ");
  if (bearer !== "Bearer" || !token)
    return res.status(401).send("Token de autorización inválido");

  const payload = validateToken(token);
  if (!payload) return res.status(401).send("Token de autorización no válido");

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
  console.log(`Listening on port ${port} 🚀`);
});
