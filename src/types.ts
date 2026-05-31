export type TabId = 'home' | 'insights' | 'archive' | 'datasets' | 'team' | 'settings';

export interface UserProfile {
  name: string;
  email: string;
  deptAndTitle: string;
  bio: string;
  avatarUrl: string;
  twoFactorEnabled: boolean;
  boundDevice: {
    name: string;
    location: string;
  } | null;
  notifications: {
    systemAlerts: boolean; // forced
    dailyDigest: boolean;
    teamActivity: boolean;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string; // If absent, show initial
  role: 'admin' | 'analyst' | 'observer';
}

export interface ArchiveItem {
  id: string;
  title: string;
  description: string;
  classification?: string; // e.g. "最高机密"
  category: string; // e.g. "宏观研报", "遗留数据集"
  lastVisit?: string;
  author?: string;
  code?: string;
  size?: string;
  security?: string; // e.g. "内部限制"
  date: string; // e.g. "2021.03"
  fileIcon: 'folder' | 'gavel' | 'memory';
  requiresAuth?: boolean;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'snowflake' | 's3' | 'postgres' | 'mysql' | 'mongodb';
  status: 'connected' | 'not-configured';
  subtitle: string;
  syncTime?: string;
}

export interface AISignal {
  id: string;
  title: string;
  description: string;
  confidence: number;
  influenceScope: string;
}

export interface ChartDataPoint {
  label: string;
  macroValue: number; // For gold line path
  barsValue: number;  // For active bar height percentage
  isPeak?: boolean;
}

// Global constant initial mock data for seamless persistence
export const INITIAL_PROFILE: UserProfile = {
  name: '陈墨',
  email: 'chen.mo@marai.com',
  deptAndTitle: '高级数据科学家 · 核心算法组',
  bio: '专注于大规模多模态数据检索与推理引擎的架构设计。致力于将复杂数据转化为可操作的商业洞察。',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxTTe7PQf8lEonbOO0rq63fgAB-bM_4o4WVHz4l1fkoMJ8GiMJqwRusqCZtAJujb8nuwVoTg9AQqu06D-uKHXcMe1zzTboEroGXabDZwsFOzL3fq52St3iSF5VI_VWLB3kQmm9xj7ziZlb1EzOgLaTnac_Z869ivOO-oPJBpTXNhb2NfBKXaBUjYhX2XcynVyPwMMfGUSONldWagymXbYNSaolGciFN8XaX27RsAtCbY47sNFUH8n74Id_vP7gMumcIsjpu9pd1Q',
  twoFactorEnabled: true,
  boundDevice: {
    name: 'iPhone 14 Pro',
    location: '杭州',
  },
  notifications: {
    systemAlerts: true,
    dailyDigest: true,
    teamActivity: false,
  }
};

export const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: '林婉茹',
    email: 'lin.wanru@marai.com',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUpIE9hOaI0_EwMAZmArnfDzJVtv-2AFsPsT40qOy0WmXxHLCXR3IEIJmWXq2f-Pp6RBHotVG_wMe3oi9jNBanc8C6pENDWIB_RPXuf9WJChH5e5jJ69KmbTSZ6nt0Be1d6jQ5qUgBmqjHpYw4uv_Fb-1McUYGvqpkfggATPGTleCt6lqATA9YkLswRL7Y2OqJRE9SYk474VROFeUIeMfuEY7VNaZACqAxX-bYSQCRklcZs0HNFpMElqSXw82fKkhs84L1k8-tJg',
    role: 'admin',
  },
  {
    id: '2',
    name: '陈浩宇',
    email: 'chen.haoyu@marai.com',
    role: 'analyst',
  },
  {
    id: '3',
    name: '王志明',
    email: 'wang.zhiming@marai.com',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgmJFyNDOV92GPILxZABVTF1sIff1rdZ6Cb4tq1e3IUa04oMt5nkpaQalE0uplBTLlkgz7VmHaM-hpna4sx8k6f49tm4litxR9PTdm7XNI-WCouqTnDwuDBXJDfQOansMltt31QOttQoQi0py5Igjj7m2zQo7HHzj1gkVvY9bqVYJx8X2Jtt2BABXnbYx_QqIMJhqkfCEAEKYn-Z9fmELiDFQC2Gv87ldo7e_rRvpU6eVfBhcDoR_cye6l7PO3tIAkZJgSE3CqLg',
    role: 'observer',
  },
];

