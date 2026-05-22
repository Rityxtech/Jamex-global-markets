import React from 'react';

interface TabBarProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  tabs: string[];
}

export default function TabBar({ selectedTab, setSelectedTab, tabs }: TabBarProps) {
  return (
    <div className="flex space-x-2 px-2 py-1 bg-surface-container-low rounded-lg mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          className={`px-3 py-1 rounded transition-colors focus:outline-none ${
            selectedTab === tab
              ? 'bg-primary text-on-primary'
              : 'text-on-surface-variant hover:bg-surface-container-highest/50'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
