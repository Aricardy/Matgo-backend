import React from 'react';

interface TabLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: string[];
  children: React.ReactNode;
}

const TabLayout: React.FC<TabLayoutProps> = ({ activeTab, onTabChange, tabs, children }) => {
  return (
    <div className="tab-layout">
      <nav className="tab-nav">
        {tabs.map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'tab-active' : ''}
            onClick={() => onTabChange(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>
      <div className="tab-content">{children}</div>
    </div>
  );
};

export default TabLayout;
