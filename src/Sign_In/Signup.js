import React, {useEffect, useState} from "react"
import axios from "axios"
import {useNavigate, Link} from "react-router-dom"
import {Button} from "@nextui-org/react";

export default function Login(){
    
    const history = useNavigate();
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    function login() {
        history("/");
      }
      function guest() {
        history("/home");
      }
    

    async function submit(e){
        e.preventDefault();

        try{
            //sending POST 
            await axios.post("http://localhost:5000/signup", { email, password})
            //getting the server response 
            .then(res=>{
                //user has already signed in and they are making another account
                if(res.data === "exist"){
                    //sending alert 
                    alert("User already exists")
                }
                else if (res.data === "notexist"){
                    //redirects to home page 
                    history("/home", {state:{id:email}})
                }
            })
            .catch(e=> {
                alert("wrong details")
                console.log(e);
            })

        }

        catch (e){
            console.log(e);

        }
    }

    return(
        <div className="flex flex-col items-center">
        <div class="w-full max-w-sm pt-20">
          <form
            class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={submit}
            action = "POST"
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
                class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit
              </button>
              <button
                class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                onClick={login}
              >
                Login
              </button>
            </div>
          </form>
        </div>
        <Button color="danger" variant="shadow" onClick={guest} className="font-sans text-white font-bold">
          Continue as Guest
        </Button>  
    

            </div>

    )
}