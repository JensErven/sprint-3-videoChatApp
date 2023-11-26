import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOut,
  faSpinner,
  faSearch,
  faUser,
  faPhone,
  faCopy,
  faVideoCamera,
} from "@fortawesome/free-solid-svg-icons";
import UsersList from "./lobby/UsersList";
import CopyToClipboard from "react-copy-to-clipboard";

import Notifications from "./Notifications";

export const Lobby = () => {
  const {
    users,
    me,
    disconnect,
    answerCall,
    call,
    callAccepted,
    callUser,
    callingWith,
  } = useContext(SocketContext);
  const [copied, setCopied] = useState(false);

  const [idToCall, setIdToCall] = useState("");

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000); // Reset the copied state after 1.5 seconds
  };

  return (
    <div className="absolute flex flex-col w-screen h-screen  z-[1000] bg-[#FFFFFF] text-[#080B16] gap-4">
      <div className="welcome flex flex-row justify-between items-center py-4 px-4 border-b-2">
        <p className="text-3xl font-semibold">Welcome</p>

        <div className="flex flex-row items-center justify-center gap-4 font-bold">
          <p className="text-xl">{me.name}</p>
          <button
            className=" bg-[#FF453A]  flex items-center justify-center w-14 h-14 rounded-full"
            onClick={disconnect}
          >
            <FontAwesomeIcon
              fontSize={25}
              icon={faSignOut}
              className="text-stone-200 bg-transparent "
            />
          </button>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {call.isReceivedCall && !callAccepted && (
          <div className="flex justify-between items-center gap-4 mt-10 bg-[#080B16] text-stone-100 rounded-full p-4 shadow-xl">
            <div className="flex flex-row gap-4">
              {" "}
              <FontAwesomeIcon
                icon={faUser}
                fontSize={15}
                className="bg-[#cfcdcd] text-stone-400 p-2 rounded-full w-10 h-10 flex items-center justify-center"
              />
              {/* <h1>{call.name}</h1> */}
              <div className="flex flex-col items-start justify-center animate-pulse">
                <h1 className="font-bold text-lg">
                  {callingWith.name ? callingWith.name : "Unknown"}
                </h1>
                <span className="text-stone-500 ">calling...</span>
              </div>
            </div>

            <button
              onClick={answerCall}
              className="hover:bg-[#349662] ease-in-out bg-[#41BB7A]  p-2 rounded-full w-11 h-11"
            >
              <FontAwesomeIcon icon={faVideoCamera} fontSize={15} />
            </button>
          </div>
        )}
        <div className="options w-full h-40 bg-[#F2F2F2] rounded-3xl  flex flex-row justify-between items-center p-4 gap-4 text-stone-100">
          <CopyToClipboard
            onCopy={handleCopy}
            text={me.id}
            className="bg-purple-700 flex flex-col p-2 items-center gap-2 rounded-3xl justify-center text-stone-100 w-1/3 h-full"
          >
            <button className="" formNoValidate type="button">
              <FontAwesomeIcon icon={faCopy} />
              <p>{copied ? "Copied!" : "Copy your ID"}</p>
            </button>
          </CopyToClipboard>
          <div className="w-2/3 flex flex-col gap-2 items-stretch justify-between">
            <input
              className="w-full h-14 px-4 flex flex-row gap-4 items-center justify-between bg-[#FFFFFF] rounded-full text-stone-900"
              placeholder="Paste userID to call..."
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
            ></input>
            <button
              className="w-full hover:bg-[#349662] ease-in-out bg-[#41BB7A] h-14 p-2 rounded-full flex flex-row gap-4 items-center justify-center"
              onClick={() => callUser(idToCall)}
            >
              Call user <FontAwesomeIcon icon={faVideoCamera} />
            </button>
          </div>
        </div>
        <hr className="border-[1.5px] rounded-full bg-[#F2F2F2]"></hr>
        <div className="userslist ">
          <UsersList users={users} />
        </div>
      </div>
    </div>
  );
};
