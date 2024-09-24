import React from "react"
import "../style.css"
import {useLocation, useNavigate} from 'react-router-dom'
import axios from 'axios'


export default function SavedMemes() {
    const navigate = useNavigate();
    function Back(){
        navigate("/home", { state: { id: userId } })
    }
    const location = useLocation();
    const userId = location.state?.id;
    
    const [memes, setMemes] = React.useState([]);

    React.useEffect(() => {
        const fetchMemes = async () => {
            try {
                //accessing userEmail once again 
                const userEmail = userId
                const response = await axios.get(`http://localhost:5000/saved?email=${userEmail}`);
                setMemes(response.data.memes);
            } catch (error) {
                console.log("Error fetching saved memes:", error);
            }
        };

        fetchMemes();
    }, []);



  
    return (
        <div className="saved-memes-container">
            <button className="back-button" onClick={Back}>Back</button>
            <h2>Your Saved Memes</h2>
            <div className="meme-grid">
                {memes.map((meme) => (
                    <div key={meme.objectKey} className="meme-item">
                        <img src={meme.url} alt="Saved meme" />
                    </div>
                ))}
            </div>
        </div>
    );
};
