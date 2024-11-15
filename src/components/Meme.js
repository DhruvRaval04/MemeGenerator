import React from "react"
import "../style.css"
import {useLocation, useNavigate} from 'react-router-dom'
import axios from 'axios'
export default function Meme() {
    const navigate = useNavigate();
    
    const location = useLocation();
    const userId = location.state?.id; 

    const [meme, setMeme] = React.useState({
        topText: "",
        bottomText: "",
        randomImage: "http://i.imgflip.com/1bij.jpg" 
    })
    const [allMemes, setAllMemes] = React.useState([])
    
    function SavedMemes() {
        navigate("/saved", { state: { id: userId } });
    }
    

    
    React.useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(data => setAllMemes(data.data.memes))
    }, [])

    function backtolandingpage(){
        navigate("/");

    }
    
    
    
    
    
    function getMemeImage() {
        const randomNumber = Math.floor(Math.random() * allMemes.length)
        const url = allMemes[randomNumber].url
        setMeme(prevMeme => ({
            ...prevMeme,
            randomImage: url
        }))
        
    }
    
    function handleChange(event) {
        const {name, value} = event.target
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }))
    }

    function saveMeme() {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const image = new Image()

        image.crossOrigin = 'anonymous'
        image.src = meme.randomImage

        image.onload = () => {
            canvas.width = image.width
            canvas.height = image.height
            ctx.drawImage(image, 0, 0)
            ctx.font = '50px Impact'
            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'black'
            ctx.textAlign = 'center'

            // Top text
            ctx.fillText(meme.topText, canvas.width / 2, 50)
            ctx.strokeText(meme.topText, canvas.width / 2, 50)

            // Bottom text
            ctx.fillText(meme.bottomText, canvas.width / 2, canvas.height - 20)
            ctx.strokeText(meme.bottomText, canvas.width / 2, canvas.height - 20)

            const link = document.createElement('a')
            link.href = canvas.toDataURL('image/png')
            link.download = 'meme.png'
            link.click()
        }
    }


    function saveMemetocloud(){
        //make canvas into png file 

        //setting up the canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const image = new Image()

        image.crossOrigin = 'anonymous'
        image.src = meme.randomImage

        image.onload = () => {
            canvas.width = image.width
            canvas.height = image.height
            ctx.drawImage(image, 0, 0)
            ctx.font = '50px Impact'
            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'black'
            ctx.textAlign = 'center'

            // Top text
            ctx.fillText(meme.topText, canvas.width / 2, 50)
            ctx.strokeText(meme.topText, canvas.width / 2, 50)

            // Bottom text
            ctx.fillText(meme.bottomText, canvas.width / 2, canvas.height - 20)
            ctx.strokeText(meme.bottomText, canvas.width / 2, canvas.height - 20)

            //converting image to base64 
            const base64Image = canvas.toDataURL('image/png');


            //send post request to AWS server 
            uploadmeme(base64Image,userId);
        }
    }

    async function uploadmeme (png, userEmail){
        
        

        try {
            const formData = new FormData();
            //convertt base64 to blob 
            const blob = await fetch(png).then(res => res.blob())
            formData.append("file", blob, "meme.png")

            // Add the user's email to the form data
            formData.append("email", userEmail);
    
            const response = await axios.post("http://localhost:5000/home", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
    
            if (response.data.message === "success") {
                console.log("Meme uploaded successfully to", response.data.location);
                console.log("S3 Object URL:", response.data.objectUrl);
                alert("Successfully uploaded meme");
            } else {
                console.error("Meme upload failed")
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Server responded with error:", error.response.data);
                if (error.response.data === "User email is required"){
                    alert("User must log into an account")
                }
                else{
                    alert("An error occurred during upload. Please try again.")

                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received:", error.request);
                alert("An error occurred during upload. Please try again.")
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error setting up request:", error.message);
                alert("An error occurred during upload. Please try again.")
            }
            
        }
    }

    
    
    return (
        <main>
            <div className="form">
                <input 
                    type="text"
                    placeholder="Top text"
                    className="form--input"
                    name="topText"
                    value={meme.topText}
                    onChange={handleChange}
                />
                <input 
                    type="text"
                    placeholder="Bottom text"
                    className="form--input"
                    name="bottomText"
                    value={meme.bottomText}
                    onChange={handleChange}
                />
                <button 
                    className="form--button"
                    onClick={getMemeImage}
                >
                    Get a new meme image 
                </button>
            </div>
            <div className="meme">
                <img src={meme.randomImage} className="meme--image" />
                <h2 className="meme--text top">{meme.topText}</h2>
                <h2 className="meme--text bottom">{meme.bottomText}</h2>
            </div>
            <div className="save-button-div">
                <button className="save-button" onClick={saveMeme}>Save Meme</button>
            </div>
            <div className="savetocloud-div">
                <button className="savetocloud-button" onClick={saveMemetocloud}>Save Meme to Account</button>
            </div>
            <div className="saved-memes-button-div">
                <button className="saved-memes-button" onClick={SavedMemes}>Saved Memes</button>
            </div>
            <div className="backtolanding-button-div">
                <button className="backtolanding-button" onClick={backtolandingpage}>Back to Login</button>
            </div>
        </main>
    )
}