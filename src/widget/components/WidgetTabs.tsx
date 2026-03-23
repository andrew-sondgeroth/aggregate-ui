interface WidgetTabsProps {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function WidgetTabs({ tabs, activeTab, onTabChange }: WidgetTabsProps) {
  return (
    <div className="aw-tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`aw-tab ${activeTab === tab ? 'aw-active' : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  )
}
