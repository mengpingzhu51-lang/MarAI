import { 
  TrendingUp, 
  BookOpen, 
  Users, 
  HardDriveDownload, 
  BrainCircuit, 
  CheckCircle, 
  ArrowUpRight,
  Sparkles,
  Lock,
  Activity
} from 'lucide-react';
import { TabId, UserProfile, TeamMember, ArchiveItem, DataSource } from '../types';
import { motion } from 'motion/react';

interface DashboardViewProps {
  setActiveTab: (tab: TabId) => void;
  profile: UserProfile;
  members: TeamMember[];
  archives: ArchiveItem[];
  dataSources: DataSource[];
}

export default function DashboardView({ 
  setActiveTab, 
  profile, 
  members, 
  archives, 
  dataSources 
}: DashboardViewProps) {
  // Aggregate stats
  const activeSourcesCount = dataSources.filter(ds => ds.status === 'connected').length;
  const recentArchive = archives[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto space-y-12"
    >
      {/* Hero Welcome Bar */}
      <div id="dash-hero-banner" className="relative p-8 rounded-[2rem] bg-surface-container-low border border-surface-container-highest/20 overflow-hidden group">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary uppercase font-label">
              <Sparkles className="w-3.5 h-3.5" />
              <span>协同决策控制台</span>
            </div>
            <h2 className="font-headline text-3xl lg:text-4xl font-bold tracking-tight">
              欢迎回到 MarAI 决策中心，{profile.name}
            </h2>
            <p className="font-body text-sm text-on-surface-variant max-w-xl leading-relaxed">
              您的全局设置与高级网络参数运行良好。主环境正实时保持与三大底座及分布式多模态数据挖掘引擎的连贯索引。
            </p>
          </div>

          <div className="flex gap-4 shrink-0 bg-surface-container-lowest/80 backdrop-blur p-4 rounded-2xl border border-outline-variant/15 shadow-sm">
            <div className="text-center pr-4 border-r border-outline-variant/10">
              <span className="font-label text-[10px] text-on-surface-variant block uppercase tracking-wider">数据底座</span>
              <span className="font-headline text-2xl font-bold text-primary">{activeSourcesCount}</span>
              <span className="text-[10px] text-on-surface-variant block">已连接</span>
            </div>
            <div className="text-center pr-4 border-r border-outline-variant/10 pl-2">
              <span className="font-label text-[10px] text-on-surface-variant block uppercase tracking-wider">团队成员</span>
              <span className="font-headline text-2xl font-bold text-on-surface">{members.length}</span>
              <span className="text-[10px] text-on-surface-variant block">席位已用</span>
            </div>
            <div className="text-center pl-2">
              <span className="font-label text-[10px] text-on-surface-variant block uppercase tracking-wider">系统等级</span>
              <span className="inline-flex items-center gap-0.5 font-headline text-xs font-semibold px-2 py-1 mt-1 bg-tertiary-container/30 text-tertiary rounded-full">
                最高安全
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Pathways */}
      <div id="dash-bento-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Module A: Market Insights summary */}
        <div 
          onClick={() => setActiveTab('insights')}
          className="bg-surface p-6 rounded-[1.8rem] border border-surface-container-highest/50 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group min-h-[200px]"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <div className="mt-8">
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider block">实时洞察</span>
            <h3 className="font-headline text-xl font-bold text-on-surface mt-1 group-hover:text-primary transition-colors">全球市场动态</h3>
            <p className="font-body text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              情绪指标上游溢价至 84.2，检测到可再生能量资本溢出信号。
            </p>
          </div>
        </div>

        {/* Module B: Archival Access featured */}
        <div 
          onClick={() => setActiveTab('archive')}
          className="bg-surface p-6 rounded-[1.8rem] border border-surface-container-highest/50 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group min-h-[200px]"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
              <BookOpen className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <div className="mt-8">
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider block">数字藏书阁</span>
            <h3 className="font-headline text-xl font-bold text-on-surface mt-1 group-hover:text-primary transition-colors">历史卷宗索引</h3>
            <p className="font-body text-xs text-on-surface-variant mt-1.5 leading-relaxed line-clamp-2">
              近期归档了《2023年全球宏观经济深度解析与危机推推演模型》。
            </p>
          </div>
        </div>

        {/* Module C: Team status card */}
        <div 
          onClick={() => setActiveTab('team')}
          className="bg-surface p-6 rounded-[1.8rem] border border-surface-container-highest/50 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group min-h-[200px]"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-secondary-container/50 flex items-center justify-center text-secondary">
              <Users className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <div className="mt-8">
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider block">团队协作</span>
            <h3 className="font-headline text-xl font-bold text-on-surface mt-1 group-hover:text-primary transition-colors">成员与席位管理</h3>
            <p className="font-body text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              林婉茹(管理员) & {members.length - 1}位其他决策科学家正实时在线。
            </p>
          </div>
        </div>

        {/* Module D: Settings summary */}
        <div 
          onClick={() => setActiveTab('settings')}
          className="bg-surface p-6 rounded-[1.8rem] border border-surface-container-highest/50 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group min-h-[200px]"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <HardDriveDownload className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <div className="mt-8">
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider block">系统配置</span>
            <h3 className="font-headline text-xl font-bold text-on-surface mt-1 group-hover:text-primary transition-colors">数据源与集成</h3>
            <p className="font-body text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              Snowflake 数据连接顺畅，支持 PostgreSQL 或其他流式凭证快速录入。
            </p>
          </div>
        </div>

      </div>

      {/* Understory Workspace Stream status */}
      <div id="dash-workspace-insights" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Latest Activity Stream */}
        <div className="lg:col-span-2 bg-surface rounded-[2rem] p-8 border border-surface-container-highest/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-headline text-xl font-semibold">协同交互与运行心跳</h3>
            </div>
            <span className="text-[11px] font-label text-on-surface-variant uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              MarAI Core online
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-surface-container-low rounded-xl flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
              <div>
                <p className="text-xs text-on-surface-variant font-label mb-1">今日 14:10 · 协同通知</p>
                <h4 className="font-body text-sm font-semibold text-on-surface">您更新了账户最高安全级别的双因素验证(2FA)</h4>
                <p className="font-body text-xs text-on-surface-variant mt-1">
                  安全策略已自动同步并强化了对应 iPhone 14 Pro 绑定设备及对应的底层 Snowflake / Amazon S3 密钥请求。
                </p>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low rounded-xl flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-tertiary mt-2 shrink-0" />
              <div>
                <p className="text-xs text-on-surface-variant font-label mb-1">昨日 11:45 · 历史档案</p>
                <h4 className="font-body text-sm font-semibold text-on-surface">德尔斐研究小组完成了《跨国合规与反垄断法案追踪》修订本归档</h4>
                <p className="font-body text-xs text-on-surface-variant mt-1">
                  因部分内容涉及敏感资本，该卷宗被赋予了高级别保护。如有需要可直接发送授权查阅请求。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decision Priority Block */}
        <div className="bg-surface-container-low rounded-[2rem] p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-tertiary">
              <Lock className="w-4.5 h-4.5" />
              <span className="font-label text-xs font-bold uppercase tracking-wider">决策边界警卫</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-3">
              数字资产合规自检
            </h3>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              MarAI 为您保障全局安全底线。在您发起高等级分析任务或在“智库”栏进行全球趋势峰值估测时，系统将验证您的安全连接证书是否过期。建议每 30 天于“个人设置”中审查一次工作邮箱及授权令牌。
            </p>
          </div>

          <div className="pt-6 border-t border-surface-container-highest/40">
            <button 
              onClick={() => setActiveTab('settings')}
              className="text-xs font-label font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>执行全局证书审核</span>
              <span className="text-sm">→</span>
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
