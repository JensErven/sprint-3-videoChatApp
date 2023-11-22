import {
  fa3,
  faBars,
  faClapperboard,
  faHamburger,
  faMobileButton,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
/**bg-[#06090F] */
const AppBar = () => {
  return (
    <div className="w-full flex flex-row justify-between   items-center h-[10%] pl-4">
      <button onClick={console.log("open navigation menu")}>
        <FontAwesomeIcon
          icon={faBars}
          className="text-stone-200"
          fontSize={25}
        />
      </button>
    </div>
  );
};

export default AppBar;
