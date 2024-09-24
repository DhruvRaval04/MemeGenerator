import React from "react"
import troll from "../images/troll-face.png"
import "../header.css"
import {useLocation, useNavigate} from 'react-router-dom'

export default function Header() {
    const location = useLocation()
    const Header = () => {
        const location = useLocation();
        const userId = location.state?.id;  // Safely access 'id'
    
        if (!userId) {
            return <div>No user ID found</div>;
        }
    
        return <div>User ID: {userId}</div>;
    };

    
    return (
        <header className="header">
            <img 
                src={troll}
                className="header--image"
            />
            <div className="title-container">
                <h2 className="header--title">Meme Generator</h2>
            </div>
            <h4 className="header--project">Hello</h4>
            <Header/>
        </header>
    )
}
