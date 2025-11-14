export const handleTerminalCreation = (container, ws) => {
  container.exec(
    {
      Cmd: ["/bin/bash"],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      User: "sandbox",
    },
    (err, exec) => {
      if (err) {
        console.log("Error while creating exec", err);
        return;
      }
      exec.start(
        {
          hijack: true,
           stdin: true ,
        },
        (err, stream) => {
          if (err) {
            console.log("Error while starting exec", err);
            return;
          }
          //Step1:Stream processing
          processStreamOutput(stream, ws);
          //Step2:Stream writing
          ws.on("message", (data) => {
            if(data==="getport"){
              container.inspect((err,data)=>{
                const port = data.NetworkSettings;
                console.log(port);
              })
              return;
            }
            stream.write(data.toString());
          });
        }
      );
    }
  );
};
function processStreamOutput(stream, ws) {
  let nextDataType = null; //Stores the type of the next message
  let nextDataLength = null; //Stores the length of the next message
  let buffer = Buffer.from("");

  function processStreamData(data) {
    // this is a helper function to process incoming data chunks
    if (data) {
      buffer = Buffer.concat([buffer, data]); //Concatenating the incoming data to the buffer
    }
    if (!nextDataType) {
      //if the next data type is not know,then we need
      //  to read the next 8 bytes to determine the type and length of the message
      if (buffer.length >= 8) {
        const header = bufferSlicer(8);
        nextDataType = header.readUInt32BE(0); // the first 4 bytes represent
        // the type of the message
        nextDataLength = header.readUInt32BE(4); // yhe next 4 bytes represent the length of the message
        processStreamData(); //Recursively call the function to process the message
      }
    } else {
      if (buffer.length >= nextDataLength) {
        const content = bufferSlicer(nextDataLength); //Slice the buffer to get the message content
        ws.send(content); //Send the message to the client
        nextDataType = null; //Reset the type and length of the next message
        nextDataLength = null;
        processStreamData();
      }
    }
  }
  function bufferSlicer(end) {
    // this function slices the buffer and returns the sliced buffer and the remaining buffer
    const output = buffer.slice(0, end);
    buffer = Buffer.from(buffer.slice(end, buffer.length)); //remaining part of the chunk
    return output;
  }
  stream.on("data", processStreamData);
}
