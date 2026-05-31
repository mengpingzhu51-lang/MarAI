import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Plus, 
  CheckCircle, 
  X, 
  FileSpreadsheet, 
  RefreshCw, 
  ChevronRight, 
  AlertCircle, 
  TableProperties, 
  Layers, 
  ShieldCheck, 
  Key,
  FolderOpen
} from 'lucide-react';
import { DataSource } from '../types';

interface DatasetsViewProps {
  dataSources: DataSource[];
  onAddDataSource: (ds: Omit<DataSource, 'id'>) => void;
  onRemoveDataSource: (id: string) => void;
}

// Subtitle data definitions for high-fidelity interactive elements
interface MockTable {
  id: string;
  name: string;
  records: string;
  size: string;
  status: 'synced' | 'pending';
  columns: { name: string; type: string }[];
  rows: Record<string, any>[];
}

const MOCK_DATASETS: Record<string, MockTable[]> = {
  'ds-1': [
    {
      id: 'tbl-1',
      name: 'apac_consumer_behavior_logs',
      records: '52,401,928 亿行',
      size: '4.2 TB',
      status: 'synced',
      columns: [
        { name: 'session_id', type: 'VARCHAR(256)' },
        { name: 'user_uuid', type: 'VARCHAR(128)' },
        { name: 'event_timestamp', type: 'TIMESTAMP' },
        { name: 'purchase_intent', type: 'FLOAT' },
        { name: 'geo_region', type: 'VARCHAR(16)' },
        { name: 'automotive_interest', type: 'BOOLEAN' }
      ],
      rows: [
        { session_id: 'sess_993a4bc', user_uuid: 'usr-8381-x99', event_timestamp: '2023-10-24 14:15:22', purchase_intent: 0.942, geo_region: 'APAC-CN', automotive_interest: true },
        { session_id: 'sess_993a5de', user_uuid: 'usr-4819-k12', event_timestamp: '2023-10-24 14:16:01', purchase_intent: 0.125, geo_region: 'APAC-JP', automotive_interest: false },
        { session_id: 'sess_993a6ff', user_uuid: 'usr-3891-b32', event_timestamp: '2023-10-24 14:17:15', purchase_intent: 0.887, geo_region: 'APAC-SG', automotive_interest: true }
      ]
    },
    {
      id: 'tbl-2',
      name: 'global_macro_crisis_simulations',
      records: '840,000 行',
      size: '240 MB',
      status: 'synced',
      columns: [
        { name: 'scenario_id', type: 'INTEGER' },
        { name: 'crude_oil_price', type: 'FLOAT' },
        { name: 'interest_rate_delta', type: 'FLOAT' },
        { name: 'capital_flight_risk', type: 'FLOAT' },
        { name: 'predicted_drawdown', type: 'FLOAT' }
      ],
      rows: [
        { scenario_id: 1024, crude_oil_price: 112.5, interest_rate_delta: 0.05, capital_flight_risk: 0.74, predicted_drawdown: -0.185 },
        { scenario_id: 1025, crude_oil_price: 135.0, interest_rate_delta: 0.08, capital_flight_risk: 0.91, predicted_drawdown: -0.312 }
      ]
    }
  ],
  'ds-2': [
    {
      id: 'tbl-3',
      name: 's3_historical_ticker_tape',
      records: '1,204,912,188 行',
      size: '18.9 TB',
      status: 'synced',
      columns: [
        { name: 'ticker', type: 'VARCHAR(12)' },
        { name: 'epoch_millis', type: 'BIGINT' },
        { name: 'trade_volume', type: 'BIGINT' },
        { name: 'ask_price', type: 'DECIMAL(18,4)' },
        { name: 'bid_price', type: 'DECIMAL(18,4)' }
      ],
      rows: [
        { ticker: 'AMZN', epoch_millis: 1698157200000, trade_volume: 82400, ask_price: 128.4500, bid_price: 128.4200 },
        { ticker: 'GOOGL', epoch_millis: 1698157200500, trade_volume: 41900, ask_price: 139.1200, bid_price: 139.1100 }
      ]
    }
  ],
  'ds-3': []
};

