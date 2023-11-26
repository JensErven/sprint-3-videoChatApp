import React, { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SocketContext } from "../../SocketContext";

import {
  faSignOut,
  faSpinner,
  faSearch,
  faUser,
  faVideoCamera,
} from "@fortawesome/free-solid-svg-icons";

const UsersList = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState(""); // State to hold search term
  const [filteredUsers, setFilteredUsers] = useState(users); // State to hold filtered users
  const { me, callUser } = useContext(SocketContext);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };
  return (
    <div className="flex flex-col gap-4">
      {" "}
      <h2 className="text-xl font-semibold">Users</h2>{" "}
      <div className="searchbar h-14 px-4 flex flex-row gap-4 items-center justify-between bg-[#F2F2F2] rounded-full">
        <FontAwesomeIcon
          icon={faSearch}
          fontSize={25}
          className="flex items-center justify-center text-stone-800 w-8"
        />
        <input
          className="w-full h-full bg-transparent"
          placeholder="Search by username"
          value={searchTerm}
          onChange={handleSearch}
        ></input>
      </div>
      {users.length > 1 ? (
        <>
          {filteredUsers.length < 1 ? (
            <p className="flex flex-col items-center justify-center">
              No search result
            </p>
          ) : (
            <ul className="text-stone-800 bg-[#F2F2F2] h-fit w-full flex flex-col gap-2 p-4 shadow-lg rounded-md">
              {filteredUsers.map((user, index) => (
                <>
                  {user.id === me.id ? (
                    <></>
                  ) : (
                    <li
                      key={index}
                      className="flex flex-row items-center justify-between  p-1 hover:rounded-md duration-150 ease-in-out"
                    >
                      <div className="flex items-center flex-row gap-2">
                        <FontAwesomeIcon
                          icon={faUser}
                          fontSize={25}
                          className="bg-[#cfcdcd] text-stone-400 p-2 rounded-md "
                        />
                        {user.name}
                      </div>

                      <button
                        className="hover:bg-[#349662] ease-in-out bg-[#41BB7A] items-center flex p-2 rounded-full text-stone-100 w-11 h-11 justify-center "
                        onClick={() => callUser(user.id)}
                      >
                        <FontAwesomeIcon icon={faVideoCamera} />
                      </button>
                    </li>
                  )}
                </>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p className="flex flex-col items-center justify-center">
          No other users online
        </p>
      )}
    </div>
  );
};

export default UsersList;
