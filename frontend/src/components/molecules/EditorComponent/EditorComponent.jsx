import Editor from '@monaco-editor/react';
import "monaco-editor/min/vs/editor/editor.main.css";
import { useEffect, useState } from 'react';
import { useActiveFileTabStore } from '../../../store/activeFileTabStore';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { extensionToFileType } from '../../../utils/extensionToFileType';


export const EditorComponent = () => {
  let timeId=null; // for debouncing
  const [theme, setTheme] = useState(null);
  const { activeFileTab } = useActiveFileTabStore();
  const  {editorsocket}=useEditorSocketStore();

  // Load theme
  useEffect(() => {
    async function loadTheme() {
      try {
        const response = await fetch('/Dracula.json');
        if (!response.ok) throw new Error("Failed to load theme");
        const data = await response.json();
        setTheme(data);
      } catch (err) {
        console.error("Error loading theme:", err);
      }
    }
    loadTheme();
  }, []);

  const handleEditorTheme = (editor, monaco) => {
    if (!theme) return;
    try {
      monaco.editor.defineTheme('dracula', theme);
      monaco.editor.setTheme('dracula');
    } catch (err) {
      console.error("Failed to apply theme:", err);
    }
  };
  function handleChange(value){
    //clear old timer
    if(timeId!==null){
      clearTimeout(timeId);
    }
    //set new timer
    timeId=setTimeout(()=>{
    const editorContent=value;
    console.log("Sending writefile event");
    editorsocket.emit("writeFile",{
      data:editorContent,
      pathToFileOrFolder:activeFileTab.path
    });
    },2000);// 2000ms delay

  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {theme && (
        <Editor
          height="80vh"
          width="100%"
          defaultLanguage={undefined}
          value={activeFileTab?.value || '// Welcome to the playground'}
          options={{
            fontSize: 18,
            fontFamily: "monospace",
          }}
          language={extensionToFileType(activeFileTab?.extension)}
          onChange={handleChange}//monaco event onchange
          onMount={handleEditorTheme}
        />
      )}
    </div>
  );
};
