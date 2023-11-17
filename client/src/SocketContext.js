import React, { createContext, useState, useRef, useEffect } from "react";

import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io("http://localhost:5000");

const ContextProvider = ({ children }) => {
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [userMutedSelf, setUserMutedSelf] = useState(false);
  const [userCameraOff, setUserCameraOff] = useState(false);
  const [name, setName] = useState("");
  const [reloadPage, setReloadPage] = useState(false); // State to control reload

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });
    socket.on("me", (id) => setMe(id));
    socket.on("calluser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });
    socket.on("reloadPage", () => {
      setReloadPage(true); // Set the state to trigger reload
    });
    socket.on("userMutedChanged", ({ isMuted }) => {
      // Update the video properties based on received status
      // For example, mute/unmute the video based on 'isMuted'
      if (isMuted) {
        setUserMutedSelf(isMuted);
      } else {
        setUserMutedSelf(false);
      }
    });
    socket.on("userCameraChanged", ({ isCameraOff }) => {
      if (isCameraOff) {
        setUserCameraOff(isCameraOff);
      } else {
        setUserCameraOff(false);
      }
    });
  }, []);

  useEffect(() => {
    if (reloadPage) {
      window.location.reload(); // Reload the page when 'reloadPage' is true
    }
  }, [reloadPage]);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: call.from });
    });
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });
    peer.signal(call.signal);
    connectionRef.current = peer;
  };
  const callUser = (id) => {
    // with initiator we indicate who is the caller
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("calluser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callaccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    // Emit an event to the backend when leaving the call
    socket.emit("leaveCall");
    // Properly destroy the connection
    // if (connectionRef.current) {
    //   connectionRef.current.destroy();
    // }
    // Reload the page
    // Set reload to true to trigger the reload process
    setReloadPage(true);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        userMutedSelf,
        userCameraOff,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
