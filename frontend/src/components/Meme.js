import React, { useRef, useEffect, useState } from "react";
import "../style.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, image } from "@nextui-org/react";
import { CiSaveDown1, CiSaveDown2 } from "react-icons/ci";
import { TiArrowBackOutline } from "react-icons/ti";
import { FaSave } from "react-icons/fa";
import Draggable from "react-draggable";
import { useLogout } from "../Sign_In/Logout.js";
import { useAuthContext } from "../hooks/useAuthContext.js";

export default function Meme() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const location = useLocation();
  const userId = location.state?.id;
  const { user } = useAuthContext();

  const topTextRef = useRef(null);
  const bottomTextRef = useRef(null);
  const canvasRef = useRef(null);
  const initialmeme = location.state?.currentmeme;
  var initialurl = "https://i.imgflip.com/1bij.jpg";
  
  if (initialmeme != null) {
    initialurl = initialmeme.randomImage;
    //console.log("INITIAL", initialmeme);
  }
  //console.log("INITIAL", initialmeme);
  const [meme, setMeme] = React.useState({
    topText: "",
    bottomText: "",
    randomImage: initialurl,
    topTextMetrics: { width: 0, height: 0 },
    bottomTextMetrics: { width: 0, height: 0 }
  });
  const [allMemes, setAllMemes] = React.useState([]);


  function SavedMemes() {
    if (!user) {
      console.log("User not defined");
      console.log(user);
      alert("User must be logged in");
    } else {
      navigate("/saved", { state: { id: userId, currentmeme: meme } });
    }
  }

  React.useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => setAllMemes(data.data.memes));
  }, []);
  const { logout } = useLogout();

  function backtolandingpage() {
    if (userId != null) {
      logout();
      navigate("/");
    } else {
      navigate("/");
    }
  }

  function getMemeImage() {
    const randomNumber = Math.floor(Math.random() * allMemes.length);
    const url = allMemes[randomNumber].url;
    setMeme((prevMeme) => ({
      ...prevMeme,
      randomImage: url,
    }));
  }

  const [textPositions, setTextPositions] = useState({
    topText: { x: 0, y: 0 },
    bottomText: { x: 0, y: 0 },
  });

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [currentimageHeight, setCurrentImageHeight] = useState(0);
  const [dragged, setdragged] = useState(false);

  // Preload the image and compute initial x
  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = meme.randomImage;

    image.onload = () => {
      const initialX = image.width / 2;
      setImageWidth(initialX); // Set initial width when image loads
      setImageHeight(image.height);
      setTextPositions({
        topText: { x: initialX, y: 32 }, // Example Y value for top text
        bottomText: { x: initialX, y: image.height}, // Example Y value for bottom text
      });
      
    };
  },[]);

    // Preload the image and compute initial x
    useEffect(() => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = meme.randomImage;
  
      image.onload = () => {
        setCurrentImageHeight((image.height / image.width) * 600);
      
        
      };
    },[meme.randomImage]);

  // Measure text metrics
  const measureTextMetrics = (text) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = "32px Impact";
    
    const metrics = ctx.measureText(text.toUpperCase());
    
    // Estimate height (since measureText doesn't directly provide height)
    const height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    
    return {
      width: metrics.width,
      height: height
    };
  };

  const handleDrag =
    (textType) =>
    (event, { x, y, lastX, lastY }) => {
      setTextPositions((prevPositions) => ({
        ...prevPositions,
        [textType]: {
          x: prevPositions[textType].x + x - lastX,
          y: prevPositions[textType].y + y - lastY,
        },
      }));
      setdragged(true);
      console.log("top x", textPositions.topText.x)
      console.log("top y", textPositions.topText.y)
      console.log("bottom x", textPositions.bottomText.x)
      console.log("bottom y", textPositions.bottomText.y)
    };

  function handleChange(event) {
    const { name, value } = event.target;
    setMeme((prevMeme) => {
      // Calculate metrics based on which input changed
      const newMetrics = name === 'topText' 
        ? { topTextMetrics: measureTextMetrics(value) }
        : { bottomTextMetrics: measureTextMetrics(value) };
      
      return {
        ...prevMeme,
        [name]: value,
        ...newMetrics
      };
    });
  }

  function createMemeCanvas(onCanvasCreated) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();

    image.crossOrigin = "anonymous";
    image.src = meme.randomImage;

    image.onload = () => {
        let canvasWidth = 600; // Target width is always 600
        let canvasHeight = (image.height / image.width) * 600; // Maintain aspect ratio

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // Draw the image
        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        
        ctx.font = "32px Impact";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.textAlign = "left";  // Left alignment

        // Draw top text
        ctx.fillText(meme.topText.toUpperCase(), textPositions.topText.x - meme.topTextMetrics.width/2 + 12, textPositions.topText.y);
        ctx.strokeText(meme.topText.toUpperCase(), textPositions.topText.x - meme.topTextMetrics.width/2 + 12, textPositions.topText.y);

        // Draw bottom text
        ctx.fillText(meme.bottomText.toUpperCase(), textPositions.bottomText.x - meme.bottomTextMetrics.width/2 +12, textPositions.bottomText.y);
        ctx.strokeText(meme.bottomText.toUpperCase(), textPositions.bottomText.x - meme.bottomTextMetrics.width/2 + 12, textPositions.bottomText.y);

        // Call the callback with the created canvas
        onCanvasCreated(canvas);
    };

    image.onerror = () => {
        console.error("Error loading image");
    };
}


