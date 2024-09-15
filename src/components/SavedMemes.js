import React from "react"
import "../style.css"
import {useLocation, useNavigate} from 'react-router-dom'

export default function SavedMemes() {
    const navigate = useNavigate();
    function Back(){
        navigate("/home")
    }



    return(
        <div>
            <button className="backbutton" onClick={Back}>Back</button>
            
        </div>
    )

    
}