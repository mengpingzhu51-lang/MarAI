import React, { useState } from 'react';
import { Search, Bell, History, ArrowRight, Play, Check, X } from 'lucide-react';
import { TabId } from '../types';

interface TopAppBarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  avatarUrl: string;
  onExecuteClick: () => void;
  onSearch: (query: string) => void;
}

export default function TopAppBar({ 
  activeTab, 
  setActiveTab, 
  avatarUrl, 
  onExecuteClick,
  onSearch 
}: TopAppBarProps) {
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Default historical logs
  const [historyItems] = useState([
    { id: '1', query: '2023年全球宏观经济深度解析', time: '2小时前' },
    { id: '2', query: '亚太地区消费行为进化指标', time: '昨天' },
    { id: '3', query: 'Snowflake 数据集成状态审计', time: '3天前' },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 'n-1', text: 'Snowflake 数据库同步成功', type: 'success', time: '2分钟前', unread: true },
    { id: 'n-2', text: 'MarAI 挖掘出第 2 项最新智能市场信号', type: 'info', time: '1小时前', unread: true },
    { id: 'n-3', text: '来自 德尔斐地缘研究小组 的报告已秘密归档', type: 'info', time: '昨天', unread: false },
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    onSearch(val);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header 
      id="platform-top-app-bar" 
      className="flex items-center justify-between px-8 w-[calc(100%-5rem)] fixed left-20 top-0 h-16 z-40 bg-surface/85 backdrop-blur-xl transition-all duration-300 ease-in-out border-b border-outline-variant/15"
    >
      {/* Brand & Navigator */}
      <div id="header-brand-container" className="flex items-center gap-6 shrink-0 lg:gap-8">
        <div 
          onClick={() => setActiveTab('home')}
          className="font-headline text-xl font-extrabold tracking-tight text-primary cursor-pointer select-none whitespace-nowrap bg-primary/5 px-3 py-1 rounded-xl"
        >
          MarAI
        </div>
        
        {/* Navigation Tabs (Syncs with Sidebar) */}
        <nav id="header-nav-shortcuts" className="hidden lg:flex items-center gap-6 h-full select-none">
          <button
            onClick={() => setActiveTab('home')}
            className={`font-label text-sm font-medium transition-all relative py-1 cursor-pointer ${
              activeTab === 'home' 
                ? 'text-primary font-semibold' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            主页
            {activeTab === 'home' && (
              <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`font-label text-sm font-medium transition-all relative py-1 cursor-pointer ${
              activeTab === 'insights' 
                ? 'text-primary font-semibold' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            智库
            {activeTab === 'insights' && (
              <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('datasets')}
            className={`font-label text-sm font-medium transition-all relative py-1 cursor-pointer ${
              activeTab === 'datasets' 
                ? 'text-primary font-semibold' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            数据集
            {activeTab === 'datasets' && (
              <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`font-label text-sm font-medium transition-all relative py-1 cursor-pointer ${
              activeTab === 'archive' 
                ? 'text-primary font-semibold' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            卷宗
            {activeTab === 'archive' && (
              <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-primary rounded-full" />
            )}
          </button>
        </nav>
      </div>

      {/* Floating Center Search Bar */}
      <div id="header-search-container" className="flex items-center justify-center flex-1 max-w-sm px-6 mx-auto">
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={searchVal}
            onChange={handleSearchChange}
            id="global-input-search"
            className="w-full bg-surface-container-highest/40 text-on-surface font-body text-sm pl-10 pr-4 py-1.5 rounded-full border-none focus:ring-1 focus:ring-primary focus:bg-surface outline-none transition-all duration-300"
            placeholder="搜索资源、报告、代码或数据源..."
          />
        </div>
      </div>

      {/* Trailing Controls */}
      <div id="header-actions-container" className="flex items-center justify-end gap-3 shrink-0">
        {/* Execute Task CTA */}
        <button
          onClick={onExecuteClick}
          id="btn-header-execute-task"
          className="font-label text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full transition-colors duration-300 flex items-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-primary stroke-none" />
          <span>执行任务</span>
        </button>

        <div className="flex items-center gap-1 border-l border-outline-variant/15 pl-3 relative">
          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowHistory(false);
              }}
              id="btn-header-notification"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer ${
                showNotifications ? 'bg-primary-container/20 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-error rounded-full" />
              )}
            </button>

            {/* Notification Pane */}
            {showNotifications && (
              <div 
                id="notification-dropdown-panel"
                className="absolute right-0 mt-2 w-80 bg-surface rounded-2xl p-4 shadow-xl border border-outline-variant/15 z-50 text-left"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-outline-variant/10">
                  <h4 className="font-headline text-sm font-semibold">通知提醒</h4>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead} 
                      className="text-[11px] font-label text-primary hover:underline cursor-pointer"
                    >
                      全部标记已读
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="text-xs text-on-surface-variant py-4 text-center">暂无新通知</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {notifications.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`p-2.5 rounded-xl text-xs flex justify-between gap-2 transition-colors relative ${
                          msg.unread ? 'bg-primary/5 font-medium' : 'bg-transparent'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {msg.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                            <span className="text-on-surface text-[11px]">{msg.text}</span>
                          </div>
                          <span className="text-[10px] text-on-surface-variant font-label block">{msg.time}</span>
                        </div>
                        <button 
                          onClick={(e) => removeNotification(msg.id, e)}
                          className="text-on-surface-variant hover:text-error h-fit p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* History Query Log Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setShowHistory(!showHistory);
                setShowNotifications(false);
              }}
              id="btn-header-history"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer ${
                showHistory ? 'bg-primary-container/20 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <History className="w-4 h-4" />
            </button>

            {/* History Popup */}
            {showHistory && (
              <div 
                id="history-dropdown-panel"
                className="absolute right-0 mt-2 w-72 bg-surface rounded-2xl p-4 shadow-xl border border-outline-variant/15 z-50 text-left"
              >
                <h4 className="font-headline text-sm font-semibold mb-3 pb-2 border-b border-outline-variant/10">搜索历史</h4>
                <div className="space-y-2.5">
                  {historyItems.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => {
                        onSearch(item.query);
                        setSearchVal(item.query);
                        setShowHistory(false);
                      }}
                      className="group flex justify-between items-center text-xs p-1.5 rounded-lg hover:bg-surface-container-low cursor-pointer"
                    >
                      <span className="text-on-surface group-hover:text-primary transition-all line-clamp-1">{item.query}</span>
                      <span className="text-[10px] text-on-surface-variant shrink-0">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Link */}
          <button
            onClick={() => setActiveTab('settings')}
            id="btn-header-profile-avatar"
            className="w-9 h-9 rounded-full overflow-hidden ml-1 ring-2 ring-transparent hover:ring-primary transition-all duration-300 shrink-0 cursor-pointer"
            title="查看个人设置"
          >
            <img 
              src={avatarUrl} 
              alt="User Avatar" 
              className="w-full h-full object-cover" 
            />
          </button>
        </div>
      </div>
    </header>
  );
}
