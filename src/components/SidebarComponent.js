import React, { useState } from "react";
import { FaThLarge, FaFolder } from "react-icons/fa";
import ToggleIcon from "./ToggleIcon"; // Import the custom icon

const SidebarComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSystemsOpen, setIsSystemsOpen] = useState(false);
  const [isIconVisible, setIsIconVisible] = useState(true); // State to manage icon visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsIconVisible(!isSidebarOpen); // Hide icon when sidebar is opened
  };

  const toggleSystems = () => setIsSystemsOpen(!isSystemsOpen);

  return (
    <div
      className={`sidebar bg-black ${
        isSidebarOpen ? "w-64" : "w-16"
      } h-screen shadow-md transition-all duration-300`}
    >
      <div className="flex items-center">
        {/* Show icon when sidebar is closed */}
        {isIconVisible && (
          <img
            src="/icon.png" // The image path from the public folder
            alt="Toggle Sidebar"
            className="w-30 h-10 mt-4 filter invert"
          />
        )}

        {/* Sidebar toggle button */}
        <button
          onClick={toggleSidebar}
          className="text-white p-2 w-10 h-10 focus:outline-none hover:bg-gray-800 ml-5 relative z-10" 
        >
          <ToggleIcon />
        </button>
      </div>

      <ul className="space-y-2 p-4 mt-10">
        {/* Systems Menu */}
        <li>
          <button
            className="flex items-center w-full text-left p-2 text-white hover:bg-gray-800 rounded bg-black"
            onClick={toggleSystems}
          >
            <FaFolder className="mr-2 text-white" />
            {isSidebarOpen && <span>Systems</span>}
          </button>
          {isSidebarOpen && isSystemsOpen && (
            <ul className="ml-4 space-y-1 bg-black">
              <li>
                <button className="flex items-center w-full text-white p-2 hover:bg-gray-800 rounded bg-black">
                  <FaThLarge className="mr-2 text-white" />
                  {isSidebarOpen && <span>System Code</span>}
                </button>
              </li>
              <li>
                <button className="flex items-center w-full text-white p-2 hover:bg-gray-800 rounded bg-black">
                  <FaThLarge className="mr-2 text-white" />
                  {isSidebarOpen && <span>Properties</span>}
                </button>
              </li>
              <li>
                <button className="flex items-center w-full text-white p-2 hover:bg-gray-800 rounded bg-black">
                  <FaThLarge className="mr-2 text-white" />
                  {isSidebarOpen && <span>Menus</span>}
                </button>
              </li>
              <li>
                <button className="flex items-center w-full text-white p-2 hover:bg-gray-800 rounded bg-black">
                  <FaThLarge className="mr-2 text-white" />
                  {isSidebarOpen && <span>API List</span>}
                </button>
              </li>
            </ul>
          )}
        </li>

        {/* Users Menu */}
        <li>
          <button className="flex items-center w-full text-left p-2 text-white hover:bg-gray-800 rounded bg-black">
            <FaFolder className="mr-2 text-white" />
            {isSidebarOpen && <span>Users and Groups</span>}
          </button>
        </li>

        {/* Competition Menu */}
        <li>
          <button className="flex items-center w-full text-left p-2 text-white hover:bg-gray-800 rounded bg-black">
            <FaFolder className="mr-2 text-white" />
            {isSidebarOpen && <span>Competition</span>}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SidebarComponent;
