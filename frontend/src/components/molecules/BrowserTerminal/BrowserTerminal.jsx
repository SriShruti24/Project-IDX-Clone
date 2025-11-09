import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const BrowserTerminal = () => {
  const terminalRef = useRef(null);
  const socket = useRef(null);
  const { projectId: projectIdFromUrl } = useParams();

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 16,
      fontFamily: "Ubuntu mono",
      convertEol: true,
      theme: {
        background: "#333254",
        foreground: "#ffffff",
      },
    });
    term.open(terminalRef.current);
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddon.fit();
    term.focus();

    socket.current = io(`${import.meta.env.VITE_BACKEND_URL}/terminal`, {
      query: { projectId: projectIdFromUrl },
    });

    socket.current.on("shell-output", (data) => {
      term.write(data);
    });

    term.onData((data) => {
      socket.current.emit("shell-input", data);
    });

    return () => {
      term.dispose();
      socket.current.disconnect();
    };
  }, [projectIdFromUrl]);

  return (
    <div
      ref={terminalRef}
      tabIndex={0}
      style={{
        height: "25vh",
        overflow: "auto",
      }}
      className="terminal"
    />
  );
};

export default BrowserTerminal;
