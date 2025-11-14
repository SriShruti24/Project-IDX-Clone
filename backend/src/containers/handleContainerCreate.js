import Docker from "dockerode";

const docker = new Docker();

export const handleContainerCreate = async (projectId, terminalSocket,req,tcpSocket,head) => {
  console.log("project id received for container create:", projectId);

  try {
    const container = await docker.createContainer({
      Image: "sandbox",
      Tty: true,
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Cmd: ["/bin/bash"],
      User: "sandbox",
      Volumes:{
        "/home/sandbox/app":{}
      },
      ExposedPorts: {
          "5173/tcp": {},
        },
        Env: ["HOST=0.0.0.0"],
      HostConfig: {
        Binds: [`${process.cwd()}/projects/${projectId}:/home/sandbox/app`],
        PortBindings: {
          "5173/tcp": [{ HostPort: "0" }],//random port will be assigned by docker
        },
      },
    });

    console.log("Container created:", container.id);

    await container.start();
    
    
    terminalSocket.handleUpgrade(req,tcpSocket,head,(establishedWSConn)=>{
      terminalSocket.emit("connection",establishedWSConn,req,container);
    })
    //establishedWSConn -->callback function we get afte establish websocket connection
    
  } catch (error) {
    console.log("Error while creating container:", error.message || error);
  }
};