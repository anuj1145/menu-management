import React, { useState, useEffect } from "react";
import StatusBar from "./StatusBar";

const MenuItem = ({ item, onDelete, onEdit, isOpen, toggleOpen }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);

  const handleSave = () => {
    onEdit(item.id, editedTitle);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(item.title);
    setIsEditing(false);
  };

  return (
    <li>
      <div className="flex items-center justify-between">
        {isEditing ? (
          <div className="flex flex-col">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="border border-gray-300 rounded-md p-1"
            />
            <div className="flex justify-start space-x-4 mt-2">
              <button
                className="text-blue-600 text-sm px-1 py-1"
                onClick={handleSave}
              >
                Update
              </button>
              <button
                className="text-gray-600 text-sm px-1 py-1"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="text-base px-2 py-5">{item.title}</span>
            {item.children && item.children.length > 0 && (
              <button
                className="text-gray-600 text-sm px-1 py-1"
                onClick={toggleOpen}
              >
                {isOpen ? "▲" : "▼"}
              </button>
            )}
            <button
              className="text-red-600 ml-2 text-sm px-1 py-1"
              onClick={() => onDelete(item.id)}
            >
              Delete
            </button>
            <button
              className="text-blue-600 ml-2 text-sm px-1 py-1"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </>
        )}
      </div>
      {isOpen && item.children && (
        <ul className="ml-6">
          {item.children.map((child) => (
            <MenuItem
              key={child.id}
              item={child}
              onDelete={onDelete}
              onEdit={onEdit}
              isOpen={isOpen}
              toggleOpen={toggleOpen}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const MenuComponent = () => {
  const [menus, setMenus] = useState([]); // State to store menus
  const [menuItems, setMenuItems] = useState([]); // State to store menu items
  const [parentId, setParentId] = useState(""); // State for parent menu item
  const [depth, setDepth] = useState(1); // State for depth
  const [title, setTitle] = useState(""); // State for title (menu item name)
  const [menuId, setMenuId] = useState(""); // State for selected menu
  const [selectedMenu, setSelectedMenu] = useState(null); // State to store the selected menu object
  const [openItems, setOpenItems] = useState({}); // State to track open/closed items

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch(
          "http://menu-system.infinityfreeapp.com/api/menus"
        );
        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };
    fetchMenus();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          "http://menu-system.infinityfreeapp.com/api/submenus"
        );
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  //   // Handle deleting a menu item
  const handleDeleteItem = (id) => {
    fetch(`http://menu-system.infinityfreeapp.com/api/menu-items/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete menu item");
        }
        setMenuItems(menuItems.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting menu item:", error);
      });
  };

  // Handle editing a menu item
  const handleEditItem = (id, newTitle) => {
    fetch(`http://menu-system.infinityfreeapp.com/api/menu-items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTitle }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update menu item");
        }
        return response.json();
      })
      .then((updatedItem) => {
        setMenuItems((prevItems) =>
          prevItems.map((item) => (item.id === id ? updatedItem : item))
        );
        alert("Menu item updated successfully");
      })
      .catch((error) => {
        console.error("Error updating menu item:", error);
        alert("Failed to update menu item");
      });
  };

  const handleMenuChange = (e) => {
    const selectedId = e.target.value;
    setMenuId(selectedId);
    const selected = menus.find((menu) => menu.id === parseInt(selectedId));
    setSelectedMenu(selected || null);
    setParentId(""); // Reset parent selection when menu changes
  };

  const handleAddMenuItem = (e) => {
    e.preventDefault();

    if (!title) {
      alert("Please fill in the title");
      return;
    }

    const newDepth = parentId
      ? menuItems.find((item) => item.id === parseInt(parentId))?.depth + 1
      : depth;

    if (!menuId) {
      let name = title;
      fetch("http://menu-system.infinityfreeapp.com/api/menus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })
        .then((response) =>
          response.ok ? response.json() : Promise.reject("Failed to add menu")
        )
        .then((newMenu) => {
          alert("Menu added successfully");
          setMenus((prevMenus) => [...prevMenus, newMenu]);
          setTitle("");
        })
        .catch((error) => alert(error));
    } else {
      fetch("http://menu-system.infinityfreeapp.com/api/menu-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          parent_id: parentId || null,
          depth: newDepth,
          menu_id: menuId,
        }),
      })
        .then((response) =>
          response.ok
            ? response.json()
            : Promise.reject("Failed to add menu item")
        )
        .then((newItem) => {
          alert("Menu item added successfully");
          setMenuItems((prevItems) => [...prevItems, newItem]);
          setTitle("");
          setParentId("");
        })
        .catch((error) => alert(error));
    }
  };

  // hierrachy code
  const buildHierarchy = (menuItems) => {
    const map = {};
    const roots = [];
    menuItems.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });
    menuItems.forEach((item) => {
      if (item.parent_id) {
        if (map[item.parent_id]) {
          map[item.parent_id].children.push(map[item.id]);
        }
      } else {
        roots.push(map[item.id]);
      }
    });
    return roots;
  };

  // Function to toggle individual item open/closed
  const toggleOpen = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the open state for the item
    }));
  };

  const filteredParents = menuItems.filter(
    (item) => item.menu_id === parseInt(menuId)
  );
  // Function to toggle all items open/closed
  const toggleAll = (open) => {
    const newOpenItems = {};
    menuItems.forEach((item) => {
      newOpenItems[item.id] = open; // Set open state for each item
    });
    setOpenItems(newOpenItems); // Update the open items state
  };

  return (
    <>
      <StatusBar />
      <div className="mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 text-black max-w-full h-full">
        <div className="col-span-1">
          {/* collapse all and expand all */}
          <div className="flex mb-2">
            <button
              className="w-full sm:w-auto py-2 px-4 text-sm bg-black text-white font-semibold rounded-md shadow-lg hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-150 ease-in-out"
              onClick={() => toggleAll(true)} // Expand all
            >
              Expand All
            </button>
            <button
              className="w-full sm:w-auto py-2 px-4 text-sm bg-white text-black font-semibold rounded-md shadow-lg hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-150 ease-in-out"
              onClick={() => toggleAll(false)} // Collapse all
            >
              Collapse All
            </button>
          </div>

          {menus.map((menu) => {
            const hierarchy = buildHierarchy(
              menuItems.filter((item) => item.menu_id === menu.id)
            );

            return (
              <div key={menu.id}>
                <h4 className="text-lg font-semibold">
                  {menu.name}
                  {/* Show the expand/collapse button only if there are menu items */}
                  {hierarchy.length > 0 && (
                    <button
                      className="text-gray-600 text-sm px-1 py-1"
                      onClick={() => toggleOpen(menu.id)}
                    >
                      {openItems[menu.id] ? "▲" : "▼"}
                    </button>
                  )}
                </h4>
                {/* Render the menu items if the menu is expanded */}
                {openItems[menu.id] && hierarchy.length > 0 && (
                  <ul className="tree mt-2">
                    {hierarchy.map((item) => (
                      <MenuItem
                        key={item.id}
                        item={item}
                        onDelete={handleDeleteItem}
                        onEdit={handleEditItem}
                        isOpen={openItems[item.id]}
                        toggleOpen={() => toggleOpen(item.id)}
                      />
                    ))}
                  </ul>
                )}
              </div>
            );
          })}


        </div>
        <div className="col-span-2">
          <form className="space-y-5 text-left" onSubmit={handleAddMenuItem}>
            <div className="w-full">
              <label className="block text-xxl font-medium text-left">
                Menu
              </label>
              <select
                value={menuId}
                onChange={handleMenuChange}
                className="w-full border border-gray-300 rounded-md p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                <option value="">Select Menu</option>
                {menus.map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedMenu && (
              <div className="flex flex-col space-y-4">
                <div className="w-full">
                  <label className="block text-xxl font-medium text-left">
                    Menu ID
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={selectedMenu.id}
                    className="w-full border border-gray-300 rounded-md p-3 bg-gray-200 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="w-full">
              <label className="block text-xxl font-medium text-left">
                Parent
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="border rounded-md p-2 w-full"
                disabled={!menuId}
              >
                <option value="">Select a parent (optional)</option>
                {filteredParents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label className="block text-xxl font-medium text-left">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              />
            </div>

            <div className="w-full text-left space-y-2">
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white rounded-md px-4 py-2"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MenuComponent;
