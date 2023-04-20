

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
import ColoredCircle from './ColoredCircle';



function App() {
  var starter = `def process_function(data):
  # enter function here
  return [execute_function(int(data))]`

  var executeStarter = `def execute_function(data):
  # enter execute function here
  return data * 2
  `
  var requirementStarter = ``

  const [requiremnent, setRequirement] = useState(requirementStarter)
  const [processCode, setProcessCode] = useState(starter);
  const [executeCode, setExecuteCode] = useState(executeStarter);
  const [show_requirement, setShowRequirement] = useState(false);
  const [show_input, setShowInput] = useState(false);
  const [show_terminal, setShowTerminal] = useState(false);
  const [backendColor, setBackendColor] = useState('red')
  const [backendStatus, setBackendStatus] = useState('CONNECTING')
  const [terminalLineData, setTerminalLineData] = useState(['Waiting for middleware instances to spin up... ⏲️'])
  const [numJob, setNumJob] = useState(0)

  const [numWorker, setNumWorker] = useState(1)
  // related to number of worker
  const [selectedOption, setSelectedOption] = useState("1")
  const [workerOptions, setWorkerOptions] = useState([0,1,2,3,4,5,6])
  const [workerChangeReady, setWorkerChangeReady] = useState(false) // prevent user from spamming worker changes
  console.log(setNumJob)
  console.log(setNumWorker)
  console.log(setWorkerOptions)

  const [ready, setReady] = useState(false)

  const [ip, setIp] = useState('')


  websocket.onopen = function (event) {
    setBackendColor('red')
    setBackendStatus('CONNECTING')
  };

  websocket.addEventListener('message', event => {
    const msg = JSON.parse(event.data)
    console.log(msg)
    if (msg.status === "ERROR") {
      toast.error(msg.content)
      setTerminalLineData([...terminalLineData, msg.content])
    } else if (msg.status === "BRUH") {
      setTerminalLineData([...terminalLineData, msg.content])
    } else if (msg.status === "UPDATE") {
      setReady(true)
      setBackendColor('green')
      setBackendStatus('READY')
      setNumWorker(1)
      setTerminalLineData([...terminalLineData, msg.content])
      var content = JSON.parse(msg.content);
      if (content.hasOwnProperty('ip')) {
        setIp(content['ip'])
      }
      if (content.hasOwnProperty('num_jobs')){
        setNumJob(content['num_jobs'])
      }
      if (content.hasOwnProperty('num_workers')){
        setNumWorker(content['num_workers'])
      }
      toast.success(msg.content);
    } else if (msg.status === "COMPLETE") {
      var contentJob = JSON.parse(msg.content);
      if (contentJob.hasOwnProperty('JobResp')){
        var jobResults = contentJob['JobResp']['results']
        console.log(jobResults)
        var resultString = "";
        jobResults.forEach(element => {
          resultString += `VALUE: ${element['value']} RESULT: ${element['result']}\n`;
        });
        setTerminalLineData([...terminalLineData, resultString])
        
      }
    } else if (msg.status === "CHANGE_NUM_WORKER"){
      setWorkerOptions(msg.content)
    } else if (msg.status === "READY_NUM_WORKER"){
      setWorkerChangeReady(true)
    }
    else {
      toast.success(msg.content)
    }
  });


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
  const handleOptionChange = (e) =>{
    setSelectedOption(e.target.value)
  }
  const handleWorkerChoice = () =>{
    toast(`Backend spinning up ${selectedOption} worker(s) ⏲️`)
    toast(`Please wait for response before changing 🔄`)

    setWorkerChangeReady(true)

    send_backend(JSON.stringify({
      "type": 2,
      "num_worker": selectedOption
    }))
  }

  return (
    <div className="container vh-100">
      <Toaster
        position="bottom-left"
        reverseOrder={false}
      />
      <div className='d-flex justify-content-between'>
        <div className=' p-5 aligned-content-center'>
          <h1 className='d-flex display-2 text-dark font-monospace '>VOINC EDITOR </h1>
          <h3 className='text-dark  p-2 font-monospace justify-content-center'> IP: <span className='mx-2 text-muted '>{ip}</span></h3>

        </div>
        <div className='d-flex p-5 aligned-content-center'>          {/**Card for display backend status, number of workers and number of jobs on the right side absolute position */}

          <div className='card' style={{ width: '18rem' }}>
            <h5 class="card-header">Backend Info</h5>

            <div className='card-body' style={{ borderColor: "black" }}>
              {/** List containing number of workers and number of jobs */}
              <h6 className='card-text py-1 text-muted'>Status: <span className=' text-dark font-weight-bold'>{backendStatus}</span> {<ColoredCircle color={backendColor} />}</h6>
              <h6 className='card-text py-1 text-muted'>Number of workers: <span className='text-dark font-weight-bold'>{numWorker}</span></h6>
              <h6 className='card-text py-1 text-muted mb-2'>Jobs left in queue: <span className='text-dark font-weight-bold'>{numJob}</span></h6>
              <div class="input-group">
                <select class="custom-select" id="inputGroupSelect04" defaultValue={3} onChange={handleOptionChange}>
                  {workerOptions.map((option) => {
                    return <option value={option}>Workers: {option}</option>
                  })}
                </select>
                <div class="input-group-append">
                  <button class="btn btn-danger btn-outline-info" type="button" disabled={workerChangeReady} onClick={handleWorkerChoice}>Change</button>
                </div>
              </div>
            </div>
          </div>

        </div>


      </div>
      <div className='d-flex justify-content-center'>
        <button className='btn btn-primary px-3 py-2' onClick={() => { setShowInput(!show_input) }}> {!show_input ? "Change Input" : "Hide Input"}</button>
        <button className='btn btn-warning mx-3 p-3 py-2' onClick={() => { setShowRequirement(!show_requirement) }}> {!show_requirement ? "Change Requirements" : "Hide Requirements"}</button>
        <button className='btn btn-success px-3 py-2' onClick={() => { setShowTerminal(!show_terminal) }}> {!show_terminal ? "Show Terminal" : "Hide Terminal"}</button>
      </div>



      <br />
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
        <button disabled={!ready} className='btn btn-success btn-block px-5 py-3' onClick={runCode}>SEND CODE TO PROCESS</button>
      </div>



    </div>

  );
}

export default App;




