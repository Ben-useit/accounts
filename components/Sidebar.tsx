'use client';
import { ReactNode } from 'react';
import SidebarItem from './SidebarItem';
import { sideBarItems } from '@/utils/navigationLinks';

function Component({
  children,
  expanded,
  position,
  height,
}: {
  children: ReactNode;
  expanded: boolean;
  position: string;
  height: string;
}) {
  return (
    <div className={position}>
      <aside
        className={`box-border ${height}  transition-all ${
          expanded ? 'w-5/6 sm:w-64' : 'w-24'
        }`}
      >
        <nav className={`flex ${height} flex-col bg-white shadow-sm`}>
          <ul className='flex-1 px-3'>{children}</ul>
        </nav>
      </aside>
    </div>
  );
}

export default function MakeSidebar({
  position,
  isExpanded,
  height,
}: {
  position: string;
  isExpanded: boolean;
  height: string;
}) {
  // Desktop Sidebar
  return (
    <Component expanded={isExpanded} position={position} height={height}>
      {sideBarItems.map((item, index) => (
        <SidebarItem key={index} expanded={isExpanded} {...item} />
      ))}
    </Component>
  );
}
