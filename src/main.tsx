import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { UserProvider } from "./contexts/userAuth"
import App from "./App"
import "./index.css"
import 'bootstrap/dist/css/bootstrap.min.css'


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <UserProvider>
      <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
