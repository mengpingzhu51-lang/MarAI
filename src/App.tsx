/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  TabId, 
  UserProfile, 
  TeamMember, 
  ArchiveItem, 
  DataSource, 
  AISignal, 
  INITIAL_PROFILE, 
  INITIAL_MEMBERS, 
  INITIAL_ARCHIVES, 
  INITIAL_DATA_SOURCES, 
  INITIAL_SIGNALS 
} from './types';
import SideNavBar from './components/SideNavBar';
import TopAppBar from './components/TopAppBar';
import DashboardView from './components/DashboardView';
import MarketInsightsView from './components/MarketInsightsView';
import DatasetsView from './components/DatasetsView';
import ArchivalAccessView from './components/ArchivalAccessView';
import TeamManagementView from './components/TeamManagementView';
import SystemSettingsView from './components/SystemSettingsView';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Terminal, X, CheckSquare, Settings2, ShieldCheck, Cpu } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabId>('home');
  
  // Shared States (Supports full reactivity!)
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [archives, setArchives] = useState<ArchiveItem[]>(INITIAL_ARCHIVES);
  const [dataSources, setDataSources] = useState<DataSource[]>(INITIAL_DATA_SOURCES);
  const [signals, setSignals] = useState<AISignal[]>(INITIAL_SIGNALS);

  // Global search string synced from top app bar
  const [globalSearch, setGlobalSearch] = useState('');

  // Google Login active indicator & transient toast state
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [showToastMessage, setShowToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleGoogleOAuthSuccess = (event: MessageEvent) => {
      const origin = event.origin;
      // Allow local and cloud environments
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }
      
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.profile) {
        setProfile(event.data.profile);
        setIsGoogleConnected(true);
        setShowToastMessage(`您已成功通过 Google 安全联合身份完成登录：${event.data.profile.email}`);
        
        // Auto-dismiss notification after 4s
        setTimeout(() => {
          setShowToastMessage(null);
        }, 4000);
      }
    };

    window.addEventListener('message', handleGoogleOAuthSuccess);
    return () => window.removeEventListener('message', handleGoogleOAuthSuccess);
  }, []);

  // Floating Execute Task Console modal state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activePresetTask, setActivePresetTask] = useState<number>(1);
  const [taskExecutionState, setTaskExecutionState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);

  // Member roll modifiers
  const handleAddMember = (newMem: Omit<TeamMember, 'id'>) => {
    const fresh: TeamMember = {
      ...newMem,
      id: `mem-${Date.now()}`
    };
    setMembers(prev => [...prev, fresh]);
  };

  const handleRemoveMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdateMemberRole = (id: string, role: 'admin' | 'analyst' | 'observer') => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
  };

  // Data integrations modifiers
  const handleAddDataSource = (newDS: Omit<DataSource, 'id'>) => {
    const fresh: DataSource = {
      ...newDS,
      id: `ds-${Date.now()}`
    };
    setDataSources(prev => {
      // If updating a existing default source (like PG index 2), replace its state, otherwise prefix
      const matchIdx = prev.findIndex(item => item.name === newDS.name);
      if (matchIdx > -1) {
        const replacement = [...prev];
        replacement[matchIdx] = fresh;
        return replacement;
      }
      return [...prev, fresh];
    });
  };

  const handleRemoveDataSource = (id: string) => {
    setDataSources(prev => prev.filter(ds => ds.id !== id));
  };

  // Preset tasks definitions
  const presetTasks = [
    { id: 1, title: '执行宏观经济危机推推演模型审计', desc: '模拟黑天鹅事件发生，校验量子归档文件的冗余度并触发 MarAI 回测计算。' },
    { id: 2, title: '亚太地区 C 端用户消费心理重新建模', desc: '清洗 2018-2021 遗留数据集，计算最新消费者情绪差值并写入数据源。' },
    { id: 3, title: '巡检全局 Snowflake / Amazon S3 集群心跳状态', desc: '测试底层大底座网络存活度，同步当前最新的微观归档。' },
  ];

  // Simulated task machine
  const executeSimulatedPlatformAudit = () => {
    setTaskExecutionState('running');
    setSimulatedLogs(['[MarAI-LOG] 初始化沙盒连接通道...']);
    
    const logsSequence = [
      '[MarAI-LOG] 校验请求签名: SECURE_CLIENT_MARAI... [匹配]',
      '[MarAI-LOG] 正在请求 Snowflake (生产环境舱) 连接端... [成功]',
      '[MarAI-LOG] 正在对当前宏观参数进行多模态检索分析...',
      '[MarAI-LOG] 数据吞吐速率: 9.3 GB/s | 误差界定: <0.001%',
      '[MarAI-LOG] 成功完成回测危机推演评估，已生成最新的宏观趋势指数预测数据。',
      '[MarAI-LOG] 主引擎同步写入归档日志: SECURE-AUDIT-COMPLETE [OK]'
    ];

    let delay = 350;
    logsSequence.forEach((logLine, idx) => {
      setTimeout(() => {
        setSimulatedLogs(prev => [...prev, logLine]);
        if (idx === logsSequence.length - 1) {
          setTaskExecutionState('completed');
        }
      }, delay * (idx + 1));
    });
  };

  // On top bar search callback
  const handleGlobalSearch = (val: string) => {
    setGlobalSearch(val);
    
    // Automatically transition to proper tab for active search filtering if appropriate!
    if (val) {
      if (activeTab === 'home') {
        // If searching and sitting on Dashboard, automatically pop user into Digital Archives tab to easily view result matching
        setActiveTab('archive');
      }
    }
  };

  return (
    <div id="alexandria-decision-workspace" className="bg-background text-on-surface font-body h-screen w-full overflow-hidden flex select-none">
      
      {/* Side Menu Navigation Rail */}
      <SideNavBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenQuickAction={() => {
          setTaskExecutionState('idle');
          setSimulatedLogs([]);
          setShowTaskModal(true);
        }}
      />

      {/* Main Content Pane Wrapper */}
      <main className="flex-1 flex flex-col ml-20 h-screen relative bg-surface-container-lowest">
        
        {/* Top Header Controls bar */}
        <TopAppBar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          avatarUrl={profile.avatarUrl}
          onSearch={handleGlobalSearch}
          onExecuteClick={() => {
            setTaskExecutionState('idle');
            setSimulatedLogs([]);
            setShowTaskModal(true);
          }}
        />

        {/* Scrollable Content View Grid */}
        <div id="workspace-scrollable-canvas" className="flex-1 overflow-y-auto px-8 py-10 lg:px-16 lg:py-12 mt-16 text-left">
          
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardView 
                  setActiveTab={setActiveTab}
                  profile={profile}
                  members={members}
                  archives={archives}
                  dataSources={dataSources}
                />
              </motion.div>
            )}

            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MarketInsightsView 
                  signals={signals} 
                />
              </motion.div>
            )}

            {activeTab === 'datasets' && (
              <motion.div
                key="datasets"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DatasetsView 
                  dataSources={dataSources}
                  onAddDataSource={handleAddDataSource}
                  onRemoveDataSource={handleRemoveDataSource}
                />
              </motion.div>
            )}

            {activeTab === 'archive' && (
              <motion.div
                key="archive"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArchivalAccessView 
                  archives={archives} 
                />
              </motion.div>
            )}

            {activeTab === 'team' && (
              <motion.div
                key="team"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TeamManagementView 
                  members={members}
                  onAddMember={handleAddMember}
                  onRemoveMember={handleRemoveMember}
                  onUpdateMemberRole={handleUpdateMemberRole}
                />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SystemSettingsView 
                  profile={profile}
                  onUpdateProfile={setProfile}
                  dataSources={dataSources}
                  onAddDataSource={handleAddDataSource}
                  onRemoveDataSource={handleRemoveDataSource}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spacer at bottom */}
          <div className="h-20" />
        </div>
      </main>

      {/* Execute Task Live Action Confirmation Console Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-outline-variant/15 text-left flex flex-col justify-between"
            >
              <div className="space-y-6">
                
                {/* Modal Header */}
                <div className="flex justify-between items-start border-b border-surface-container-high pb-4">
                  <div className="flex items-center gap-3 text-primary">
                    <Cpu className="w-6 h-6 stroke-[2.2px] animate-pulse" />
                    <div>
                      <h3 className="font-headline text-xl font-bold">MarAI 协同计算控制台</h3>
                      <p className="text-on-surface-variant text-xs mt-0.5">调配集群在分布式沙盒执行高级审计/重塑</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setShowTaskModal(false);
                      setTaskExecutionState('idle');
                    }}
                    className="rounded-full p-1 hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-on-surface-variant" />
                  </button>
                </div>

                {taskExecutionState === 'idle' ? (
                  <div className="space-y-5">
                    {/* Task Description List */}
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      请选择要调用的计算原语模块。此项决策将在您当前的账户凭证授权范围执行并在本地生成状态归档：
                    </p>

                    <div className="space-y-3 font-label text-xs">
                      {presetTasks.map((t) => {
                        const isChosen = activePresetTask === t.id;
                        return (
                          <div 
                            key={t.id}
                            onClick={() => setActivePresetTask(t.id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                              isChosen 
                                ? 'bg-primary/5 border-primary text-primary font-boldScale'
                                : 'bg-transparent border-outline-variant/15 hover:bg-surface-container-low text-on-surface-variant'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <CheckSquare className={`w-4 h-4 shrink-0 transition-transform ${isChosen ? 'scale-105 stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                              <div>
                                <h4 className="font-semibold text-sm text-on-surface">{t.title}</h4>
                                <p className="text-on-surface-variant text-[11px] mt-0.5 leading-relaxed">{t.desc}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Terminal simulator live stream */}
                    <div className="bg-inverse-surface text-inverse-on-surface p-5 rounded-2xl font-mono text-xs leading-relaxed space-y-2 min-h-[180px] select-text">
                      <div className="flex items-center gap-2 text-on-primary-fixed-variant pb-2 border-b border-on-surface-variant/20 mb-2">
                        <Terminal className="w-4 h-4 animate-bounce" />
                        <span>SANDBOX_AUDIT_STREAM://HOST_PORT_3000</span>
                      </div>
                      
                      {simulatedLogs.map((log, i) => (
                        <p key={i} className="text-[11px] animate-fade-in line-clamp-1">{log}</p>
                      ))}

                      {taskExecutionState === 'running' && (
                        <p className="text-[11px] text-primary-fixed-dim animate-pulse">正在执行...</p>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Console CTA Footer buttons */}
              <div className="mt-8 pt-4 border-t border-surface-container-high flex justify-end gap-3 font-label text-sm">
                {taskExecutionState === 'idle' ? (
                  <>
                    <button 
                      onClick={() => setShowTaskModal(false)}
                      className="px-4 py-2 bg-transparent text-on-surface-variant font-semibold hover:bg-surface-container rounded-xl transition-colors cursor-pointer"
                    >
                      返回
                    </button>
                    <button 
                      onClick={executeSimulatedPlatformAudit}
                      className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-white stroke-none" />
                      <span>运行计算原语</span>
                    </button>
                  </>
                ) : taskExecutionState === 'running' ? (
                  <button 
                    disabled
                    className="px-6 py-2.5 bg-surface-container text-on-surface-variant rounded-xl cursor-not-allowed font-semibold animate-pulse"
                  >
                    算法决策中...
                  </button>
                ) : (
                  <>
                    <div className="flex-1 flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
                      <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                      <span>推演就绪，各项性能指数自上个模型阶段取得全面同步提升。</span>
                    </div>
                    <button 
                      onClick={() => {
                        setShowTaskModal(false);
                        setTaskExecutionState('idle');
                      }}
                      className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer"
                    >
                      完成
                    </button>
                  </>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Google Sign-in Global Floating Toast */}
      <AnimatePresence>
        {showToastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-10 right-10 z-50 bg-inverse-surface text-inverse-on-surface text-xs font-semibold px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-outline-variant/10 max-w-sm select-text"
          >
            <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">✓</div>
            <div className="flex-1 space-y-0.5">
              <p className="font-bold text-[13px] text-white">Google 联合登录认证</p>
              <p className="text-gray-300 text-[11px] leading-relaxed">{showToastMessage}</p>
            </div>
            <button 
              onClick={() => setShowToastMessage(null)}
              className="text-gray-400 hover:text-white p-1 rounded-full shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
