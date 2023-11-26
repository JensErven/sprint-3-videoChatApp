import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../SocketContext";
import { io } from "socket.io-client";

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
  faVolumeMute,
  faXmark,
  faMicrophoneSlash,
  faVideoSlash,
  faExclamation,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

const InCallOptions = ({
  setPersonMuted,
  personMuted,
  ownCameraOff,
  setOwnCameraOff,
  setOpenChat,
  openChat,
}) => {
  const [mutedSelf, setMutedSelf] = useState(false);

  const {
    me,
    callAccepted,
    name,
    setName,
    leaveCall,
    callUser,
    callEnded,
    socket,
    userCameraOff,
  } = useContext(SocketContext);

  useEffect(() => {
    // Broadcast the muted status to other users
    socket.emit("userMutedStatus", { isMuted: mutedSelf });
  }, [mutedSelf, socket]);

  useEffect(() => {
    // Broadcast the muted status to other users
    socket.emit("userCameraStatus", { isCameraOff: ownCameraOff });
  }, [socket, ownCameraOff]);
  useEffect(() => {
    const socket = io("http://localhost:5000");

    // Listen for 'reloadPage' event from the server
    socket.on("reloadPage", () => {
      // Reload the page when requested by the other user
      window.location.reload();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-row justify-around gap-2 p-8 absolute w-full bottom-0">
      <button
        className="bg-[#1A1C22] flex items-center justify-center w-14 h-14 rounded-full"
        onClick={() => setMutedSelf(!mutedSelf)}
      >
        {mutedSelf ? (
          <FontAwesomeIcon
            fontSize={25}
            icon={faMicrophoneSlash}
            className="text-stone-200 p-2"
          />
        ) : (
          <FontAwesomeIcon
            fontSize={25}
            icon={faMicrophone}
            className="text-stone-200 p-2"
          />
        )}
      </button>
      <button
        onClick={() => setPersonMuted(!personMuted)}
        type="button"
        className="bg-[#1A1C22] flex items-center justify-center w-14 h-14 rounded-full"
      >
        {personMuted ? (
          <FontAwesomeIcon icon={faVolumeMute} className="text-stone-200 p-2" />
        ) : (
          <FontAwesomeIcon icon={faVolumeUp} className="text-stone-200 p-2" />
        )}
      </button>
      <button
        disabled
        className="bg-[#1A1C22] flex items-center justify-center w-14 h-14 rounded-full"
        onClick={() => setOwnCameraOff(!ownCameraOff)}
      >
        {ownCameraOff ? (
          <FontAwesomeIcon icon={faVideoSlash} className="text-stone-200 p-2" />
        ) : (
          <FontAwesomeIcon icon={faVideo} className="text-stone-200 p-2" />
        )}
      </button>
      <button
        disabled
        className="bg-[#2E59F2] flex items-center justify-center w-14 h-14 rounded-full relative"
        onClick={() => setOpenChat(!openChat)}
      >
        <FontAwesomeIcon
          fontSize={25}
          icon={faMessage}
          className="text-stone-200 p-2"
        />
      </button>
      <button
        className="bg-[#FF453A] flex items-center justify-center w-14 h-14 rounded-full"
        onClick={leaveCall}
      >
        <FontAwesomeIcon
          fontSize={25}
          icon={faXmark}
          className="text-stone-200 p-2"
        />
      </button>
    </div>
  );
};

export default InCallOptions;
