import { w3cwebsocket as W3CWebSocket } from "websocket";

export const websocket = new W3CWebSocket(`ws://localhost:8080/start-session`)

export const send_backend = async (data) => {
    websocket.send(JSON.stringify(data))
}

