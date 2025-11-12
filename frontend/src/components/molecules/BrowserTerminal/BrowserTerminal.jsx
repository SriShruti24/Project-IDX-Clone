import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {AttachAddon} from '@xterm/addon-attach';

const BrowserTerminal = () => {
  const terminalRef = useRef(null);
  const socket = useRef(null);
  const { projectId: projectIdFromUrl } = useParams();

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 16,
      fontFamily:"Fira Code",
      convertEol: true,
      theme: {
        background: "#333254",
        foreground: "#ffffff",
      },
    });
 
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();
    term.focus();

    // socket.current = io(`${import.meta.env.VITE_BACKEND_URL}/terminal`, {
    //   query: { projectId: projectIdFromUrl },
    // });
    socket.current=new WebSocket("ws://localhost:5000/terminal?projectId="+projectIdFromUrl);
    socket.current.onopen=()=>{
      const attachAddon =new AttachAddon(socket.current);
      term.loadAddon(attachAddon);
    }
    
    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      term.dispose();
      // socket.current.disconnect();
    };
  }, [projectIdFromUrl]); 

  return (
    <div
      ref={terminalRef}
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    />
  );
};

export default BrowserTerminal;
