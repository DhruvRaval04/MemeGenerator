import React from "react"
import troll from "../../public/troll-face.png"
import "../header.css"
import {useLocation, useNavigate} from 'react-router-dom'
import {Button} from '@nextui-org/react'

export default function Header() {
    const location = useLocation()

    const Header = () => {
        const location = useLocation();
        const userId = location.state?.id;  // Safely access 'id'
    
        if (!userId) {
            return <div className="font-sans lg:text-xl text-sm">No user ID found</div>;
        }
    
        return(
        <div className="flex flex-row gap-20 items-baseline">
            <h3 className="font-sans lg:text-xl text-sm">User ID: {userId}</h3>
            
        </div>);
    };

    
    return (
        <header className="flex flex-row bg-primary items-center text-center justify-between p-5 relative">
        {/* Left side - Troll image */}
        <img 
            src={troll}
            className="lg:size-24 md:size-20 size-12 lg:z-10"
        />
        
        {/* Middle - Title */}
        <div className="flex justify-center lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:w-full">
            <h2 className="font-mono lg:text-7xl md:text-5xl text-xl">Meme Generator</h2>
        </div>
        
        {/* Right side - Greeting */}
        <div className="flex flex-row items-baseline lg:ml-auto lg:z-10">
            <h4 className="font-sans lg:text-3xl md:text-xl text-sm font-bold px-4">Hello, </h4>
            <Header/>
        </div>
    </header>
    )
}
