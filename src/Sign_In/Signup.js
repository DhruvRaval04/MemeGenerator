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
        <div className="login">

            <h1>Signup</h1>

            <form action = "POST">
                <input type="email" onChange= {(e) => {setEmail(e.target.value)}} placeholder="Email"/>
                <input type="password" onChange= {(e) => {setPassword(e.target.value)}} placeholder="Password"/>

                <input type="submit" onClick={submit}/>


            </form>

            <br/>
            <p>OR</p>
            <br/>

            <Link to="/">Login Page</Link>
            <br/>
            <p>OR</p>
            <br/>
            <Link to="/home">Continue without signing in</Link>

        </div>
    )
}