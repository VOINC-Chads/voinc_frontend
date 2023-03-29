import React, { useState } from 'react';
import AceEditor from 'react-ace';
import ReactDOM from 'react-dom/client';
import './App.css';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import "ace-builds/src-noconflict/ext-language_tools"

function App() {
  var starter = `# Enter your code here
  def required_function(p1, p2):
    return None\n\n`
  const [code, setCode] = useState(starter);
  const [output, setOutput] = useState('');
  const runCode = async () => {
    const response = await fetch('/run-python', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    const result = await response.json();
    setOutput(result.output);
  };

  return (
    <div id="editor"> 
      <AceEditor
        mode="python"
        theme="monokai"
        value={code}
        onChange={(value) => setCode(value)}
        name="editor"
        editorProps={{ $blockScrolling: true }}
        height="500px"
        width="100%"
        fontSize={16}
        showPrintMargin={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
      <button onClick={runCode}>Run</button>
      <pre>{output}</pre>
    </div>
  );
}

export default App;
const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(<App />);
