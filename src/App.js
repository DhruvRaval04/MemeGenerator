import React from "react"
import Header from "./components/Header"
import Meme from "./components/Meme"
import Login from"./Sign_In/Login"
import Signup from "./Sign_In/Signup"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

export default function App() {
    return (
        <div classname="App">
            <Router>
                <Header />
                <Routes>
                    <Route path = "/" element = {<Login/>}/>
                    <Route path = "/" element = {<Signup/>}/>
                    <Route path = "/" element = {<Meme/>}/>
                </Routes>
            </Router>

        </div>
    )
}