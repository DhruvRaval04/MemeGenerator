import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {Button} from "@nextui-org/react";
import { useAuthContext } from "../hooks/useAuthContext";
import LoadingBanner from "../components/LoadingBanner"; // Import the banner

export default function Login() {
  const history = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {state, dispatch} = useAuthContext();
  function signup() {
    history("/signup");
  }
  function guest() {
    history("/home",  { state: { id: null, currentmeme:null } });
  }

  async function submit(e) {
    e.preventDefault();

    try {
      const response = await axios.post("https://memegenerator-9lfb.onrender.com/", {
        email,
        password,
      });

      if ((response.status === 200) && (response.data.email != null)) {
         //save the user to local storage
         localStorage.setItem('user', JSON.stringify(response.data))  
                  
         //update AuthContext 
         dispatch({type: 'LOGIN', payload: response.data})

        history("/home", { state: { id: email } });
      } else if (response.data === "notexist") {
        alert("User does not have an account");
      }
      if (response.data === "wrongpassword") {
        alert("Password credentials do not match");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  }

  return (
    <div className="flex flex-col items-center">
      <LoadingBanner /> {/* Render the banner here */}
      <div class="w-full max-w-sm pt-20">
        <form
          class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={submit}
        >
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="username"
            >
              Email
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div class="mb-6">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="password"
            >
              Password
            </label>
            <input
              class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******************"
              required
            />
            <p class="text-red-500 text-xs italic">Please choose a password.</p>
          </div>
          <div class="flex gap-4">
            <button
              class="inline-block bg-primary hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <button
              class="inline-block bg-primary hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={signup}
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
      <Button color="danger" variant="shadow" onClick={guest} className="font-sans text-white font-bold hover:bg-success ">
        Continue as Guest
      </Button>  
    </div>
  );
}
