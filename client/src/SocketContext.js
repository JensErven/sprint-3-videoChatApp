import React, { createContext, useState, useRef, useEffect } from "react";

import io from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();
const isDevelopment = false;
const socketURL = isDevelopment
  ? "http://localhost:5000"
  : "https://videochat-backend.onrender.com";
const socket = io(socketURL);

const ContextProvider = ({ children }) => {
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState({});
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [userMutedSelf, setUserMutedSelf] = useState(false);
  const [userCameraOff, setUserCameraOff] = useState(false);
  const [name, setName] = useState("");
  const [reloadPage, setReloadPage] = useState(false); // State to control reload
  const [communicatingWith, setCommunicatingWith] = useState(null);
  const [users, setUsers] = useState([]);
  const [calling, setCalling] = useState(false);
  const [callingWith, setCallingWith] = useState({});
  const [newMessage, setNewMessage] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });
    socket.on("me", (user) => {
      console.log(user.name);

      setMe(user);
    });
    socket.on("calluser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });
    socket.on("message", setNewMessage(true));
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
    socket.on("users", (updatedUsers) => {
      setUsers(updatedUsers);
    });

    socket.on("callingwith", ({ name, id }) => {
      setCallingWith({ name: name, id: id });
    });
  }, []);

  useEffect(() => {
    console.log(users);
  }, [users]);

  useEffect(() => {
    if (reloadPage) {
      window.location.reload(); // Reload the page when 'reloadPage' is true
    }
  }, [reloadPage]);

  const answerCall = () => {
    setCallAccepted(true);
    setCalling(true);
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
    setCommunicatingWith(id); // Set the user you're communicating with
    setCalling(true);
    // with initiator we indicate who is the caller
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("calluser", {
        userToCall: id,
        signalData: data,
        from: me.id,
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
    setCalling(false);
    // Emit an event to the backend when leaving the call
    socket.emit("leaveCall", { user1: me.id, user2: callingWith.id });
    // Properly destroy the connection
    // if (connectionRef.current) {
    //   connectionRef.current.destroy();
    // }
    // Reload the page
    // Set reload to true to trigger the reload process
    setReloadPage(true);
  };

  // Update the message sending to use the state value
  const sendMessage = (message, callingWith, communicatingWith) => {
    socket.emit("message", {
      callingWith: callingWith,
      message,
      sender: me.id,
    });

    // ... (other code)
  };

  const joinWithUserName = (userName) => {
    socket.emit("join", userName);
  };

  const disconnect = () => {
    setCalling(false);
    socket.disconnect();
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        users,
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
        communicatingWith,
        joinWithUserName,
        sendMessage,
        disconnect,
        calling,
        callingWith,
        newMessage,
        setNewMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
