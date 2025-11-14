______________BACKEND____________________________
npm i -D nodemon
npm i cookie-parser
npm install dotenv
npm i express
npm i cors
npm i @tanstack/react-query
_______________________________________________
Exec function(take a comman dand execute for u)
exec → runs a command in a shell and buffers output.

spawn → streams real-time output, useful for long logs.

fork → runs another Node.js script with message passing.
__________________________
What is child_process? → Node’s way to run system commands/programs.

Why did you need it? → To programmatically run vite@latest and other CLI tools.

What role did it play? → It acted like the bridge between Node.js and the system terminal.
_________________________________
*UUID{Universally Unique Identifier}128-bit number  (Uniquely identifies objects in Computer System)
npm i uuid4
______________
as exec is CALLBACK function but for better approach we using "promis" method 
we are using
const execPromisified=util.promisify(child_process.exec);
this promisified function comes from util module(internal node.js module)
__________________________________________________
path--> nested folder and  file structure---> genterate in tree form
{recursive function/DFS}
function getPaths(node, path = "", result = []) {
  const currentPath = path ? `${path}/${node.name}` : node.name;

  if (!node.children || node.children.length === 0) {
    result.push(currentPath); // file
  } else {
    for (let child of node.children) {
      getPaths(child, currentPath, result);
    }
  }
  return result;
}

console.log(getPaths(fileSystem));
{Prefix tree/Array tree}
------------------------------------
this is code but we have module for this 
npm i directory-tree
import directoryTree from 'directory-tree';
import path from "path";
 --------------------------
 npm install socket.io
we already make app server---->while use app object we created http module server

{i want in my backned http server also work and websocket server also work }
const app = express();
const server=createServer(app);
const io=new Server(server); 
creating combine server 
--------------------------------
event driven Mechanism
react io connection 
"Namespaces" to seperate editor and terminal eventhandlers
"chokidar" watch the changes in file
better than fs.watch
----------------------------------------
Component       	Purpose
Express	               Manages HTTP routes and middleware
HTTP Server	           Enables integration with Socket.io
Socket.io	             Handles real-time bidirectional communication
/editor Namespace 	   Dedicated space for live code editing and collaboration
Chokidar   	           Watches project directories for file changes
handleEditorSocket	   Encapsulates editor-specific socket logic
CORS                   Enabled Allows connections from any frontend origin
-----------------------------------------
npm i querystring
socket io query params with react
------------------------------
docker-->OS level virtualization in form of container(light weight)(less amount of resource consume)(easily shutdown,open)
image-->readymade template{blueprint}
cane also pull nd push from docker hub
-----------------------
-fsSL command
---------------
handleContainer
---------
steps to turn up docker container after creating project
1. Setup the docker image:-docker build -t sandbox .
. for linux
{create image}
-------------------------------
What your current code is doing
::::::::::::::::::::::::::::::::

Your code (with socket.io):

Connects frontend terminal to backend over WebSocket-like events (shell-input, shell-output)

Docker container running a bash shell is connected through a stream

When you press a key → frontend sends it → backend writes to /bin/bash input

When container outputs text → backend sends text → frontend terminal prints it

So:

Your Keyboard → WebSocket → Docker exec stdin
Docker output → WebSocket → xterm.js display


This is exactly like how VS Code online works.

4. Why your sir wants to remove socket.io and use ws

Typical reason teachers / senior devs want this:

✅ ws is lighter

Faster, simpler, fewer moving parts.

✅ ws is closer to the real WebSocket protocol

Good for learning.

✅ Less magic, more control

You will understand streams, buffers, and terminals better.

✅ Servers like Kubernetes, cloud IDEs, SSH relays use raw WS

This is what real devops tools use.

✅ socket.io is not needed for your terminal

Terminals only need 2 things:

send keys

receive output
--------------------------------------------
npm i ws
{we are using raw websocket}
then setting up of handleTerminalCreation
--------------------------------------
flow of websocket
************************
1.we setup browserterminal from where we take "projectIdFromURL"

2.terminal will make exterm object--->attach  2-3 addon
First addon---> fit addon parent div pr  xterm ko  properly alogin kr deta h
Second addon----> aatachAddon xterm in browser-->attach with terminal--->with help of raw websocket connection
third addon --->loadAddon --->load to terminal

3.if we write on terminal or in backend in containe rof docker attach with terminal something  generated on that
means help to build on terminal

4.socket.io hide many thing for us but raw websocket doesent hide things so we can  use.

5.socket.current=new WebSocket("ws://localhost:5000/terminal?projectId="+projectIdFromUrl); when socket is initalize on this upgradtion will come in in {index.js}
first set up http connection --->upgrade to--->websocket connection banaya jata h.

6.now for use everything is seeing on {server object}  we  will put on it server.on("upgrade,(req,tcpSocket,head))=>{}
if someone try to upgrade server means he/she trying to set websocket.

7.now in that u will get http request object
now we will get "req URL".
we will check are we getting '/terminal'
[Means someone want to set up terminal websocket].

8.req.url -->print//take out projectID//pass for creating container.

9.for  creating we need project id /webSOcketforterminal,req,tcpSocket nd head.
webSOcketforterminal --->object build in backend to connect with websocket container "websocketserver"-->coming from ws package.
10.now send all these from project id to head to 
{handleContainerCreate}.

10.now it will create the container.
--------------------------------------------
we need websocket connection for terminal--->terminal of ur container-->to connect with container terminal we should etablish container
----------->reason we are creating container
----------------------------------------------
if client say--> make my http connection websocket---->
reply===>
first create container -->to that container we will attach websocket--------------------
-----------------------------------------
now we create the container by the configuration
start the container--> means in backend containter is up in backend now we can establish websocket in terminal---->time to upgrade http server successfully
---------------------------
socket.handleUpgrade -->upgrade http to websocket
now from their we are emitting connection{establish kiya hua websocket ci=onnection hai vo bhej rhe h}{establishedWSconn -->connected to cleint}
----------
ab uss connection ko hm bhejnge webSocketForTerminal pr
--->jaise terminal connected hogya--> call handleTerminalCreation
---> jaise connection close ho turant container remove kr dena ki memory bhare na

===================================
we also used dockerode
all output coming handleTerminalCreation( all read/write happening)
--------------
about vite --host flag
iframe data can use  
