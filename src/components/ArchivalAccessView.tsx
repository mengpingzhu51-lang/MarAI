import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Calendar, 
  Bookmark, 
  FolderOpen, 
  Gavel, 
  Cpu, 
  ChevronDown, 
  History, 
  Lock, 
  ArrowRight, 
  FileText,
  User,
  ShieldCheck,
  CheckCircle,
  X
} from 'lucide-react';
import { TabId, ArchiveItem, INITIAL_ARCHIVES } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ArchivalAccessViewProps {
  archives: ArchiveItem[];
}

export default function ArchivalAccessView({ archives: propArchives }: ArchivalAccessViewProps) {
  const [archivesList, setArchivesList] = useState<ArchiveItem[]>(propArchives.length > 0 ? propArchives : INITIAL_ARCHIVES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [showFiltersMenu, setShowFiltersMenu] = useState<string | null>(null);
  
  // Bookmarked IDs
  const [bookmarks, setBookmarks] = useState<string[]>(['arc-1']);
  
  // Dynamic loaded length for pagination
  const [displayCount, setDisplayCount] = useState(5);
  
  // Detail overlay target
  const [detailedItem, setDetailedItem] = useState<ArchiveItem | null>(null);
  
  // Gated Auth Item
  const [authPendingItem, setAuthPendingItem] = useState<ArchiveItem | null>(null);
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);

  // Toggle saving
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarks.includes(id)) {
      setBookmarks(prev => prev.filter(b => b !== id));
    } else {
      setBookmarks(prev => [...prev, id]);
    }
  };

  // Click on reports
  const handleCardClick = (item: ArchiveItem) => {
    if (item.requiresAuth) {
      setAuthPendingItem(item);
      setAuthFeedback(null);
    } else {
      setDetailedItem(item);
    }
  };

  // Submit password mock response
  const handleRequestAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback('正在申请解封授权... MarAI 算法已通过，授权密钥 ARC-TOKEN-883 已下发！');
    setTimeout(() => {
      if (authPendingItem) {
        // Unlock item or open standard detailed item
        setDetailedItem({ ...authPendingItem, requiresAuth: false });
        setAuthPendingItem(null);
        setAuthFeedback(null);
      }
    }, 1800);
  };

  // Categories list
  const categories = ['all', '宏观研报', '遗留数据集', '尽调档案', '合规法律', '语料库参数'];

  // Match items based on query and active filter
  const filteredArchives = archivesList.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategoryFilter === 'all' || item.category === activeCategoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const visibleArchives = filteredArchives.slice(0, displayCount);
  const canLoadMore = filteredArchives.length > displayCount;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto space-y-12"
    >
      {/* Hero Header */}
      <section id="archive-banner" className="flex flex-col gap-4 relative z-10">
        <div className="inline-flex items-center gap-2 text-tertiary bg-tertiary/10 px-3 py-1 rounded-full w-fit font-label text-xs font-semibold tracking-wide uppercase">
          <BookOpen className="w-3.5 h-3.5" />
          <span>数字藏书阁</span>
        </div>
        
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-on-surface leading-tight tracking-tight">
          历史卷宗与<br />数据遗迹网络
        </h1>
        <p className="font-body text-on-surface-variant text-lg max-w-2xl mt-2 leading-relaxed">
          访问并检索过去十年的深度分析报告、被封存的模型参数以及高等级机密情报汇编。所有的历史痕迹均在此刻得到妥善保管与索引。
        </p>
      </section>

      {/* Floating Interactive filter & Search Bar */}
      <section className="bg-surface/60 backdrop-blur-2xl rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 border border-outline-variant/15 sticky top-20 z-30 shadow-[0_8px_32px_-8px_rgba(27,28,29,0.05)]">
        
        {/* Main Search */}
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-bright border-none outline-none focus:ring-1 focus:ring-primary rounded-xl py-3 pl-12 pr-4 text-on-surface font-body placeholder:text-on-surface-variant/60 transition-all text-sm" 
            placeholder="检索数字档案、报告标题、关键词或分类(例如: 最高机密)..." 
          />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-surface-variant" />

        {/* Categories Tag filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-label whitespace-nowrap transition-all cursor-pointer ${
                activeCategoryFilter === cat 
                  ? 'bg-primary text-white font-bold' 
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
              }`}
            >
              {cat === 'all' ? '全部卷宗' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Asymmetric Archival Grid Layout */}
      {!filteredArchives.length ? (
        <div id="no-archives" className="text-center py-20 bg-surface rounded-[2rem] border border-outline-variant/10">
          <FileText className="w-12 h-12 text-on-surface-variant mx-auto mb-4 stroke-[1.2px]" />
          <p className="font-headline text-lg text-on-surface">未匹配到任何相关历史卷宗</p>
          <p className="text-xs text-on-surface-variant mt-1">请尝试更换检索关键词或更改分类标签</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Item 1: Feature Card (ARC-1 always represented as Asymmetries first element) */}
          {visibleArchives.map((item, idx) => {
            const isBookmarked = bookmarks.includes(item.id);

            // Featured Card rendering
            if (item.id === 'arc-1') {
              return (
                <article 
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                  className="col-span-1 md:col-span-8 bg-surface rounded-[2rem] p-8 flex flex-col justify-between group hover:bg-surface border border-outline-variant/10 hover:border-primary/20 transition-all duration-500 cursor-pointer overflow-hidden relative min-h-[340px]"
                >
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none" />
                  
                  <div className="flex items-start justify-between relative z-10 mb-8">
                    <div className="flex gap-2">
                      {item.classification && (
                        <span className="bg-tertiary text-white px-3 py-1 rounded-lg text-xs font-label font-semibold tracking-wider">
                          {item.classification}
                        </span>
                      )}
                      <span className="bg-surface-dim text-on-surface px-3 py-1 rounded-lg text-xs font-label">
                        {item.category}
                      </span>
                    </div>
                    
                    <button 
                      onClick={(e) => toggleBookmark(item.id, e)}
                      className={`text-on-surface hover:text-primary transition-colors cursor-pointer ${isBookmarked ? 'text-primary' : 'text-on-surface-variant'}`}
                    >
                      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-primary' : ''}`} />
                    </button>
                  </div>

                  <div className="relative z-10">
                    <h3 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-4 group-hover:text-primary transition-all duration-300">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm text-on-surface-variant mb-8 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-6 border-t border-surface-variant/50 pt-4 text-xs font-label">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">最后访问</span>
                        <span className="font-body text-sm text-on-surface font-semibold">{item.lastVisit || '2023.10.12'}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">归档人</span>
                        <span className="font-body text-sm text-on-surface font-semibold">{item.author || '亚历山大研究小组'}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">卷宗编号</span>
                        <span className="font-mono text-sm text-on-surface font-bold tracking-tight">{item.code || 'ARC-994-A'}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            }

            // Vertical Card representation (APAC logs)
            if (item.id === 'arc-2') {
              return (
                <article 
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                  className="col-span-1 md:col-span-4 bg-surface-container-low rounded-[2rem] p-6 flex flex-col justify-between group hover:border-primary/20 transition-all duration-300 border border-transparent cursor-pointer min-h-[340px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="bg-surface-container-lowest text-on-surface px-3 py-1 rounded-lg text-xs font-label">
                        {item.category}
                      </span>
                      <button 
                        onClick={(e) => toggleBookmark(item.id, e)}
                        className={`text-on-surface hover:text-primary transition-colors cursor-pointer ${isBookmarked ? 'text-primary' : 'text-on-surface-variant'}`}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-primary' : ''}`} />
                      </button>
                    </div>
                    
                    <h3 className="font-headline text-lg font-semibold text-on-surface mb-3 group-hover:text-primary transition-colors line-clamp-3">
                      {item.title}
                    </h3>
                    <p className="font-body text-xs text-on-surface-variant leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col gap-3 font-label text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant">数据规模</span>
                      <span className="font-body font-bold text-on-surface">{item.size || '4.2 TB'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant">安全等级</span>
                      <span className="font-body font-bold text-secondary">{item.security || '内部限制'}</span>
                    </div>
                  </div>
                </article>
              );
            }

            // Standard bottom rows (3 matching cards)
            let IconComp = FolderOpen;
            let iconColor = 'text-primary bg-primary-container/20';
            if (item.fileIcon === 'gavel') {
              IconComp = Gavel;
              iconColor = 'text-tertiary bg-tertiary/10';
            } else if (item.fileIcon === 'memory') {
              IconComp = Cpu;
              iconColor = 'text-secondary bg-secondary-container/50';
            }

            return (
              <article 
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="col-span-1 md:col-span-4 bg-surface rounded-[2rem] p-6 flex flex-col justify-between group hover:border-primary/20 transition-all duration-300 border border-outline-variant/10 cursor-pointer min-h-[290px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconColor}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <button 
                      onClick={(e) => toggleBookmark(item.id, e)}
                      className={`text-on-surface hover:text-primary transition-colors cursor-pointer ${isBookmarked ? 'text-primary' : 'text-on-surface-variant'}`}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-primary' : ''}`} />
                    </button>
                  </div>

                  <h3 className="font-headline text-base font-semibold text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant mb-6 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between text-xs font-label text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <History className="w-3.5 h-3.5" />
                    归档于 {item.date}
                  </span>
                  
                  {item.requiresAuth && (
                    <span className="text-tertiary font-bold flex items-center gap-1 bg-tertiary-container/30 px-2 py-0.5 rounded">
                      <Lock className="w-3 h-3" />
                      需授权
                    </span>
                  )}
                </div>
              </article>
            );
          })}

        </section>
      )}

      {/* Load More Pagination */}
      {canLoadMore && (
        <div id="loader-trigger" className="flex justify-center w-full pb-12">
          <button 
            onClick={() => setDisplayCount(prev => prev + 3)}
            className="font-label text-sm font-semibold text-primary hover:text-on-primary-fixed-variant flex flex-col items-center gap-2 group transition-colors cursor-pointer"
          >
            <span>展开更早的数字卷宗</span>
            <ChevronDown className="w-4 h-4 animate-bounce group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* Auth Gate Verification Dialog */}
      <AnimatePresence>
        {authPendingItem && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-outline-variant/15 text-left space-y-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 text-tertiary">
                  <Lock className="w-6 h-6" />
                  <h3 className="font-headline text-lg font-bold">高等级资产授权机制</h3>
                </div>
                <button 
                  onClick={() => setAuthPendingItem(null)}
                  className="rounded-full p-1 hover:bg-surface-container-high cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="font-headline font-semibold text-on-surface text-base">
                  {authPendingItem.title}
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  为了防止底层地缘资本数据泄露，查阅此卷宗需要录入 MarAI 动态访问密钥或请求本地安全官批准。
                </p>
              </div>

              <form onSubmit={handleRequestAuth} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-label text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                    录入授权序列码 (输入任意密钥触发验证)
                  </label>
                  <input 
                    type="password" 
                    required
                    placeholder="例如: AP-884, admin-pass, 或任意口令"
                    className="w-full bg-surface-container-low text-xs p-3 rounded-xl border border-outline-variant/20 focus:border-primary outline-none transition-colors" 
                  />
                </div>

                {authFeedback && (
                  <div className="text-xs text-primary font-semibold p-2.5 bg-primary-container/20 rounded-xl leading-relaxed">
                    {authFeedback}
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-3 font-label text-sm">
                  <button 
                    type="button"
                    onClick={() => setAuthPendingItem(null)}
                    className="px-4 py-2 hover:bg-surface-container text-on-surface-variant rounded-xl cursor-pointer"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer"
                  >
                    提交授权核审
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detailed Document Drawer Panel */}
      <AnimatePresence>
        {detailedItem && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-end">
            {/* Click backdrop to exit */}
            <div className="absolute inset-0" onClick={() => setDetailedItem(null)} />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-surface h-full shadow-2xl p-8 border-l border-outline-variant/15 overflow-y-auto text-left flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-primary/10 rounded-full text-primary font-label text-xs font-semibold uppercase tracking-wider">
                    {detailedItem.category}
                  </span>
                  <button 
                    onClick={() => setDetailedItem(null)}
                    className="rounded-full p-2 hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
                    {detailedItem.title}
                  </h3>
                  
                  {detailedItem.classification && (
                    <span className="inline-block bg-tertiary text-white px-2.5 py-0.5 rounded text-[10px] font-label font-bold tracking-wide uppercase">
                      安全级别: {detailedItem.classification}
                    </span>
                  )}
                </div>

                <div className="space-y-4 border-t border-b border-outline-variant/10 py-6">
                  <h4 className="font-headline text-sm font-bold text-on-surface">卷宗摘要</h4>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    {detailedItem.description}
                  </p>
                  <p className="font-body text-xs text-on-surface-variant/80 italic leading-relaxed">
                    该条目已通过 MarAI 解析及数字归档，元信息已实时写入对应 Snowflake 及企业数据大底座。
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-headline text-sm font-bold text-on-surface">索引参数字典</h4>
                  
                  <div className="grid grid-cols-2 gap-4 font-label text-xs">
                    <div className="bg-surface-container-low p-3 rounded-xl">
                      <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider mb-1">最后访问</span>
                      <span className="font-body text-sm text-on-surface font-semibold">{detailedItem.lastVisit || '暂无说明'}</span>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-xl">
                      <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider mb-1">编制归档人</span>
                      <span className="font-body text-sm text-on-surface font-semibold">{detailedItem.author || 'MarAI 团队'}</span>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-xl">
                      <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider mb-1">归档物理期</span>
                      <span className="font-body text-sm text-on-surface font-semibold">{detailedItem.date}</span>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-xl">
                      <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider mb-1">文献密钥代号</span>
                      <span className="font-mono text-sm text-on-surface font-bold">{detailedItem.code || 'ARC-GEN-X'}</span>
                    </div>
                    {detailedItem.size && (
                      <div className="bg-surface-container-low p-3 rounded-xl">
                        <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider mb-1">物理规模</span>
                        <span className="font-body text-sm text-on-surface font-semibold">{detailedItem.size}</span>
                      </div>
                    )}
                    {detailedItem.security && (
                      <div className="bg-surface-container-low p-3 rounded-xl">
                        <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider mb-1">安全范畴</span>
                        <span className="font-body text-sm text-on-surface font-semibold">{detailedItem.security}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-outline-variant/10 flex gap-4 font-label text-sm">
                <button 
                  onClick={() => alert('已成功复制深度下载密钥，支持命令行或 API 拉取此遗迹参数。')}
                  className="flex-1 py-3 border border-primary/20 text-primary hover:bg-primary/5 rounded-xl transition-all font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>分发参数密钥</span>
                </button>
                <button 
                  onClick={() => {
                    alert('正在调起本地 MarAI 协同大模型启动对此档案的背景生成大深度解析...');
                    setDetailedItem(null);
                  }}
                  className="flex-1 py-3 bg-primary text-white rounded-xl hover:opacity-90 font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>调起 AI 深度解析</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
