import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { PORT } from "./config/serverConfig.js";
import apiRouter from "./routes/index.js";
import chokidar from "chokidar";
import { handleEditorSocket } from "./socketHandlers/editorHandler.js";
import { handleContainerCreate } from "../src/containers/handleContainerCreate.js";
import {WebSocketServer} from 'ws';
import { handleTerminalCreation } from "../src/containers/handleTerminalCreation.js";


/*important */
const app = express();
const server = createServer(app); //create http module server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
}); //work websocket connection + http connection
//work on same code + same server

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send("âœ… Server is running properly!");
});

const editorNamespace = io.of("/editor");
editorNamespace.on("connection", (socket) => {
  console.log("editor is connected");
  //somehow we will get projectId from frontend
  console.log(socket.handshake.query['projectId']);
  let projectId = socket.handshake.query['projectId'];
  console.log("projectId received after connection", projectId);
  if (projectId) {
    var watcher = chokidar.watch(`./projects/${projectId}`, {
      ignored: (path) => path.includes("node_modules"), //ignoring node_modules folder
      persistwnt: true /** keeps the watcher in running state till the time app is runing */,
      awaitWriteFinish: {
        stabilityThreshold: 2000 /**wait for 2 sec after writing the file +
      ensure stability of files before triggering event */,
      },
      ignoreInitial: true /**ignore the initial add events when watcher is started */,
    });

    watcher.on("all", (event, path) => {
      console.log(event, path);
    });
  }
  socket.on("getport",()=>{
    console.log("gotPort event received");
  })
  handleEditorSocket(socket,editorNamespace);

});

server.listen(PORT, () => {
  console.log(`dev Server is running on port ${PORT}`);
  console.log(process.cwd())
}); //not app.listen bcz we r using http module server so we have to use server.listen

const webSocketForTerminal = new WebSocketServer({
  noServer:true //we will handle the upgrade event
});
server.on("upgrade", (req,tcpSocket,head) => {
  const isTerminal = req.url.includes("/terminal");

  if (isTerminal) {
    console.log("req url received:", req.url);
    const projectId= req.url.split("=")[1];
    console.log("project id received after coonection",projectId);

    handleContainerCreate(projectId,webSocketForTerminal,req,tcpSocket,head);
  }
});

webSocketForTerminal.on("connection",(ws,req,container)=>{
  console.log("Terminal connected",ws,req,container);
  handleTerminalCreation(container,ws);
  ws.on("close",()=>{
    container.remove({force:true},(err,data)=>{
      if(err){
        console.log("Error while removing container",err);
      }
      console.log("Container removed",data);
    });//sanity check  to close the container when wensocket is close to avoid unnesscary container
  })
})
