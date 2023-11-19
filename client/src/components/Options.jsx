import React, { useContext, useState, useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import io from "socket.io-client";

import {
  faCopy,
  faPhone,
  faPhoneFlip,
} from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from "../SocketContext";
const Options = ({ children }) => {
  const { me, callAccepted, name, setName, leaveCall, callUser, callEnded } =
    useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");
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
    <div className="flex justify-center text-white flex-col items-center gap-4">
      <div className="bg-slate-700 rounded-lg p-4">
        <form noValidate autoComplete="off">
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-y-4">
              <p>Account info</p>
              <input
                placeholder="name"
                className="text-black p-2 rounded-lg"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
              {console.log(me)}
              <CopyToClipboard
                text={me}
                className="bg-blue-500 flex flex-row p-2 items-center gap-2 rounded-lg justify-center"
              >
                <button className="" formNoValidate type="button">
                  <FontAwesomeIcon icon={faCopy} />
                  <p>Copy your ID</p>
                </button>
              </CopyToClipboard>
            </div>
            <div className="flex flex-col gap-y-4">
              <p>Make a call</p>
              <input
                placeholder="add an ID"
                className="text-black p-2 rounded-lg"
                type="text"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
              ></input>
              {callAccepted && !callEnded ? (
                <button
                  type="button"
                  className="flex flex-row p-2 items-center gap-2 rounded-lg justify-center bg-red-500"
                  onClick={leaveCall}
                >
                  <FontAwesomeIcon icon={faPhoneFlip} />
                  Hang up
                </button>
              ) : (
                <button
                  type="button"
                  className="flex flex-row p-2 items-center gap-2 rounded-lg justify-center  bg-green-500"
                  onClick={() => callUser(idToCall)}
                >
                  <FontAwesomeIcon icon={faPhone} /> Call
                </button>
              )}
            </div>
          </div>
        </form>
        {children}
      </div>
    </div>
  );
};

export default Options;
