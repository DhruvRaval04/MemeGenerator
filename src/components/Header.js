import React from "react"
import troll from "../images/troll-face.png"
import "../header.css"

export default function Header() {
    return (
        <header className="header">
            <img 
                src={troll}
                className="header--image"
            />
            <div className="title-container">
                <h2 className="header--title">Meme Generator</h2>
            </div>
            <h4 className="header--project">Get Rick Rolled</h4>
        </header>
    )
}