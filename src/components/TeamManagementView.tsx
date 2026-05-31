import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  ShieldCheck, 
  TrendingUp, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  Info,
  ShieldAlert,
  Menu,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { TabId, TeamMember, INITIAL_MEMBERS } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface TeamManagementViewProps {
  members: TeamMember[];
  onAddMember: (member: Omit<TeamMember, 'id'>) => void;
  onRemoveMember: (id: string) => void;
  onUpdateMemberRole: (id: string, role: 'admin' | 'analyst' | 'observer') => void;
}

export default function TeamManagementView({ 
  members, 
  onAddMember, 
  onRemoveMember,
  onUpdateMemberRole 
}: TeamManagementViewProps) {
  const [searchVal, setSearchVal] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeMembersPage, setActiveMembersPage] = useState(1);
  
  // Form fields for inviting
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'analyst' | 'observer'>('analyst');
  const [errorFeedback, setErrorFeedback] = useState('');

  // Handle invite submission
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      setErrorFeedback('请填写全名和工作邮箱。');
      return;
    }
    if (!newEmail.includes('@') || !newEmail.endsWith('.com')) {
      setErrorFeedback('请输入有效的企业邮箱。');
      return;
    }
    
    onAddMember({
      name: newName,
      email: newEmail,
      role: newRole,
    });
    
    // Reset states
    setNewName('');
    setNewEmail('');
    setNewRole('analyst');
    setErrorFeedback('');
    setShowInviteModal(false);
  };

  // Filter members based on search
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchVal.toLowerCase()) || 
    m.email.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto space-y-12"
    >
      {/* Title Header */}
      <section id="team-header" className="space-y-4">
        <h2 className="font-headline text-4xl lg:text-5xl font-bold tracking-tight text-on-surface">团队管理</h2>
        <p className="font-body text-base text-on-surface-variant max-w-xl">
          管理成员权限，授权高级 MarAI 精选信号协同查阅。分配合理级别保障资产合规完整度。
        </p>
      </section>

      {/* Bento Two Column Grid */}
      <div id="team-layout" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Directory & Actions (Takes 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-end gap-4 pb-2">
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface text-sm rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-0 outline-none transition-all placeholder-on-surface-variant/40" 
                placeholder="搜索成员名称或工作邮箱..." 
              />
            </div>

            <button 
              onClick={() => setShowInviteModal(true)}
              className="flex items-center justify-center gap-1.5 bg-primary text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-all font-label text-sm font-semibold shadow-sm cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>邀请新成员</span>
            </button>
          </div>

          {/* Members List (Glass Cards) */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredMembers.map((member) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  key={member.id}
                  className="bg-surface p-5 rounded-2xl border border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-4 group hover:bg-surface-bright transition-colors"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Circle Image or initials */}
                    {member.avatarUrl ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-surface-container">
                        <img 
                          src={member.avatarUrl} 
                          alt={member.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-headline font-bold text-base shrink-0 border border-primary/20">
                        {member.name.charAt(0)}
                      </div>
                    )}

                    <div className="text-left">
                      <h3 className="font-headline font-semibold text-on-surface text-lg leading-tight">{member.name}</h3>
                      <p className="font-body text-xs text-on-surface-variant mt-0.5">{member.email}</p>
                    </div>
                  </div>

                  {/* Actions & Role Dropdown */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-surface-container pt-3 sm:pt-0">
                    <div className="flex items-center gap-2">
                      {member.role === 'admin' ? (
                        <span className="px-3 py-1 bg-tertiary-container/30 text-tertiary text-xs font-label font-bold rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>管理员</span>
                        </span>
                      ) : member.role === 'analyst' ? (
                        <span className="px-3 py-1 bg-primary-container/20 text-primary text-xs font-label font-bold rounded-full flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 font-bold" />
                          <span>分析师</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-surface-container-highest/60 text-on-surface-variant text-xs font-label font-bold rounded-full flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>观察员</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Allow changing roles directly */}
                      <select 
                        value={member.role}
                        onChange={(e) => onUpdateMemberRole(member.id, e.target.value as any)}
                        className="text-xs bg-surface-container-low text-on-surface-variant border-none rounded-xl py-1 px-3 focus:ring-1 focus:ring-primary focus:bg-surface outline-none cursor-pointer"
                        title="变更成员级别"
                      >
                        <option value="admin">设为管理员</option>
                        <option value="analyst">设为分析师</option>
                        <option value="observer">设为观察员</option>
                      </select>

                      {/* Delete button (Disabled for chief Admin) */}
                      {member.email !== 'lin.wanru@marai.com' ? (
                        <button 
                          onClick={() => onRemoveMember(member.id)}
                          className="text-on-surface-variant hover:text-error transition-colors p-1.5 hover:bg-error/10 rounded-xl cursor-pointer"
                          title="解任此成员"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="text-on-surface-variant/30 p-1.5 cursor-not-allowed" title="主管理员无法撤职">
                          <Trash2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Load more placeholder pagination link */}
            <div className="pt-4 flex justify-center">
              <button 
                onClick={() => alert('全部人员已加载完毕。您可通过上方的邀请面板录入更多研究员席位。')}
                className="text-xs font-label text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>没有更多了</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Bento Statistics (Takes 1 col) */}
        <div className="space-y-6">
          
          {/* Bento box 1: Occupancy stats */}
          <div className="bg-surface p-6 rounded-[2rem] border border-surface-container-high space-y-6 text-left">
            <h4 className="font-headline text-lg font-semibold text-on-surface pb-2 border-b border-surface-container-high">
              团队席位概况
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-label text-xs text-on-surface-variant mb-1">总席位额度</p>
                <p className="font-headline text-3xl text-on-surface font-light">
                  {members.length}<span className="text-sm text-on-surface-variant ml-1">/20</span>
                </p>
              </div>
              
              <div>
                <p className="font-label text-xs text-on-surface-variant mb-1">活跃决策员</p>
                <p className="font-headline text-3xl text-primary font-bold">
                  {members.length}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-surface-container-high">
              <div className="flex justify-between items-center mb-2 font-label text-[11px] text-on-surface-variant">
                <span>MarAI 集群存储空间使用率</span>
                <span className="font-bold text-on-surface">45%</span>
              </div>
              
              <div className="w-full bg-surface-container-highest rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
          </div>

          {/* Bento box 2: Guard Policy instructions */}
          <div className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/10 text-left space-y-6">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              <h4 className="font-headline text-base font-bold text-on-surface">角色权限说明</h4>
            </div>

            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-4.5 h-4.5 text-tertiary shrink-0 mt-0.5" />
                <div>
                  <p className="font-label font-bold text-xs text-on-surface">管理员 (Admin)</p>
                  <p className="font-body text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                    拥有大底座最高管辖权。可新增/移除团队、变更底层 Snowflake 连接密码、或修改账单结算。
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <TrendingUp className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-label font-bold text-xs text-on-surface">分析师 (Analyst)</p>
                  <p className="font-body text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                    核心计算成员。支持创建深度趋势报告、部署智能信号热图阻断、及调阅公开微观卷宗。
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Eye className="w-4.5 h-4.5 text-on-surface-variant shrink-0 mt-0.5" />
                <div>
                  <p className="font-label font-bold text-xs text-on-surface">观察员 (Observer)</p>
                  <p className="font-body text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                    只读查阅权限。常驻审核观察，无法增加连接或删减团队成员名簿，但可实时监控警局。
                  </p>
                </div>
              </li>
            </ul>

            <div className="pt-4 border-t border-outline-variant/15 text-center">
              <button 
                onClick={() => alert('请联系 MarAI 平台系统架构师以注册更细粒度的自定义角色安全标签。')}
                className="text-xs font-label font-semibold text-primary hover:underline flex items-center justify-center gap-1 w-full cursor-pointer"
              >
                <span>管理自定义权限定义</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Invite Member Pop Up Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-outline-variant/15 text-left space-y-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <UserPlus className="w-5.5 h-5.5 text-primary" />
                  <h3 className="font-headline text-xl font-semibold">邀请新协同分析师</h3>
                </div>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-full p-1 hover:bg-surface-container-high cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-5 font-label">
                
                {/* Full name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant">全名</label>
                  <input 
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    placeholder="例如: 陆明远"
                    className="w-full bg-surface-container-low text-sm p-3 rounded-xl border border-outline-variant/20 focus:border-primary focus:ring-0 outline-none"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant">企业工作邮箱</label>
                  <input 
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    placeholder="例如: mingyuan.lu@marai.com"
                    className="w-full bg-surface-container-low text-sm p-3 rounded-xl border border-outline-variant/20 focus:border-primary focus:ring-0 outline-none"
                  />
                </div>

                {/* Role Block Buttons */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase block tracking-wider">
                    分配初始系统角色
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['admin', 'analyst', 'observer'] as const).map((r) => {
                      const isActive = newRole === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setNewRole(r)}
                          className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                            isActive 
                              ? 'bg-primary/5 border-primary text-primary font-boldScale'
                              : 'bg-transparent border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low'
                          }`}
                        >
                          <span className="capitalize">{r === 'admin' ? '管理员' : r === 'analyst' ? '分析师' : '观察员'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {errorFeedback && (
                  <p className="text-xs text-error font-semibold flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{errorFeedback}</span>
                  </p>
                )}

                <div className="pt-4 flex justify-end gap-3 text-sm">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowInviteModal(false);
                      setNewName('');
                      setNewEmail('');
                      setErrorFeedback('');
                    }}
                    className="px-4 py-2 hover:bg-surface-container text-on-surface-variant rounded-xl cursor-pointer"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-primary text-white font-semibold rounded-xl hover:opacity-90 shadow-sm transition-all cursor-pointer"
                  >
                    发送安全核验信
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
