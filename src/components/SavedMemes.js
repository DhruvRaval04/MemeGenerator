import React from "react";
import { useState } from "react";
import "../style.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Button,
  CardFooter,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@nextui-org/react";
import { MdDelete } from "react-icons/md";
import {Image} from "@nextui-org/react"

export default function SavedMemes() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();
  function Back() {
    navigate("/home", { state: { id: userId, currentmeme: meme  } });
  }

  const Delete = async (objectKey) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/saved/${objectKey}`
      );
      // Handle successful deletion (e.g., refresh UI)
      console.log(response.data);
      window.location.reload();

      return response.data;
    } catch (error) {
      console.error("Error deleting image:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const location = useLocation();
  const userId = location.state?.id;
  const meme = location.state?.currentmeme;

  const [memes, setMemes] = React.useState([]);

  React.useEffect(() => {
    const fetchMemes = async () => {
      try {
        //accessing userEmail once again
        const userEmail = userId;
        const response = await axios.get(
          `http://localhost:5000/saved?email=${userEmail}`
        );
        setMemes(response.data.memes);
        console.log(response.data);
      } catch (error) {
        console.log("Error fetching saved memes:", error);
      }
    };

    fetchMemes();
  }, []);

  console.log("URL for meme:", memes.url);

  const arrayReverseObj = (memes) => memes.slice().reverse();
  console.log(arrayReverseObj(memes));

  const reversedmemes = arrayReverseObj(memes);
  const [selectedMeme, setSelectedMeme] = useState(null);
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={Back}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Back
        </button>
        <h2 className="text-2xl font-bold">Your Saved Memes</h2>
      </div>

      {userId == null ? (
        <p className="text-gray-500 text-center py-8">No account detected</p>
      ) : memes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No saved memes yet</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {reversedmemes.map((meme) => (
              <Card
                key={meme.objectKey}
                isPressable
                onPress={() => {
                  setSelectedMeme(meme);
                  onOpen();
                }}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square relative bg-gray-100 h-full w-full">
                <img
                    src={meme.url}
                    alt="Saved meme"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click when deleting
                      Delete(meme.objectKey);
                    }}
                    className=""
                    variant="flat"
                    color="danger"
                    radius="lg"
                    size="md"
                    isIconOnly
                  >
                    <MdDelete />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Modal moved outside the map */}
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    View Meme
                  </ModalHeader>
                  <ModalBody>
                    {selectedMeme && (
                      <img
                        src={selectedMeme.url}
                        alt="Selected meme"
                        className="w-full h-auto"
                      />
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </div>
  );
}
