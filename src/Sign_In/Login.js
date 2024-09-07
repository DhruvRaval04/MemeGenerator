import React, { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {
    const history = useNavigate();
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function submit(e) {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/", { email, password })
            
            if (response.data === "exist") {
                history("/home", { state: { id: email } })
            } else if (response.data === "notexist") {
                alert("User does not have an account")
            }
            if (response.data === "wrongpassword"){
                alert("Password credentials do not match")
            }
        } catch (error) {
            console.error("Login error:", error)
            alert("An error occurred during login. Please try again.")
        }
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={submit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
            <br/>
            <p>OR</p>
            <br/>
            <Link to="/signup">Signup Page</Link>
        </div>
    )
}