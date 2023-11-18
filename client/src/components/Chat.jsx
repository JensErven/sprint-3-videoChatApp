import {
  faArrowLeft,
  faPaperPlane,
  faPlaneCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useContext, useEffect, useRef } from "react";
import { SocketContext } from "../SocketContext";

const Chat = ({ setOpenChat, openChat, style, callDuration }) => {
  const messagesEndRef = useRef(null);

  const { socket, sendMessage, communicatingWith } = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const handleSendMessage = (messageText) => {
    if (messageText !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: messageText.trim(), fromMe: true },
      ]);
      setMessage("");
      sendMessage(messageText.trim(), communicatingWith); // Pass the message text to the sendMessage function
    }
  };
  useEffect(() => {
    // Subscribe to the 'message' event when the component mounts
    const handleReceivedMessage = ({ message, from }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, fromMe: false },
      ]);
    };

    socket.on("message", handleReceivedMessage);

    // Unsubscribe from the 'message' event when the component unmounts
    return () => {
      socket.off("message", handleReceivedMessage);
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className="absolute h-[100vh] top-0 bg-[#06090F] right-0 w-full "
      style={style}
    >
      <div className="flex flex-row justify-between items-center p-4 ">
        <button onClick={() => setOpenChat(!openChat)}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            fontSize={25}
            className="text-stone-200"
          />
        </button>
        <div className=" w-fit z-50 flex flex-row items-center justify-center gap-2">
          <div className="w-0.5 h-4 bg-stone-200"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>

          <p className="text-stone-200">
            {callDuration > 0 ? formatTime(callDuration) : "00:00:00"}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        {" "}
        <div className="h-[80vh] mx-4 bg-[#1A1C22] rounded-t-3xl rounded-b-md px-2 py-2 overflow-y-scroll ">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2  text-stone-200 w-full mb-4 ${
                msg.fromMe ? "text-right " : "text-left  "
              }`}
            >
              <span
                className={`p-2 rounded-xl text-lg w-fit ${
                  msg.fromMe
                    ? "text-right bg-[#2E59F2] "
                    : "text-left bg-slate-500 "
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="h-[8vh] mx-4 bg-[#1A1C22] rounded-t-md rounded-b-3xl flex flex-row p-2 gap-2">
          <input
            className="w-3/4 rounded-md rounded-bl-2xl bg-[#31333a] px-4 text-stone-200"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="w-1/4 bg-[#2E59F2] rounded-md  rounded-br-2xl"
            onClick={() => handleSendMessage(message)}
          >
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="text-stone-200"
              fontSize={25}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
