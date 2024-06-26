import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

export default function Router() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" exact element={<App/>}/>
        </Routes>
    </BrowserRouter>
  )
}