function saveMeme() {
  createMemeCanvas((canvas) => {
      // Download the meme
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "meme.png";
      link.click();
  });
}

function saveMemetocloud() {
  createMemeCanvas((canvas) => {
      // Convert image to base64
      const base64Image = canvas.toDataURL("image/png");

      // Send post request to AWS server
      uploadmeme(base64Image, userId);
  });
}

  async function uploadmeme(png, userEmail) {
    console.log(user.token);
    if (!user) {
      alert("User must be logged in");
    } else {
      try {
        const formData = new FormData();
        //convertt base64 to blob
        const blob = await fetch(png).then((res) => res.blob());
        formData.append("file", blob, "meme.png");

        // Add the user's email to the form data
        formData.append("email", userEmail);

        const response = await axios.post(
          "https://memegenerator-9lfb.onrender.com/home",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              //add authorization header with the token
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
          } 
        
        );

        if (response.data.message === "success") {
          console.log("Meme uploaded successfully to", response.data.location);
          console.log("S3 Object URL:", response.data.objectName);
          console.log(response.data);
          alert("Successfully uploaded meme");
        } else {
          console.error("Meme upload failed");
        }
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Server responded with error:", error.response.data);
          if (error.response.status === 401) {
            alert("Authentication failed. Please log in again.");
            if (error.response.data === "User email is required") {
              alert("User must log into an account");
            } else {
              alert("An error occurred during upload. Please try again.");
            }
          } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received:", error.request);
            alert("An error occurred during upload. Please try again.");
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error setting up request:", error.message);
            alert("An error occurred during upload. Please try again.");
          }
        }
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
          maxLength={30}
        />
        <input
          type="text"
          placeholder="Bottom text"
          className="form--input"
          name="bottomText"
          value={meme.bottomText}
          onChange={handleChange}
          maxLength={30}
        />
        <button
          className="form--button bg-primary hover:bg-blue-900"
          onClick={getMemeImage}
        >
          Get a new meme image
        </button>
      </div>
      <div className="meme "  >
        <img src={meme.randomImage} className="meme--image" />
            <Draggable
              positionOffset={{x:'-50%', y:0}}
              nodeRef={topTextRef}
              onDrag={handleDrag("topText")}
              bounds={{
                left:(-300 + meme.topTextMetrics.width/2), 
                right:(300 - meme.topTextMetrics.width/2),
                top: (0),
                bottom: (currentimageHeight - 32*2)
              }}
              
            >
              <h2 ref={topTextRef} className="meme--text ">
                {meme.topText}
              </h2>
            </Draggable>
            <Draggable
              positionOffset={{x:'-50%', y:imageHeight-32}}
              nodeRef={bottomTextRef}
              onDrag={handleDrag("bottomText")}
              bounds={{
                left:(-300 + meme.bottomTextMetrics.width/2), 
                right:(300 - meme.bottomTextMetrics.width/2),
                top: (-imageHeight+32),
                bottom: (currentimageHeight-imageHeight-32)
              
              }}
            >
              <h2 ref={bottomTextRef} className="meme--text">
                {meme.bottomText}
              </h2>
            </Draggable>
      </div>
      <div className="save-button-div flex flex-row gap-10 pb-10 lg:pb-0">
        <Button
          color="primary"
          endContent={<CiSaveDown2 />}
          radius="md"
          onClick={saveMeme}
          className="save-button hover:bg-success "
          disableAnimation={true}
          size="lg"
        >
          Save Meme
        </Button>
        <Button
          color="primary"
          endContent={<CiSaveDown1 />}
          radius="full"
          onClick={saveMemetocloud}
          className="save-button hover:bg-success "
          disableAnimation={true}
          size="lg"
        >
          Save Meme to Account
        </Button>
      </div>
      <div className="flex flex-row gap-10 items-end">
        <Button
          color="primary"
          startContent={<TiArrowBackOutline />}
          radius="full"
          onClick={backtolandingpage}
          className="save-button hover:bg-danger"
          disableAnimation={true}
          size="md"
        >
          Back
        </Button>
        <Button
          color="primary"
          endContent={<FaSave />}
          radius="full"
          onClick={SavedMemes}
          className="save-button hover:bg-success "
          disableAnimation={true}
          size="md"
        >
          Saved Memes
        </Button>
        <h1></h1>
      </div>
    </main>
  );
}
