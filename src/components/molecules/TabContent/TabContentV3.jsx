import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { TabPanel } from '../../atoms';

export const TabContentV3 = ({
  filters = {},
  updateFilters = () => {},
  tabConfigurations = {},
}) => {
  const handleChange = (_event, newValue) => {
    const [activeTab, activeSubTab] = newValue;
    updateFilters({ activeTab, activeSubTab, page: 1 });
  };

  const handleSubTabChange = (_event, newValue) => {
    updateFilters({ activeSubTab: newValue, page: 1 });
  };

  // Use optional chaining and default values to ensure no runtime errors occur
  const activeTabs = tabConfigurations.availableTabs || [];
  const activeSubTabs = tabConfigurations.availableSubTabs?.[filters.activeTab] || [];

  return (
    <div className="">
      <div className="mb-5 border-l-8 border-gray-400 ps-2">
        <div className="flex justify-between border bg-white">
          <Tabs
            className="flex w-full items-center"
            value={[filters.activeTab, filters.activeSubTab || 'all']}
            onChange={handleChange}
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#4b5563' }, // Color for the underline
              '& .Mui-selected': {
                color: '#4b5563 !important;', // Color for the selected tab
                borderBottom: '2.5px solid #4b5563', // Custom underline for selected tab
              },
            }}
          >
            {activeTabs.map((tab) => {
              return (
                <Tab
                  key={tab.value}
                  className={`mr-10 w-max font-medium normal-case leading-5 text-red-400 focus:outline-none`}
                  label={tab.label}
                  value={[tab.value, tab?.subValue || 'all']} // Pass an array for activeTab and defaultSubTab
                  sx={{
                    textTransform: 'none',
                    borderBottom:
                      filters.activeTab === tab.value
                        ? '2.5px solid #4b5563'
                        : '2.5px solid transparent',
                  }}
                />
              );
            })}
          </Tabs>
        </div>

        {activeTabs.map((tab) => {
          // Check if there are subtabs for the current tab
          const hasSubTabs = tab.value === filters.activeTab && activeSubTabs.length > 0;

          // If there are no subtabs, skip rendering this TabPanel
          if (!hasSubTabs) return null;

          return (
            <TabPanel
              key={tab.value}
              value={filters.activeTab}
              index={tab.value}
              className="mt-2 border bg-white"
            >
              <Tabs
                onChange={handleSubTabChange}
                sx={{
                  '& .MuiTabs-indicator': { backgroundColor: '#4b5563' },
                  '& .Mui-selected': { color: '#4b5563 !important;' },
                }}
                value={filters.activeSubTab || 'all'}
              >
                {activeSubTabs.map((subTab) => (
                  <Tab
                    key={subTab.value}
                    sx={{ textTransform: 'none' }}
                    label={subTab.label}
                    value={subTab.value}
                  />
                ))}
              </Tabs>
            </TabPanel>
          );
        })}
      </div>
    </div>
  );
};
