import {React, useEffect} from "react"
import {NextUIProvider} from "@nextui-org/react";
import Header from "./components/Header"
import Meme from "./components/Meme"
import Login from"./Sign_In/Login"
import Signup from "./Sign_In/Signup"
import SavedMemes from "./components/SavedMemes"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { useLogout } from "./Sign_In/Logout.js";

export default function App() {
    const { logout } = useLogout();
    useEffect(() => {
    
        window.addEventListener('beforeunload', logout);
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') {
            logout();
          }
        });
    
        // Cleanup listeners when component unmounts
        return () => {
          window.removeEventListener('beforeunload', logout);
          document.removeEventListener('visibilitychange', logout);
        };
      }, []);
    
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