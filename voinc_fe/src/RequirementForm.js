import React, { useState } from 'react'
import AceEditor from 'react-ace';
import toast, { Toaster } from 'react-hot-toast';
import { websocket, send_backend } from './websocket'



export default function InputForm() {
    var inputStarter = `numpy==1.24.2`

    const [input, setInput] = useState(inputStarter); // [1,[2,3],[342]]
    const runCode = async () => {

        send_backend(JSON.stringify({
            "input": input
        }))
        toast('Input sent to be executed 🔄')

    };
    return (
        <div className='container d-flex justify-content-center p-5'>
            <h3 className='d-flex text-muted font-monospace justify-content-center mt-5 mb-3 aligned-content-center px-5'>INPUT</h3>


            <AceEditor
                mode="python"
                theme="monokai"
                value={inputStarter}
                onChange={(value) => setInput(value)}
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
            <button className='btn btn-success p-5' onClick={runCode}>SEND INPUT</button>

        </div>
    )
}
