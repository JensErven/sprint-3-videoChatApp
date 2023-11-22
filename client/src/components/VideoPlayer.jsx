import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faDesktop,
  faHandsBound,
  faMicrophone,
  faMicrophoneLinesSlash,
  faMicrophoneSlash,
  faSchoolCircleExclamation,
  faShareAltSquare,
  faStream,
  faTrashRestoreAlt,
  faUserAlt,
  faUserCircle,
  faVideo,
  faVideoSlash,
  faVolumeControlPhone,
  faVolumeDown,
  faVolumeMute,
  faVolumeOff,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";

const VideoPlayer = ({
  personMuted,
  ownCameraOff,
  callDuration,
  setCallDuration,
}) => {
  const {
    myVideo,
    call,
    name,
    userVideo,
    stream,
    callAccepted,
    callEnded,
    socket,
    userMutedSelf,
    userCameraOff,
  } = useContext(SocketContext);

  // useStates for the timer
  const [callStartTime, setCallStartTime] = useState(null);

  useEffect(() => {
    if (stream && myVideo.current && ownCameraOff === false) {
      myVideo.current.srcObject = stream;
    }
  }, [stream, myVideo, ownCameraOff]);

  useEffect(() => {
    if (stream && userVideo.current && userCameraOff === false) {
      userVideo.current.srcObject = stream;
    }
  }, [stream, userVideo, userCameraOff]);
  useEffect(() => {
    // Broadcast the muted status to other users
    socket.emit("userCameraStatus", { isCameraOff: ownCameraOff });
  });

  useEffect(() => {
    let timerInterval;

    if (callAccepted && !callEnded) {
      setCallStartTime(Date.now()); // Record call start time
      timerInterval = setInterval(() => {
        setCallDuration((prevDuration) => prevDuration + 1); // Increment duration every second
      }, 1000);
    } else {
      clearInterval(timerInterval); // Clear the interval when call ends
      setCallStartTime(null);
      setCallDuration(0);
    }

    return () => {
      clearInterval(timerInterval); // Clean up the interval on unmount or dependency change
    };
  }, [callAccepted, callEnded]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };
  return (
    <div className="flex flex-col justify-center gap-y-2  items-center px-4 h-[80%]  ">
      {stream && (
        <div className="lg:w-1/2 w-full xl:w-1/2 md:w-1/2 h-1/2 ">
          <div className="bg-[#06090F] flex flex-col rounded-md relative  h-full">
            <div className="absolute bg-slate-900 top-1 right-1 justify-center items-center flex flex-row z-50 rounded-tr-3xl rounded-bl-3xl rounded-tl-md  rounded-br-md px-4 py-2 text-stone-200 gap-2">
              {" "}
              <span className="text-slate-600 font-bold">(You) </span>
              {name || "Name"} <FontAwesomeIcon icon={faUserCircle} />
            </div>

            {!ownCameraOff ? (
              <video
                playsInline
                muted
                autoPlay
                ref={myVideo}
                className="w-full  -scale-x-100 object-cover rounded-t-3xl  rounded-b-md h-full bg-slate-600"
              />
            ) : (
              <div className="h-[40vh] bg-slate-600 w-full rounded-t-3xl rounded-b-md flex flex-row items-center justify-center">
                <FontAwesomeIcon
                  icon={faVideoSlash}
                  fontSize={50}
                  className="text-slate-700"
                />
              </div>
            )}
          </div>
        </div>
      )}
      {callAccepted && !callEnded && (
        <div className="lg:w-1/2 w-full xl:w-1/2 md:w-1/2  h-1/2 ">
          <div className="bg-[#06090F] flex flex-col relative h-full">
            <div className="absolute bg-slate-900 bottom-1 left-1 justify-center items-center flex flex-row z-50 rounded-bl-3xl rounded-tr-3xl rounded-tl-md rounded-br-md px-4 py-2 text-stone-200 gap-2">
              <FontAwesomeIcon icon={faUserCircle} fontSize={25} />
              {call.name || "Name"}
              <div className="w-0.5 h-4 bg-stone-200"></div>
              <span className="flex flex-row items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {callDuration > 0 ? formatTime(callDuration) : "00:00:00"}
              </span>
            </div>

            {!userCameraOff ? (
              <>
                {personMuted || userMutedSelf ? (
                  <video
                    playsInline
                    autoPlay
                    ref={userVideo}
                    className="w-full rounded-b-3xl -scale-x-100 object-cover rounded-t-md  h-full bg-slate-600 "
                    muted // Apply the 'muted' attribute when personMuted is true
                  />
                ) : (
                  <video
                    playsInline
                    autoPlay
                    ref={userVideo}
                    className="w-full rounded-b-3xl -scale-x-100 object-cover   rounded-t-md  h-full bg-slate-600"
                  />
                )}
              </>
            ) : (
              <div className="h-[40vh] bg-slate-600 w-full  rounded-t-md   rounded-b-3xl  flex flex-row items-center justify-center">
                <FontAwesomeIcon
                  icon={faVideoSlash}
                  fontSize={50}
                  className="text-slate-700"
                />
              </div>
            )}

            <div className="absolute bottom-2 right-2 flex flex-row gap-2">
              {" "}
              {userMutedSelf && (
                <div className=" bg-[rgb(30,41,59,0.6)] w-12 h-12 rounded-full flex items-center justify-center">
                  {" "}
                  <FontAwesomeIcon
                    icon={faMicrophoneSlash}
                    color="white"
                    fontSize={20}
                  />
                </div>
              )}
              {userCameraOff && (
                <div className=" bg-[rgb(30,41,59,0.6)] w-12 h-12 rounded-full flex items-center justify-center ">
                  {" "}
                  <FontAwesomeIcon
                    icon={faVideoSlash}
                    color="white"
                    fontSize={20}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default VideoPlayer;
