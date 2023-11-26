import "./App.css";
import VideoPlayer from "./components/VideoPlayer";
import Options from "./components/Options";
import Notifications from "./components/Notifications";
import AppBar from "./components/shared/AppBar";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./SocketContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faCircleDot,
  faMessage,
  faMicrophone,
  faSpinner,
  faVideo,
  faVideoCamera,
  faVolumeOff,
  faVolumeUp,
  faVolumeXmark,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import InCallOptions from "./components/InCallOptions";
import Chat from "./components/Chat";
import NamePopup from "./components/NamePopup";
import { Lobby } from "./components/Lobby";
function App() {
  const [showPopup, setShowPopup] = useState(true);

  const {
    me,
    callAccepted,
    name,
    setName,
    leaveCall,
    callUser,
    callEnded,
    joinWithUserName,
    calling,
  } = useContext(SocketContext);
  const [personMuted, setPersonMuted] = useState(false); // State to manage personMuted
  const [ownCameraOff, setOwnCameraOff] = useState(false); // State to manage personMuted
  const [openChat, setOpenChat] = useState(false);
  const [chatZIndex, setChatZIndex] = useState(0);
  const [callDuration, setCallDuration] = useState(0); // State for call duration
  const [showVideoCall, setShowVideoCall] = useState(false);
  useEffect(() => {
    console.log(openChat);
  }, [openChat]);

  useEffect(() => {
    // Set z-index based on chat open/close
    setChatZIndex(openChat ? 999 : 0);
  }, [openChat]);

  const handleJoinWithUserName = (userName) => {
    // Save the user's name in localStorage
    console.log(userName);
    joinWithUserName({ userName });
    setShowPopup(false);
  };
  return (
    <>
      <div className="App  relative h-[100vh] flex flex-col overflow-y-hidden">
        {showPopup && <NamePopup joinWithUserName={handleJoinWithUserName} />}
        {!showPopup && (
          <>
            {!showVideoCall && !calling && <Lobby />}
            {/* <AppBar /> */}
            {}
            <VideoPlayer
              setCallDuration={setCallDuration}
              personMuted={personMuted}
              ownCameraOff={ownCameraOff}
              callDuration={callDuration}
            />{" "}
            {/* Pass personMuted as a prop */}
            {!callAccepted && (
              <div className="text-[#1A1C22] ] flex items-center justify-center mb-40">
                <FontAwesomeIcon
                  icon={faSpinner}
                  fontSize={50}
                  className="animate-spin "
                />
              </div>
            )}
            {!callEnded && (
              <InCallOptions
                setOpenChat={setOpenChat}
                openChat={openChat}
                setPersonMuted={setPersonMuted}
                personMuted={personMuted}
                ownCameraOff={ownCameraOff}
                setOwnCameraOff={setOwnCameraOff}
              />
            )}
            {openChat && (
              <Chat
                callDuration={callDuration}
                setOpenChat={setOpenChat}
                openChat={openChat}
                style={{ zIndex: chatZIndex }}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default App;
