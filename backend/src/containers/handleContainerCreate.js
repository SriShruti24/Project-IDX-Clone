import Docker from "dockerode";

const docker = new Docker();

export const handleContainerCreate = async (projectId, socket) => {
  console.log("project id received for container create", projectId);
 try {
     const container = await docker.createContainer({
    Image: "sandbox", //name given by us for the written dockerfile
    AttachStdin: true,
    AttachStdout: true,
    Cmd: ["/bin/bash"],
    Tty: true,
    User: "sandbox",
    HostConfig: {
      Binds: [//mounting the project directory to the container
        `./projects/${projectId}:/home/sandbox/app`],
      PortBindings: {
        "5173/tcp": [
          {
            HostPort: "0", //random port will be assigned by docker
          },
        ],
      },
      ExposedPorts: {
        "5173/tcp": {},
      },
      Env: ["Host=0.0.0.0"]
    }
  });
  console.log("Container created",container.id);
  await container.start();
  console.log("container started");
 } catch (error) {
    console.log("Error while creating container",error);
 }

};
