import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useRef } from "react";
import { AttachAddon } from "@xterm/addon-attach";
import { useTerminalSocketStore } from "../../../store/terminalSocketStore";

const BrowserTerminal = () => {
  const terminalRef = useRef(null);
  const { terminalSocket } = useTerminalSocketStore();

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 16,
      fontFamily: "Fira Code",
      letterSpacing: -2.5,
      lineHeight: 1.0,
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

    if (terminalSocket) {
      terminalSocket.onopen = () => {
        const attachAddon = new AttachAddon(terminalSocket);
        term.loadAddon(attachAddon);
      };
    }

    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      term.dispose();
    };
  }, [terminalSocket]);

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
