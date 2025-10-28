import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { PORT } from "./config/serverConfig.js";
import apiRouter from "./routes/index.js";
import chokidar from "chokidar";
import { handleEditorSocket } from "./socketHandlers/editorHandler.js";


/*important */
const app = express();
const server = createServer(app); //create http module server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

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
  // get projectId from frontend's connection query
  console.log(socket.handshake.query["projectId"]);
  let projectId = socket.handshake.query["projectId"];
  console.log("projectId received after connection", projectId);

  // If a projectId was provided, join a room named by that projectId
  if (projectId) {
    socket.join(projectId);

    var watcher = chokidar.watch(`./projects/${projectId}`, {
      ignored: (path) => path.includes("node_modules"), // ignore node_modules folder
      persistwnt: true /** keeps the watcher in running state till the time app is runing */,
      awaitWriteFinish: {
        stabilityThreshold: 2000 /** wait for 2 sec after writing the file + ensure stability of files before triggering event */,
      },
      ignoreInitial: true /** ignore the initial add events when watcher is started */,
    });

    // Emit watcher events to the specific project room only
    watcher.on("all", (event, path) => {
      console.log("file watcher event", event, path);
      editorNamespace.to(projectId).emit("fileChanged", { event, path });
    });

    // Clean up watcher when the socket disconnects
    socket.on("disconnect", () => {
      try {
        if (watcher) watcher.close();
      } catch (err) {
        console.error("Error closing watcher", err);
      }
      console.log("socket disconnected, watcher closed for project", projectId);
    });
  }

  // pass projectId into the handler so emitted events can be room-scoped
  handleEditorSocket(socket, editorNamespace, projectId);

});

server.listen(PORT, () => {
  console.log(`dev Server is running on port ${PORT}`);
}); //not app.listen bcz we r using http module server so we have to use server.listen
