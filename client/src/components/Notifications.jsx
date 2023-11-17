import React, { useContext } from "react";
import { SocketContext } from "../SocketContext";
const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);
  return (
    <>
      {call.isReceivedCall && !callAccepted && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <h1>{call.name} is calling:</h1>
          <button onClick={answerCall} className="bg-blue-500 p-2 rounded-lg">
            Answer
          </button>
        </div>
      )}
    </>
  );
};

export default Notifications;
