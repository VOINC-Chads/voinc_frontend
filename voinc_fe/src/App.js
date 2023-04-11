

import React, { useState } from 'react';
import AceEditor from 'react-ace';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import "ace-builds/src-noconflict/ext-language_tools"
// import websocket 
import { websocket, send_backend } from './websocket'
import InputForm from './InputForm';

websocket.onmessage = function (event) {
  const msg = JSON.parse(event.data)
  if (msg.status === "ERROR") {
    toast.error(msg.content)
  } else {
    toast.success(msg.content)
  }
}

function App() {
  var starter = `def process_function(data):
  # enter function here
  for i in data:
    process_to_inter(i)`

  var executeStarter = `def execute_function(intermediate):
  # enter execute function here
  for key, value in intermediate.items():
    execute_to_final(key, value)
  `
  var requirementStarter = `Flask==1.1.2\njinja2==2.11.2\nmarkupsafe==1.1.1\nitsdangerous==1.1.0\nWerkzeug==1.0.1\nFlask-Cors==3.0.10
  `

  const [requiremnent, setRequirement] = useState(requirementStarter)
  const [processCode, setProcessCode] = useState(starter);
  const [executeCode, setExecuteCode] = useState(executeStarter);
  const [output, setOutput] = useState('');
  const [show_requirement, setShowRequirement] = useState(false);
  const [show_input, setShowInput] = useState(false);
  const runCode = async () => {

    send_backend(JSON.stringify({
      "processCode": processCode,
      "executeCode": executeCode,
      "requirement": requiremnent,
    }))
    toast('Code sent to backend for processing ✈️')

  };

  return (
    <div className="container vh-100">
      <Toaster
        position="bottom-left"
        reverseOrder={false}
      />
      <h1 className='d-flex text-dark font-monospace justify-content-center mt-5 mb-3 aligned-content-center'>VOINC EDITOR</h1>
      <button className='btn btn-primary' onClick={() => { setShowInput(!show_input) }}> {!show_input ? "Change Input" : "Hide Prompt"}</button>
      <button className='btn btn-warning mx-3' onClick={() => { setShowRequirement(!show_requirement) }}> {!show_requirement ? "Change Input" : "Hide Prompt"}</button>
      <br />
      {show_input && <InputForm />}
      <br />
      {show_requirement &&

        <div className='container d-flex justify-content-center p-5'>
          <h3 className='d-flex text-muted font-monospace justify-content-center mt-5 mb-3 aligned-content-center px-5'>REQUIREMENT(s)</h3>


          <AceEditor
            mode="python"
            theme="monokai"
            value={requiremnent}
            onChange={(value) => setRequirement(value)}
            name="editor"
            editorProps={{ $blockScrolling: true }}
            height="20vh"
            width="60%"
            fontSize={20}
            showPrintMargin={true}
            showGutter={false}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
            className='mr-2'
          />
        </div>

      }
      <div>
        <div className='row'>
          <h3 className='col-6 d-flex text-muted font-monospace justify-content-center'>Process Section</h3>
          <h3 className='col-6 d-flex text-muted font-monospace justify-content-center'>Execute Section</h3>
        </div>
      </div>
      <div id="editor" className='d-flex justify-content-center aligned-self-center'>
        <AceEditor
          mode="python"
          theme="monokai"
          value={processCode}
          onChange={(value) => setProcessCode(value)}
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
          className='mr-2'
        />
        <AceEditor
          mode="python"
          theme="monokai"
          value={executeCode}
          onChange={(value) => setExecuteCode(value)}
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
          className='ml-2'

        />

      </div>
      <div className='d-flex justify-content-center p-4 aligned-self-center'>
        <button className='btn btn-success px-5 py-2' onClick={runCode}>SEND CODE TO PROCESS</button>
      </div>



      <h1>{output}</h1>
    </div>

  );
}

export default App;




