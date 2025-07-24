import React from 'react';
import SidebarItemsMenu from '../molecules/SideMenu';
const SideBar = ({ menu, toggleMenu }) => {
  return (
    <aside className="flex flex-col px-2 pb-8">
      <nav>
        <SidebarItemsMenu menu={menu} toggleMenu={toggleMenu} />
      </nav>
    </aside>
  );
};

export default SideBar;
