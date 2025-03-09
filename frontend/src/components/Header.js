import React from "react";
import troll from "../images/troll-face.png";
import "../header.css";
import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const userId = location.state?.id;

  return (
    <header className="bg-[#007bff] shadow-md py-4 px-6 flex items-center justify-between text-white">
      {/* Left side - Troll image */}
      <div className="flex items-center">
        <img src={troll} className="h-10 w-10 mr-4" alt="Troll Face" />
        <h2 className="text-2xl font-semibold">GagCanvas</h2>
      </div>

      {/* Right side - Greeting */}
      <div className="flex items-center">
        <h4 className="font-medium mr-2">Hello,</h4>
        {userId ? (
          <p className="text-sm">User ID: {userId}</p>
        ) : (
          <p className="text-sm italic">No user ID</p>
        )}
      </div>
    </header>
  );
}

