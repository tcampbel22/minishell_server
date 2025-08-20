import fastify from "fastify";
import cors from "@fastify/cors";
import  { WebSocketServer } from "ws";
import pty from "node-pty";

const isProd = process.env.NODE_ENV === 'prod'

const app = fastify({
	logger: true,
});

const wss = new WebSocketServer({ noServer: true });
// const BLACKLIST = ["rm", "sudo", "mount", "kill", "exit"]

app.register(cors, {
	origin: ["http://localhost:5173", "https://tcampbel22.github.io"],
	methods: ["GET", "POST"],
  });

app.server.on("upgrade", (req, socket, head) => {
	wss.handleUpgrade(req, socket, head, (ws) => {
	  wss.emit("connection", ws, req);
	});
  });

wss.on("connection", (ws) => {
	const shell = pty.spawn(`${process.cwd()}/minishell`, [], {
		name: "xterm-color",
		cols: 80,
		rows: 24,
		cwd: process.env.HOME,
		env: process.env
	});
	// Send shell output to client
	shell.onData((data) => ws.send(data));

	// Send client input to shell
	ws.on("message", (msg) => {
		shell.write(msg);
  });
  
})
  
  // Start the server
  const start = async () => {
	try {
	  await app.listen({ port: 3000, host: '::' });
	  app.log.info(`minishell service listening on 3000`)
	} catch (err) {
	  app.log.error(err);
	  process.exit(1);
	}
  };
  start();
  
