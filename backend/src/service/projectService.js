import uuid4 from 'uuid4';
import fs from 'fs/promises';
import { execPromisified } from "../utils/execUtility.js";
import {REACT_PROJECT_COMMAND} from '../config/serverConfig.js'
import directoryTree from 'directory-tree';
import path from "path";

export const createProjectService = async () => {
  try {
    // Create a unique id and then inside the projects folder create a new folder with that id
    const projectId = uuid4();
    console.log("New project id is", projectId);
    
    // Ensure projects directory exists
    try {
      await fs.access('./projects');
    } catch {
      await fs.mkdir('./projects');
    }
    
    // Create project directory
    await fs.mkdir(`./projects/${projectId}`);
    
    // Run the Vite project creation command
    console.log("Running create command:", REACT_PROJECT_COMMAND);
    const { stdout, stderr } = await execPromisified(REACT_PROJECT_COMMAND, {
      cwd: `./projects/${projectId}`,
      shell: true
    });
    
    console.log("Command output:", stdout);
    if (stderr) console.error("Command stderr:", stderr);
    
    return projectId;
  } catch (error) {
    console.error("Error in createProjectService:", error);
    throw error;
  }
}
export const getProjectTreeService=async (projectId)=>{
    const projectpath =path.resolve(`./projects/${projectId}`);//will return end to end path
    const tree=directoryTree(projectpath);
    return tree;
}