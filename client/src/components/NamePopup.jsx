import React, { useState } from "react";

const NamePopup = ({ joinWithUserName }) => {
  const [userName, setUserName] = useState("");

  const handleConfirm = () => {
    if (userName.trim() !== "") {
      joinWithUserName(userName);
      console.log(userName);
      // Redirect or trigger navigation to the lobby
      // You can use React Router or any navigation method here
      // Example: history.push("/lobby");
    }
  };

  return (
    <div className="popup-container text-white m-auto flex flex-col gap-4 md:w-1/3 lg:w-1/4 w-4/5 ">
      <h1 className="font-bold text-center text-lg">Welcome to Zoomify</h1>
      <p className="text-stone-200 text-center">
        To enhance your video chatting experience, please provide a username.
        This will help others find and connect with you during the video chat.
      </p>
      <hr></hr>
      <div className="popup bg-slate-800 p-4 rounded-lg flex flex-col gap-2">
        <h2>Choose Your Name</h2>
        <div className="flex flex-col w-full gap-2 ">
          <input
            className="rounded-md p-2 text-black"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
          />
          <button
            className="rounded-md p-2 bg-blue-500"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default NamePopup;
