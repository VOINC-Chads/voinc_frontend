

import React, { useState } from 'react';
import AceEditor from 'react-ace';
import './App.css';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import "ace-builds/src-noconflict/ext-language_tools"

function App() {
  var starter = `def function(data):
  # enter function here
  print("VOINC")`
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
    <div className="container vh-100">
      <div>
        <h1 className='d-flex text-muted font-monospace justify-content-center mt-5 mb-3 aligned-content-center'>VOINC EDITOR</h1>
      </div>
      <div id="editor" className='d-flex justify-content-center aligned-self-center'>
        <AceEditor
          mode="python"
          theme="monokai"
          value={code}
          onChange={(value) => setCode(value)}
          name="editor"
          editorProps={{ $blockScrolling: true }}
          height="60vh"
          width="60%"
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
      
      </div>
      <div className='d-flex justify-content-center p-4 aligned-self-center'>
        <button className='btn btn-success px-5 py-2' onClick={runCode}>SEND CODE TO EXECUTE</button>
      </div>
    </div>

  );
}

export default App;




