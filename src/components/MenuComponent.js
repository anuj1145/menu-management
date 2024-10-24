import React, { useState, useEffect } from "react";
import StatusBar from './StatusBar'; 

// Recursive component to render menu items hierarchy
const MenuItem = ({ item, onDelete, onEdit, isOpen, toggleOpen }) => {
  const [isEditing, setIsEditing] = useState(false); // Control edit mode
  const [editedTitle, setEditedTitle] = useState(item.title); // Store the edited title

  const handleSave = () => {
    onEdit(item.id, editedTitle); // Call onEdit function with the item ID and edited title
    setIsEditing(false); // Exit edit mode
  };

  const handleCancel = () => {
    setEditedTitle(item.title); // Reset the edited title to the original title
    setIsEditing(false); // Exit edit mode
  };

  return (
    <li>
      <div className="flex items-center justify-between">
        {isEditing ? (
          <>
           <div className="flex flex-col">
  <input
    type="text"
    value={editedTitle}
    onChange={(e) => setEditedTitle(e.target.value)} // Update title on change
    className="border border-gray-300 rounded-md p-1"
  />
  <div className="flex justify-start space-x-4 mt-2">
    <button
      className="text-blue-600 text-sm px-1 py-1"
      onClick={handleSave} // Save changes
    >
      Update
    </button>
    <button
      className="text-gray-600 text-sm px-1 py-1"
      onClick={handleCancel} // Cancel editing
    >
      Cancel
    </button>
  </div>
</div>

          </>
        ) : (
          <>
            <span class="text-base px-2 py-5">{item.title}</span>
            {item.children && item.children.length > 0 && (
              <button className="text-gray-600 text-sm px-1 py-1" onClick={toggleOpen}>
                {isOpen ? "▲" : "▼"}
              </button>
            )}
            <button
              className="text-red-600 ml-2 text-sm px-1 py-1"
              onClick={() => onDelete(item.id)} // Added delete button for each item
            >
              Delete
            </button>
            <button
              className="text-blue-600 ml-2 text-sm px-1 py-1"
              onClick={() => setIsEditing(true)} // Switch to edit mode
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

  // Fetch menus from the API
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch(
          "http://localhost/menu-management/public/api/menus"
        );
        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };
    fetchMenus();
  }, []);

  // Fetch all menu items for all menus when the component loads
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          "http://localhost/menu-management/public/api/submenus"
        );
        const data = await response.json();
        setMenuItems(data); // Set the menu items for all menus
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  // Handle the menu selection change
  const handleMenuChange = (e) => {
    const selectedId = e.target.value;
    setMenuId(selectedId);
    const selected = menus.find((menu) => menu.id === parseInt(selectedId));
    setSelectedMenu(selected || null); // Set the selected menu object
    setParentId(""); // Reset parent selection when menu changes
  };

  // Handle submitting the form to add a new menu item
const handleAddMenuItem = (e) => {
    e.preventDefault();

    if (!title) {
      alert("Please fill in the title");
      return;
    }

    // Determine the depth based on the selected parent
    const newDepth = parentId
      ? menuItems.find((item) => item.id === parseInt(parentId)).depth + 1
      : depth;

    if (!menuId) {
      // If no menu is selected, save the title to the menus table
      let name = title;
      fetch("http://localhost/menu-management/public/api/menus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name, // Menu title
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add menu");
          }
          return response.json();
        })
        .then((newMenu) => {
          alert("Menu added successfully");

          // Optionally, you could add the new menu to your local state
          setMenus((prevMenus) => [...prevMenus, newMenu]);

          // Reset form fields
          setTitle("");
          setParentId("");
          setDepth(1);
          setMenuId("");
          setSelectedMenu(null);
        })
        .catch((error) => {
          console.error("Error adding menu:", error);
          alert("Failed to add menu");
        });
    } else {
      // Submit data to the API to add a new menu item
      fetch("http://localhost/menu-management/public/api/menu-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          parent_id: parentId || null, // If no parent selected, set parent_id to null
          depth: newDepth,
          menu_id: menuId, // Include the selected menu ID
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add menu item");
          }
          return response.json();
        })
        .then((newItem) => {
          alert("Menu item added successfully");

          // Update the menu items list without refreshing
          setMenuItems((prevItems) => [...prevItems, newItem]);

          // Reset form fields
          setTitle("");
          setParentId("");
          setDepth(1);
          setMenuId("");
          setSelectedMenu(null);
        })
        .catch((error) => {
          console.error("Error adding menu item:", error);
          alert("Failed to add menu item");
        });
    }
  };

  // Handle deleting a menu item
  const handleDeleteItem = (id) => {
    fetch(`http://localhost/menu-management/public/api/menu-items/${id}`, {
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
    fetch(`http://localhost/menu-management/public/api/menu-items/${id}`, {
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

  // Helper function to build the menu hierarchy
  const buildHierarchy = (menuItems) => {
    const map = {};
    const roots = [];

    // First map each item by its ID and prepare an empty children array
    menuItems.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });

    // Then populate children arrays based on parent_id
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

  // Filter parent items related to the selected menu
  const filteredParents = menuItems.filter(
    (item) => item.menu_id === parseInt(menuId) && !item.parent_id
  );

  // Function to toggle all items open/closed
  const toggleAll = (open) => {
    const newOpenItems = {};
    menuItems.forEach((item) => {
      newOpenItems[item.id] = open; // Set open state for each item
    });
    setOpenItems(newOpenItems); // Update the open items state
  };

  // Function to toggle individual item open/closed
  const toggleOpen = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the open state for the item
    }));
  };

  return (
    <>
    <StatusBar />
    <div
  className="mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 text-black max-w-full h-full"
>
      {/* Menu Hierarchy Display */}
      <div className="col-span-1">
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
          <h4 className="text-lg font-semibold">{menu.name}</h4>
          {hierarchy.length > 0 && (
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

      {/* Form Section */}
      <div className="col-span-2">
        <form className="space-y-5 text-left" onSubmit={handleAddMenuItem}>
          {/* Menu Selection */}
          <div className="w-full">
            <label className="block text-xxl font-medium text-left">Menu</label>
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

          {/* Display Selected Menu */}
          {selectedMenu && (
            <div className="flex flex-col space-y-4">
              <div className="w-full">
                <label className="block text-xxl font-medium text-left">
                  MenuID
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedMenu.id}
                  className="w-full border border-gray-300 rounded-md p-3 bg-gray-200 focus:outline-none"
                />
              </div>

              <div className="w-full">
                <label className="block text-xxl font-medium text-left">
                  Depth
                </label>
                <input
                  type="number"
                  value={depth}
                  readOnly
                  className="w-full border border-gray-300 rounded-md p-3 bg-gray-200 focus:outline-none"
                />
              </div>

              <div className="w-full">
                <label className="block text-xxl font-medium text-left">
                  Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedMenu.name}
                  className="w-full border border-gray-300 rounded-md p-3 bg-gray-200 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Parent Selection */}
          <div className="w-full">
            <label className="block text-xxl font-medium text-left">
              Parent
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              <option value="">No Parent</option>
              {filteredParents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title Input */}
          <div className="w-full">
            <label className="block text-xxl font-medium text-left">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            />
          </div>

          {/* Buttons Section */}
          <div className="w-full text-left space-y-2">
            <button
              type="submit"
              className="w-full md:w-1/2 py-3 bg-blue-500 text-white font-semibold rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
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

