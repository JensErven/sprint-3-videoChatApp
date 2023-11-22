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
  faMessage,
  faMicrophone,
  faVideo,
  faVideoCamera,
  faVolumeOff,
  faVolumeUp,
  faVolumeXmark,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import InCallOptions from "./components/InCallOptions";
import Chat from "./components/Chat";
function App() {
  const { me, callAccepted, name, setName, leaveCall, callUser, callEnded } =
    useContext(SocketContext);
  const [personMuted, setPersonMuted] = useState(false); // State to manage personMuted
  const [ownCameraOff, setOwnCameraOff] = useState(false); // State to manage personMuted
  const [openChat, setOpenChat] = useState(false);
  const [chatZIndex, setChatZIndex] = useState(0);
  const [callDuration, setCallDuration] = useState(0); // State for call duration

  useEffect(() => {
    console.log(openChat);
  }, [openChat]);

  useEffect(() => {
    // Set z-index based on chat open/close
    setChatZIndex(openChat ? 999 : 0);
  }, [openChat]);
  return (
    <div className="App  relative h-[100vh] flex flex-col overflow-y-hidden">
      <AppBar />
      <VideoPlayer
        setCallDuration={setCallDuration}
        personMuted={personMuted}
        ownCameraOff={ownCameraOff}
        callDuration={callDuration}
      />{" "}
      {/* Pass personMuted as a prop */}
      {callAccepted && !callEnded ? (
        <InCallOptions
          setOpenChat={setOpenChat}
          openChat={openChat}
          setPersonMuted={setPersonMuted}
          personMuted={personMuted}
          ownCameraOff={ownCameraOff}
          setOwnCameraOff={setOwnCameraOff}
        />
      ) : (
        <Options>
          <Notifications />
        </Options>
      )}
      {openChat && (
        <Chat
          callDuration={callDuration}
          setOpenChat={setOpenChat}
          openChat={openChat}
          style={{ zIndex: chatZIndex }}
        />
      )}
    </div>
  );
}

export default App;
