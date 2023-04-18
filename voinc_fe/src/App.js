

import React, { useState } from 'react';
import AceEditor from 'react-ace';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import "ace-builds/src-noconflict/ext-language_tools"
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';

// import websocket 
import { websocket, send_backend } from './websocket'
import InputForm from './InputForm';



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
  var requirementStarter = `Flask==1.1.2\njinja2==2.11.2\nmarkupsafe==1.1.1\nitsdangerous==1.1.0\nWerkzeug==1.0.1\nFlask-Cors==3.0.10`

  const [requiremnent, setRequirement] = useState(requirementStarter)
  const [processCode, setProcessCode] = useState(starter);
  const [executeCode, setExecuteCode] = useState(executeStarter);
  const [show_requirement, setShowRequirement] = useState(false);
  const [show_input, setShowInput] = useState(false);
  const [show_terminal, setShowTerminal] = useState(false);
  const [terminalLineData, setTerminalLineData] = useState(['Waiting for middleware instances to spin up... ⏲️'])
  const [ready, setReady] = useState(false)
  const [ip, setIp] = useState('10.0.0.1:2818')

  
  websocket.onmessage = function (event) {
    const msg = JSON.parse(event.data)
    if (msg.status === "ERROR") {
      toast.error(msg.content)
    } else if (msg.status === "BRUH" || msg.status === "COMPLETE") {
      setTerminalLineData([...terminalLineData, msg.content])
    } else if (msg.status === "READY"){
      setReady(true)
      setTerminalLineData([...terminalLineData, msg.content, 'Waiting for code...'])
      toast((t) => (
        <span>
          Instances are <b>ready</b> for code
          <button onClick={() => toast.dismiss(t.id)}>
            Dismiss
          </button>
        </span>
      ));
    } else if (msg.status === "IP"){
      setIp(msg.content)
    }
    else{
      toast.success(msg.content)

    }
  }


  const runCode = async () => {

    var code = {
      "processCode": processCode,
      "executeCode": executeCode,
      "requirements": requiremnent,
    }

    send_backend(JSON.stringify({
      "type": 0,
      "code": code
    }))
    toast('Code sent to backend for processing ✈️')

  };

  return (
    <div className="container vh-100">
      <Toaster
        position="bottom-left"
        reverseOrder={false}
      />
      <h1 className='d-flex display-3 text-dark font-monospace justify-content-center mt-3 mb-3 aligned-content-center'>VOINC EDITOR</h1>
      <h3 className='d-flex text-dark font-monospace justify-content-center mb-3 aligned-content-center'>IP: <span className='mx-2 text-muted '>{ip}</span></h3>

      <button className='btn btn-primary p-2' onClick={() => { setShowInput(!show_input) }}> {!show_input ? "Change Input" : "Hide Input"}</button>
      <button className='btn btn-warning mx-3 p-2' onClick={() => { setShowRequirement(!show_requirement) }}> {!show_requirement ? "Change Requirements" : "Hide Requirements"}</button>
      <button className='btn btn-success p-2' onClick={() => { setShowTerminal(!show_terminal) }}> {!show_terminal ? "Show Terminal" : "Hide Terminal"}</button>

      <br/>
      {/* <button className='btn btn-danger my-3' onClick={() => {setTerminalLineData([...terminalLineData, "clicked"])}}>Run Code</button> */}
      {/* <br /> */}
      {show_input && <InputForm />}
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
      {show_terminal && <div className="container mt-5 p-4">
        <div className='row'>
          <div className='col-2' />
          <div className='col-8 d-flex justify-content-center'>
            <Terminal name='Job Status Terminal' colorMode={ColorMode.Dark} height='40vh' onInput={terminalInput => { setTerminalLineData([...terminalLineData, terminalInput]) }}>
              {terminalLineData.map((line, index) => <TerminalOutput key={index}>{line}</TerminalOutput>)}
            </Terminal>
          </div>
          <div className='col-2' />

        </div>

      </div>}

      <div classname="container-fluid mt-3">
        <div className='row mt-4'>
          <h3 className='col-6 d-flex text-muted font-monospace justify-content-center'>Process Section</h3>
          <h3 className='col-6 d-flex text-muted font-monospace justify-content-center'>Execute Section</h3>
        </div>
      </div>
      <div id="editor" className='d-flex justify-content-center p- aligned-self-center'>
        <AceEditor
          mode="python"
          theme="monokai"
          value={processCode}
          onChange={(value) => setProcessCode(value)}
          name="editor"
          editorProps={{ $blockScrolling: true }}
          height="50vh"
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
          height="50vh"
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
      <div className='d-flex justify-content-center py-3 aligned-self-center'>
        <button disabled={!ready}  className='btn btn-success btn-block px-5 py-3' onClick={runCode}>SEND CODE TO PROCESS</button>
      </div>



    </div>

  );
}

export default App;




