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

const VideoPlayer = () => {
  const [personMuted, setPersonMuted] = useState(false);

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
  const [mutedSelf, setMutedSelf] = useState(false);
  const [ownCameraOff, setOwnCameraOff] = useState(false);

  useEffect(() => {
    if (
      stream &&
      myVideo.current &&
      userCameraOff === false &&
      ownCameraOff === false &&
      userVideo.current
    ) {
      myVideo.current.srcObject = stream; // Reassign the stream when camera is turned back on
      userVideo.current.srcObject = stream;
    }
  }, [stream, myVideo, userCameraOff, ownCameraOff, userVideo]);
  useEffect(() => {
    // Broadcast the muted status to other users
    socket.emit("userMutedStatus", { isMuted: mutedSelf });
  }, [mutedSelf, socket]);

  useEffect(() => {
    // Broadcast the muted status to other users
    socket.emit("userCameraStatus", { isCameraOff: ownCameraOff });
  });
  return (
    <div className="flex flex-col lg:flex-row justify-center p-8 gap-4  items-center">
      {stream && (
        <div className="lg:w-1/2 w-full ">
          <div className="bg-slate-800 flex flex-col rounded-md relative">
            <div className="bg-slate-800 px-4 py-2 text-white rounded-t-md flex flex-row justify-between">
              <div className="flex flex-row gap-2 items-center justify-center">
                <FontAwesomeIcon icon={faUserCircle} />
                (You) {name || "Name"}
              </div>
              <div className="flex flex-row items-center gap-4">
                <button
                  onClick={() => setMutedSelf(!mutedSelf)}
                  type="button"
                  className="w-10 h-10 rounded-full bg-slate-600 flex flex-row items-center justify-center"
                >
                  {mutedSelf ? (
                    <FontAwesomeIcon icon={faMicrophoneSlash} color="white" />
                  ) : (
                    <FontAwesomeIcon icon={faMicrophone} color="white" />
                  )}
                </button>
                <button
                  onClick={() => setOwnCameraOff(!ownCameraOff)}
                  type="button"
                  className="w-10 h-10 rounded-full bg-slate-600 flex flex-row items-center justify-center"
                >
                  {ownCameraOff ? (
                    <FontAwesomeIcon icon={faVideoSlash} color="white" />
                  ) : (
                    <FontAwesomeIcon icon={faVideo} color="white" />
                  )}
                </button>
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-slate-600 flex flex-row items-center justify-center"
                >
                  <FontAwesomeIcon icon={faDesktop} color="white" />
                </button>
              </div>
            </div>
            {!ownCameraOff ? (
              <video
                playsInline
                muted
                autoPlay
                ref={myVideo}
                className="w-full rounded-b-md -scale-x-100 object-cover lg:h-[350px] h-[275px]"
              />
            ) : (
              <div className="lg:h-[350px] h-[275px] w-full bg-slate-500 rounded-b-md flex items-center justify-center">
                <div className="flex items-center justify-center">
                  {" "}
                  <FontAwesomeIcon
                    icon={faVideoSlash}
                    className="text-slate-700"
                    fontSize={50}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {callAccepted && !callEnded && (
        <div className="lg:w-1/2 w-full">
          <div className="bg-slate-800 flex flex-col rounded-md relative">
            <div className="bg-slate-800 px-4 py-2 text-white rounded-t-md flex flex-row justify-between">
              <div className="flex flex-row gap-2 items-center justify-center">
                <FontAwesomeIcon icon={faUserCircle} />
                {call.name || "Name"}
              </div>
              <div className="flex flex-row items-center gap-4">
                <button
                  onClick={() => setPersonMuted(!personMuted)}
                  type="button"
                  className="w-10 h-10 rounded-full bg-slate-600 flex flex-row items-center justify-center"
                >
                  {personMuted ? (
                    <FontAwesomeIcon icon={faVolumeMute} color="white" />
                  ) : (
                    <FontAwesomeIcon icon={faVolumeUp} color="white" />
                  )}
                </button>
              </div>
            </div>
            {!userCameraOff ? (
              <>
                {personMuted || userMutedSelf ? (
                  <video
                    playsInline
                    autoPlay
                    ref={userVideo}
                    className="w-full rounded-b-md -scale-x-100 object-cover lg:h-[350px] h-[275px]"
                    muted // Apply the 'muted' attribute when personMuted is true
                  />
                ) : (
                  <video
                    playsInline
                    autoPlay
                    ref={userVideo}
                    className="w-full rounded-b-md -scale-x-100 object-cover lg:h-[350px] h-[275px]"
                  />
                )}
              </>
            ) : (
              <div className="lg:h-[350px] h-[275px] w-full bg-slate-500 rounded-b-md flex items-center justify-center">
                <div className="flex items-center justify-center">
                  {" "}
                  <FontAwesomeIcon
                    icon={faVideoSlash}
                    className="text-slate-700"
                    fontSize={50}
                  />
                </div>
                <video
                  playsInline
                  autoPlay
                  ref={userVideo}
                  className="w-full rounded-b-md -scale-x-100 hidden object-cover lg:h-[350px] h-[275px]"
                />
              </div>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-row gap-2">
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
