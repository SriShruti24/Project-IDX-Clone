import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent";
import { EditorButton } from "../components/atoms/EditorButton/EditorButton";
import { TreeStructure } from "../components/organisms/TreeStructure";
import { useTreeStructureStore } from "../store/treeStructureStore";
import { useEditorSocketStore } from "../store/editorSocketStore";
import io from "socket.io-client";
import BrowserTerminal from "../components/molecules/BrowserTerminal/BrowserTerminal";
import { useTerminalSocketStore } from "../store/terminalSocketStore";

export const ProjectPlayground = () => {
  const { projectId: projectIdFromUrl } = useParams();
  const [files, setFiles] = useState([
    { id: 1, name: "file1.js", active: false },
    { id: 2, name: "file2.js", active: true },
  ]);

  const handleClose = (id) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const { setProjectId, projectId } = useTreeStructureStore();
  const { setEditorSocket,editorsocket} = useEditorSocketStore();
  const { setTerminalSocket } = useTerminalSocketStore();
  function fetchPort(){
    editorsocket.emit("getport");
    console.log("fetching port");
  }

  useEffect(() => {
    if (projectIdFromUrl) {
      setProjectId(projectIdFromUrl);
      console.log("projectId set in playground:", projectIdFromUrl);

      // Editor Socket
      const editorSocketConn = io(
        `${import.meta.env.VITE_BACKEND_URL}/editor`,
        {
          query: { projectId: projectIdFromUrl },
        }
      );
      setEditorSocket(editorSocketConn);

      // Terminal WebSocket
      const ws = new WebSocket(
        `ws://localhost:5000/terminal?projectId=${projectIdFromUrl}`
      );
      setTerminalSocket(ws);
    }
  }, [projectIdFromUrl, setProjectId, setEditorSocket, setTerminalSocket]);

  return (
    <div style={{ height: "100vh", display: "flex", overflow: "hidden" }}>
      {/* LEFT SIDEBAR */}
      {projectId && (
        <div
          style={{
            width: "250px",
            height: "73.7vh",
            backgroundColor: "#333254",
            padding: "8px",
            overflowY: "auto",
          }}
        >
          <TreeStructure />
        </div>
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          minHeight: 0,
        }}
      >
        {/* FILE TABS */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            padding: "6px",
            background: "white",
          }}
        >
          {files.map((file) => (
            <EditorButton
              key={file.id}
              label={file.name}
              isActive={file.active}
              onClose={() => handleClose(file.id)}
            />
          ))}
          <div>
            <button
            onClick={fetchPort}
            >
              getport
            </button>
          </div>
        </div>

        {/* MAIN EDITOR */}
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <EditorComponent />
        </div>

        {/* TERMINAL */}
        <div
          style={{
            height: "25vh",
            minHeight: "140px",
            borderTop: "1px solid #444",
          }}
        >
          <BrowserTerminal />
        </div>
      </div>
    </div>
  );
};
