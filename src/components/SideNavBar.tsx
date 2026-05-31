import { 
  Home, 
  Brain, 
  Archive, 
  Database, 
  Users, 
  Settings, 
  Plus 
} from 'lucide-react';
import { TabId } from '../types';

interface SideNavBarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  onOpenQuickAction?: () => void;
}

export default function SideNavBar({ activeTab, setActiveTab, onOpenQuickAction }: SideNavBarProps) {
  const tabs = [
    { id: 'home' as TabId, label: '主页', icon: Home },
    { id: 'insights' as TabId, label: '智库', icon: Brain },
    { id: 'datasets' as TabId, label: '数据集', icon: Database },
    { id: 'archive' as TabId, label: '卷宗', icon: Archive },
    { id: 'team' as TabId, label: '团队', icon: Users },
    { id: 'settings' as TabId, label: '设置', icon: Settings },
  ];

  return (
    <aside id="main-side-navbar" className="h-screen w-20 fixed left-0 top-0 flex flex-col items-center py-6 bg-surface-container-low z-50">
      {/* Brand Logo */}
      <div 
        id="navbar-brand-logo"
        onClick={() => setActiveTab('home')}
        className="mb-8 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-sm hover:scale-95 active:scale-90 transition-transform cursor-pointer"
      >
        <span className="font-display font-black text-2xl tracking-tighter text-white">M</span>
      </div>

      {/* Navigation Tabs */}
      <nav id="navbar-navigation-items" className="flex flex-col items-center gap-4 flex-1 w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`nav-btn-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl w-14 group transition-all cursor-pointer ${
                isActive 
                  ? 'text-primary bg-primary-container/20 font-semibold' 
                  : 'text-on-surface-variant hover:bg-surface-variant/30 hover:text-primary'
              }`}
              title={tab.label}
            >
              <Icon 
                id={`nav-icon-${tab.id}`}
                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} 
              />
              <span className="font-label text-[10px] font-medium leading-none tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Floating Plus CTA Action */}
      <div id="navbar-footer-action" className="mt-auto flex flex-col items-center gap-4 w-full">
        <button 
          id="btn-navbar-quick-action"
          onClick={onOpenQuickAction}
          className="w-12 h-12 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out flex items-center justify-center active:scale-90 cursor-pointer"
          title="执行快速任务"
        >
          <Plus id="navbar-quick-plus" className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