export default function DatasetsView({ dataSources, onAddDataSource, onRemoveDataSource }: DatasetsViewProps) {
  const [selectedSourceId, setSelectedSourceId] = useState<string>(dataSources[0]?.id || 'ds-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  // New dataset form states
  const [newName, setNewName] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newType, setNewType] = useState<DataSource['type']>('postgres');

  // Find active source
  const activeSource = dataSources.find(ds => ds.id === selectedSourceId);
  const activeTables = MOCK_DATASETS[selectedSourceId] || [];

  // Filter sources & tables based on query
  const filteredTables = activeTables.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTable = activeTables.find(t => t.id === selectedTableId) || activeTables[0];

  const handleSyncSource = (id: string) => {
    setIsSyncing(id);
    setTimeout(() => {
      setIsSyncing(null);
    }, 1500);
  };

  const handleCreateSourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    onAddDataSource({
      name: newName,
      subtitle: newSubtitle || '暂无描述',
      status: 'connected',
      type: newType,
      syncTime: '刚刚'
    });

    setNewName('');
    setNewSubtitle('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 select-none">
      
      {/* Visual Title Header */}
      <section className="space-y-4">
        <div className="flex items-center space-x-3">
          <span className="h-[1px] w-12 bg-primary"></span>
          <span className="font-label text-xs font-bold tracking-widest text-primary uppercase">
            主引擎底座
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div className="space-y-3 text-left">
            <h1 className="font-headline text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              数据集及多维数据集成中心
            </h1>
            <p className="font-body text-base text-on-surface-variant max-w-2xl leading-relaxed">
              实时调配分布式基础底座（Snowflake、S3、PostgreSQL等），校验并微调模型特征工程输入，加速智能推理收敛效率。
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:opacity-90 transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>集成外部数据集</span>
          </button>
        </div>
      </section>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left column: Data source lists (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="font-headline text-lg font-bold text-on-surface">活动数据集成底座</h3>
          
          <div className="space-y-4">
            {dataSources.map((ds) => {
              const isSelected = selectedSourceId === ds.id;
              return (
                <div
                  key={ds.id}
                  onClick={() => {
                    setSelectedSourceId(ds.id);
                    setSelectedTableId(null);
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected 
                      ? 'bg-surface border-primary/20 shadow-md ring-1 ring-primary/10' 
                      : 'bg-surface-container-low/50 border-outline-variant/10 hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${
                        isSelected ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-headline text-sm font-bold text-on-surface">{ds.name}</h4>
                        <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">{ds.type}</span>
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1 text-[10px] font-label font-bold px-2 py-0.5 rounded-full ${
                      ds.status === 'connected' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-surface-container-highest text-on-surface-variant'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${ds.status === 'connected' ? 'bg-green-500' : 'bg-on-surface-variant/40'}`} />
                      {ds.status === 'connected' ? '就绪' : '未连接'}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-1 mb-3">
                    {ds.subtitle}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
                    <span className="text-[10px] font-mono text-on-surface-variant">
                      {ds.syncTime || '未就绪'}
                    </span>

                    {ds.status === 'connected' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSyncSource(ds.id);
                        }}
                        className="text-[11px] font-label text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${isSyncing === ds.id ? 'animate-spin' : ''}`} />
                        <span>{isSyncing === ds.id ? '校验中' : '心跳同步'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Tables explorer & preview (8 cols) */}
        <div className="lg:col-span-8 bg-surface rounded-3xl p-8 border border-surface-container-highest/50 space-y-8 flex flex-col justify-between min-h-[500px]">
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-container-high pb-4">
              <div>
                <h3 className="font-headline text-xl font-bold text-on-surface">结构化数据集清单</h3>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">
                  当前连接底座：<span className="font-semibold text-primary">{activeSource?.name}</span> ({activeSource?.type})
                </p>
              </div>

              {/* Table search filter */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="过滤数据集名称..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container-lowest text-on-surface font-body text-xs pl-9 pr-3 py-1.5 rounded-lg border-none focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>

            {filteredTables.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 bg-surface-container-lowest text-on-surface-variant rounded-full flex items-center justify-center mx-auto">
                  <Database className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <div>
                  <p className="font-headline text-sm font-semibold">暂无活动数据集表件</p>
                  <p className="text-xs text-on-surface-variant mt-1">请核对数据连接或执行快速同步</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Tables Selector list (5 cols) */}
                <div className="md:col-span-5 border-r border-outline-variant/10 pr-2 space-y-2 max-h-96 overflow-y-auto">
                  {filteredTables.map((t) => {
                    const isSelected = selectedTableId === t.id || (!selectedTableId && activeTables[0]?.id === t.id);
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTableId(t.id)}
                        className={`p-3 rounded-xl cursor-pointer transition-colors flex justify-between items-center ${
                          isSelected 
                            ? 'bg-primary/5 text-primary' 
                            : 'hover:bg-surface-container-low text-on-surface-variant'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileSpreadsheet className={`w-4 h-4 text-primary shrink-0`} />
                          <span className={`font-mono text-xs truncate ${isSelected ? 'font-bold' : ''}`}>
                            {t.name}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                      </div>
                    );
                  })}
                </div>

                {/* Table details (7 cols) */}
                <div className="md:col-span-7 space-y-6">
                  {selectedTable ? (
                    <div className="space-y-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-mono text-base font-bold text-on-surface">{selectedTable.name}</h4>
                          <div className="flex gap-3 text-[10px] text-on-surface-variant mt-1.5 font-label">
                            <span>行规模: **{selectedTable.records}**</span>
                            <span>文件尺寸: **{selectedTable.size}**</span>
                          </div>
                        </div>

                        <span className="p-1 px-2.5 rounded bg-green-50 text-green-700 text-[10px] font-label font-bold flex items-center gap-1 shrink-0 border border-green-100">
                          <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                          <span>通过审计</span>
                        </span>
                      </div>

                      {/* Schema viewer */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-label text-on-surface-variant block uppercase tracking-wider">数据元模型结构 (Database Columns)</span>
                        <div className="bg-surface-container-low/60 rounded-xl p-3 border border-outline-variant/10 overflow-auto max-h-36">
                          <table className="w-full text-left border-collapse font-mono text-[11px]">
                            <thead>
                              <tr className="border-b border-outline-variant/10 text-on-surface-variant">
                                <th className="py-1 px-2">列名</th>
                                <th className="py-1 px-2">类型</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedTable.columns.map((col, idx) => (
                                <tr key={idx} className="hover:bg-surface-container p-0.5">
                                  <td className="py-1 px-2 text-primary font-semibold">{col.name}</td>
                                  <td className="py-1 px-2 text-on-surface-variant">{col.type}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Mini Data Sample Preview */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-label text-on-surface-variant block uppercase tracking-wider">行级抽样预览 (Row Samples)</span>
                        <div className="rounded-xl overflow-x-auto border border-outline-variant/10 bg-surface-container-low max-h-40">
                          <table className="w-full text-left border-collapse font-mono text-[10px] min-w-[400px]">
                            <thead>
                              <tr className="bg-surface-container text-on-surface-variant border-b border-outline-variant/10">
                                {selectedTable.columns.slice(0, 4).map((c) => (
                                  <th key={c.name} className="py-1.5 px-3 font-semibold">{c.name}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {selectedTable.rows.map((row, idx) => (
                                <tr key={idx} className="border-b border-outline-variant/5 hover:bg-surface-container-high/50">
                                  {selectedTable.columns.slice(0, 4).map((c) => (
                                    <td key={c.name} className="py-2 px-3 truncate max-w-[120px]" title={String(row[c.name])}>
                                      {String(row[c.name])}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center p-8 text-on-surface-variant text-xs text-center font-body">
                      请选择上方对应的数据集表结构以执行即时剖析。
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          <div className="pt-6 border-t border-surface-container-high text-[11px] text-on-surface-variant flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary shrink-0" />
            <span>底座集成受 MarAI 最高安全框架鉴权。全部行轨迹同步及 DDL 读写操作都将在沙盒中保留完整的不可伪造日志。</span>
          </div>

        </div>

      </div>

      {/* Database Integration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-outline-variant/15 text-left">
            <div className="flex justify-between items-center pb-4 border-b border-surface-container-high mb-6">
              <h4 className="font-headline text-lg font-bold text-on-surface">添加外部数据集成</h4>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-surface-container-high cursor-pointer"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            <form onSubmit={handleCreateSourceSubmit} className="space-y-4 text-xs font-label">
              <div className="space-y-1.5">
                <label className="text-on-surface-variant font-semibold">连接源名称 (DataSource Name)</label>
                <input
                  type="text"
                  required
                  placeholder="例如: AWS Snowflake Secondary"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-surface-container p-2.5 rounded-xl border border-outline-variant/10 focus:ring-1 focus:ring-primary outline-none font-body text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-on-surface-variant font-semibold">简介/注释 (Description)</label>
                <input
                  type="text"
                  placeholder="例如: 财务预测辅助指标归档"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full bg-surface-container p-2.5 rounded-xl border border-outline-variant/10 focus:ring-1 focus:ring-primary outline-none font-body text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-on-surface-variant font-semibold">底座类型 (Database Type)</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as DataSource['type'])}
                  className="w-full bg-surface-container p-2.5 rounded-xl border border-outline-variant/10 focus:ring-1 focus:ring-primary outline-none font-body text-xs"
                >
                  <option value="snowflake">Snowflake Data Cloud</option>
                  <option value="s3">Amazon S3 (Data Lake)</option>
                  <option value="postgres">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="mongodb">MongoDB</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 font-label text-sm">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-transparent text-on-surface-variant font-semibold hover:bg-surface-container rounded-xl cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white font-semibold rounded-xl hover:opacity-90 cursor-pointer"
                >
                  完成连接集成
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