export const INITIAL_ARCHIVES: ArchiveItem[] = [
  {
    id: 'arc-1',
    title: '2023年全球宏观经济深度解析与危机推推演模型',
    description: '详尽的地区经济指标归档，包含过去五年内核心市场波动的完整数据图谱，以及针对黑天鹅事件的多维度应急响应预案参数矩阵。',
    classification: '最高机密',
    category: '宏观研报',
    lastVisit: '2023.10.12',
    author: '亚历山大研究团队',
    code: 'ARC-994-A',
    date: '2023.10',
    fileIcon: 'folder',
  },
  {
    id: 'arc-2',
    title: '亚太地区C端用户行为演变日志 (2018-2021)',
    description: '基于超过五千万活跃用户节点的结构化遗留数据，主要用于训练早期消费心理预测分析网络。',
    category: '遗留数据集',
    size: '4.2 TB',
    security: '内部限制',
    date: '2021.12',
    fileIcon: 'folder',
  },
  {
    id: 'arc-3',
    title: '量子计算行业早期投资尽调汇编',
    description: '包含2019年间对14家初创企业的技术评估、财务审计报告及创始团队背景审查历史档案。',
    category: '尽调档案',
    date: '2021.03',
    fileIcon: 'folder',
  },
  {
    id: 'arc-4',
    title: '跨国合规与反垄断法案修订追踪 (卷二)',
    description: '欧盟及北美市场关键政策法规的历史沿革，附带政策对特定产业链冲击的模拟测算结果。',
    category: '合规法律',
    date: '2022.08',
    fileIcon: 'gavel',
    requiresAuth: true,
  },
  {
    id: 'arc-5',
    title: '"雅典娜"初代AI模型训练日志与语料库',
    description: '已废弃的初代语言模型训练过程记录，包含早期提示词工程实验数据与失败的架构迭代分支。',
    category: '语料库参数',
    date: '2020.11',
    fileIcon: 'memory',
  },
  {
    id: 'arc-6',
    title: '2024能源转型战略路线与博弈地图',
    description: '覆盖三大主要经济体的氢能与新能源电网发展规划，包含多头博弈理论分析与系统性风险评级指标库。',
    classification: '秘密级',
    category: '宏观研报',
    lastVisit: '2024.02.15',
    author: '德尔斐地缘研究小组',
    code: 'ARC-338-F',
    date: '2024.02',
    fileIcon: 'folder',
  },
  {
    id: 'arc-7',
    title: '泛欧洲数位市场准入指南 (DMR v1.2)',
    description: '欧洲理事会关于跨境数字服务基础设施准入的技术审查日志。包含反洗钱合规框架协议。',
    category: '合规法律',
    date: '2023.01',
    fileIcon: 'gavel',
  }
];

export const INITIAL_DATA_SOURCES: DataSource[] = [
  {
    id: 'ds-1',
    name: 'Snowflake Data Cloud',
    type: 'snowflake',
    status: 'connected',
    subtitle: '生产环境仓 · 同步于 2 分钟前',
  },
  {
    id: 'ds-2',
    name: 'Amazon S3 (Data Lake)',
    type: 's3',
    status: 'connected',
    subtitle: '原始日志存储 · 实时监听中',
  },
  {
    id: 'ds-3',
    name: 'PostgreSQL (业务主库)',
    type: 'postgres',
    status: 'not-configured',
    subtitle: '点击以配置连接凭证',
  }
];

export const INITIAL_SIGNALS: AISignal[] = [
  {
    id: 'sig-1',
    title: '区域供应链重组迹象',
    description: '基于对亚太地区B2B采购数据的NLP分析，检测到向本土化供应商转移的显著趋势。',
    confidence: 92,
    influenceScope: '制造业',
  },
  {
    id: 'sig-2',
    title: '生成式AI工具采用率激增',
    description: '创意产业类别中，提及"自动化工作流"的招聘启事本季度环比增长215%。',
    confidence: 98,
    influenceScope: '知识工作者',
  },
  {
    id: 'sig-3',
    title: '可再生能源设备资本支出逆风上升',
    description: '高频工业用电及电网并网申请激增，大中型储能采购招标溢价12%。',
    confidence: 87,
    influenceScope: '公用事业与重工业',
  },
];

export const MONTHLY_TRENDS: ChartDataPoint[] = [
  { label: 'Q1', macroValue: 30, barsValue: 30 },
  { label: 'Q2', macroValue: 45, barsValue: 45 },
  { label: 'Q3', macroValue: 40, barsValue: 40 },
  { label: 'Q4', macroValue: 60, barsValue: 60 },
  { label: 'Q5', macroValue: 55, barsValue: 55 },
  { label: 'Q6', macroValue: 75, barsValue: 75, isPeak: true },
  { label: 'Q7', macroValue: 65, barsValue: 65 },
];

export const WEEKLY_TRENDS: ChartDataPoint[] = [
  { label: 'W1', macroValue: 45, barsValue: 42 },
  { label: 'W2', macroValue: 52, barsValue: 48 },
  { label: 'W3', macroValue: 64, barsValue: 58 },
  { label: 'W4', macroValue: 80, barsValue: 80, isPeak: true },
];

export const YEARLY_TRENDS: ChartDataPoint[] = [
  { label: '2020', macroValue: 35, barsValue: 20 },
  { label: '2021', macroValue: 50, barsValue: 40 },
  { label: '2022', macroValue: 58, barsValue: 55 },
  { label: '2023', macroValue: 72, barsValue: 75 },
  { label: '2024', macroValue: 86, barsValue: 86, isPeak: true },
  { label: '2025', macroValue: 81, barsValue: 80 },
];
