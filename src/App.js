import React from 'react';
import './App.css';
import SidebarComponent from './components/SidebarComponent';
import MenuComponent from './components/MenuComponent'; // Import your Menu Component

const App = () => {
  return (
    <div className="flex">
      <SidebarComponent />
      <div className="flex-1">
        <MenuComponent />
      </div>
    </div>
  );
};

export default App;