import React from "react"
import "../style.css"
import {useLocation, useNavigate} from 'react-router-dom'
export default function Meme() {

    const [meme, setMeme] = React.useState({
        topText: "",
        bottomText: "",
        randomImage: "http://i.imgflip.com/1bij.jpg" 
    })
    const [allMemes, setAllMemes] = React.useState([])
    

    
    React.useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(data => setAllMemes(data.data.memes))
    }, [])
    
    
    
    
    
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
        </main>
    )
}