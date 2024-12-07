import React from "react"
import {NextUIProvider} from "@nextui-org/react";
import Header from "./components/Header"
import Meme from "./components/Meme"
import Login from"./Sign_In/Login"
import Signup from "./Sign_In/Signup"
import SavedMemes from "./components/SavedMemes"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

export default function App() {
    return (
        <div className="App">
            <NextUIProvider>
                <Router>
                    <Header />
                    <Routes>
                        <Route path = "/" element = {<Login/>}/>
                        <Route path = "/signup" element = {<Signup/>}/>
                        <Route path = "/home" element = {<Meme/>}/>
                        <Route path = "/saved" element = {<SavedMemes/>}/>
                    </Routes>
                </Router> 
            </NextUIProvider>
        </div>
    )
}