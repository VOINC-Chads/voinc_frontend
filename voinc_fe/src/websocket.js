import toast from "react-hot-toast";
import { w3cwebsocket as W3CWebSocket } from "websocket";

export const websocket = new W3CWebSocket(`ws://localhost:8080/start-session`)
//export const websocket = new W3CWebSocket(`ws://18.219.196.154:8080/start-session`)

export const send_backend = async (data) => {
    websocket.send(JSON.stringify(data))
}

websocket.addEventListener('message', event => {
    // Do something with the received message data
    const data = JSON.parse(event.data);
    console.log("Received message:", data);
    toast(data.content);
  });
  
