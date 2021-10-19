import express from "express";
import http from "http";
import { Server } from "socket.io";
import { router } from "./routes";
import cors from "cors";

const app = express();

// Com cors podemos acessar nossa api de ips diferentes
app.use(cors());

const serverHttp = http.createServer(app);
const io = new Server(serverHttp, {
  cors: {
    origin: "*",
  },
});

// Escutando o evento de conexão de usuários
io.on("connection", (socket) => {
  console.log(`Usuário conectado no socket: ${socket.id}`);
});

app.use(express.json());
app.use(router);

app.get("/github", (request, response) => {
  response.redirect(
    `http://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
});

app.get("/signin/callback", (request, response) => {
  const { code } = request.query;
  response.send(code);
});

export { serverHttp, io };
