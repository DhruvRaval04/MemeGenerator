import React, {useEffect, useState} from "react"
import axios from "axios"
import {useNavigate, Link} from "react-router-dom"

export default function Login(){

    const history = useNavigate();
    
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')

    async function submit(e){
        e.preventDefault();

        try{
            //saving email and password from axios to send to server 
            await axios.post("http://localhost:3000/", { email, password})

            //getting the server response 
            .then(res=>{
                if(res.data = "exist"){
                    //redirects to home page 
                    history("/home", {state:{id:email}})
                }
                else if (res.data = "notexist"){
                    //sending alert 
                    alert("User has not signed up")
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
        <div className="login">

            <h1>Login</h1>

            <form action = "POST">
                <input type="email" onChange= {(e) => {setEmail(e.target.value)}} placeholder="Email"/>
                <input type="password" onChange= {(e) => {setPassword(e.target.value)}} placeholder="Password"/>

                <input type="submit" onClick={submit}/>


            </form>

            <br/>
            <p>OR</p>
            <br/>

            <Link to="/signup"> Signup Page</Link>

        </div>
    )
}