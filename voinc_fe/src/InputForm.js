import React, { useState } from 'react'
import AceEditor from 'react-ace';
import toast, { Toaster } from 'react-hot-toast';
import { websocket, send_backend } from './websocket'


export default function InputForm() {
    websocket.onmessage = function (event) {
        const msg = JSON.parse(event.data)
        if (msg.status === "RECEIVED") {
            setReady(true)
        }
    }

    var inputStarter = `[1, 2]`

    const [input, setInput] = useState(inputStarter); // [1,[2,3],[342]]
    const [ready, setReady] = useState(false)
    const runCode = async () => {

        var job = {
            "jobs": JSON.parse(input).map(item => item.toString())
        }

        send_backend(JSON.stringify({
            "type": 1,
            "job": job
        }))
        toast('Input sent to be executed 🔄')
        toast('Please do not refresh')
        toast('Output will be stored in terminal 📝')

        console.log(input)

    };
    return (
        <div className='container d-flex justify-content-center p-5'>
            <Toaster/>
            <h3 className='d-flex text-muted font-monospace justify-content-center mt-5 mb-3 aligned-content-center px-5'>INPUT</h3>


            <AceEditor
                mode="python"
                theme="monokai"
                value={input}
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
            <button disabled={!ready} className='btn btn-success p-5' onClick={runCode}>RUN WITH INPUT</button>

        </div>
    )
}
