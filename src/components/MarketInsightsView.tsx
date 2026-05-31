import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, 
  Send, 
  Sparkles, 
  Search, 
  Globe, 
  Terminal, 
  CheckCircle2, 
  Info, 
  HelpCircle,
  FileText,
  Activity,
  Cpu,
  RefreshCw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { AISignal } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface MarketInsightsViewProps {
  signals?: AISignal[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: { title: string; uri: string }[];
}

// Preset instruction tasks mimicking premium reference system
const PRESET_PROMPTS = [
  {
    title: "亚太区溢价心理深度审计",
    query: "请审计当前亚太地区消费者的可持续行为溢价意图，并推演未来的特征走向。"
  },
  {
    title: "Snowflake 宏观指标多维关联",
    query: "如何评估 Snowflake 数据中 2023 宏观景气系数 与 亚太行为演变 之间的数据集内关联？"
  },
  {
    title: "黑天鹅地缘政策冲击推演",
    query: "若发生严重的地区贸易限制政策事件，如何设计针对底层 Snowflake 与 S3 链路数据的自动应灾冗余矩阵？"
  },
  {
    title: "AI 特征工程收敛效率调配",
    query: "有什么方法可以微调当前 MarAI 神经网络的损失函数偏置，从而令多模态特征清洗任务的收敛速度提升 15%？"
  }
];

export default function MarketInsightsView({ signals = [] }: MarketInsightsViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `您好！我是 **MarAI 决策智能大脑**。

作为您在决策中心的核心智能体，我已连接底层 Snowflake/Amazon S3 的高频指标。通过 **Google Search Grounding 网络检索增强技术**，我将针对您的数据请求与行业难题展开精准推演。

您可以输入任何与系统集成、地缘宏观参数偏置相关的问题，或直接点击左侧的**预设推导原语**直接向我发起计算决策咨询：`,
      timestamp: '刚刚',
      sources: [
        { title: "MarAI 智能框架白皮书", uri: "#" }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePromptIndex, setActivePromptIndex] = useState<number | null>(null);
  const [searchGrounded, setSearchGrounded] = useState(true);
  const [reasoningLevel, setReasoningLevel] = useState<'standard' | 'high'>('standard');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to lowest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const rawMsg = textToSend || inputValue;
    if (!rawMsg.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: rawMsg,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: rawMsg })
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody?.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ **神经网络交互异常**\n在与底层多模态推理引擎连接时遇到错误：\`${err.message || '推理超时'}\`。\n这通常可能由于服务器未启动或连接断开引起，请稍后再次发送。`,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert markdown to elegantly-styled react fragments manually to avoid fragile third-party modules issues
  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={lineIdx} className="text-sm font-bold text-on-surface mt-4 mb-2">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={lineIdx} className="text-base font-bold text-primary mt-5 mb-2.5">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={lineIdx} className="text-lg font-bold text-primary mt-6 mb-3">{line.replace('# ', '')}</h2>;
      }
      
      // Bullets
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const cleaned = line.trim().replace(/^[-*]\s+/, '');
        return (
          <div key={lineIdx} className="flex gap-2.5 my-1.5 pl-2">
            <span className="text-primary select-none mt-1">✓</span>
            <span className="leading-relaxed text-xs md:text-sm">{parseInlineContent(cleaned)}</span>
          </div>
        );
      }

      return (
        <p key={lineIdx} className="leading-relaxed text-xs md:text-sm mb-2 text-on-surface-variant">
          {parseInlineContent(line)}
        </p>
      );
    });
  };

  const parseInlineContent = (line: string) => {
    // Basic bold inline and code blocks
    let parts: (string | React.ReactNode)[] = [line];
    
    // Bold matcher: **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    
    // Handle inline parsing recursively or procedurally
    return parseCodeSpans(parseBoldSpans(line));
  };

  const parseBoldSpans = (text: string): (string | React.ReactNode)[] => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-extrabold text-on-surface">{part}</strong>;
      }
      return part;
    });
  };

  const parseCodeSpans = (nodes: (string | React.ReactNode)[]): (string | React.ReactNode)[] => {
    let result: (string | React.ReactNode)[] = [];
    nodes.forEach((node, nodeIdx) => {
      if (typeof node === 'string') {
        const parts = node.split(/`(.*?)`/g);
        parts.forEach((part, index) => {
          if (index % 2 === 1) {
            result.push(<code key={`code-${nodeIdx}-${index}`} className="bg-surface-container-highest px-1.5 py-0.5 rounded font-mono text-xs text-primary font-semibold">{part}</code>);
          } else {
            result.push(part);
          }
        });
      } else {
        result.push(node);
      }
    });
    return result;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 select-none">
      
      {/* Editorial Title Header */}
      <section className="space-y-4">
        <div className="flex items-center space-x-3">
          <span className="h-[1px] w-12 bg-primary"></span>
          <span className="font-label text-xs font-bold tracking-widest text-primary uppercase">
            MarAI CO-COGNITIVE SUITE
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 text-left">
          <div className="space-y-2">
            <h1 className="font-headline text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              MarAI 协同智库大脑
            </h1>
            <p className="font-body text-base text-on-surface-variant max-w-2xl leading-relaxed">
              全局注入最前沿的基础模型能力，实现真实、增强、抗偏置的地缘资本流动与多维特征模拟。
            </p>
          </div>

          <div className="flex items-center gap-2 p-2 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100 self-start md:self-auto shrink-0">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse mx-1" />
            <span>智能主推理模块 Ready</span>
          </div>
        </div>
      </section>

      {/* Intelligent Sandbox layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left column Settings & Prompts (4 cols) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="bg-surface border border-outline-variant/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-surface-container-high text-primary">
                <Cpu className="w-5 h-5" />
                <h4 className="font-headline text-sm font-bold text-on-surface">分析特征参数配置</h4>
              </div>

              {/* Mode Selector */}
              <div className="space-y-3 text-xs font-label">
                <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <div>
                      <p className="font-semibold text-on-surface">搜索增强机制 (Search Grounding)</p>
                      <p className="text-[10px] text-on-surface-variant">融合 Google 实时检索，剔除逻辑偏置</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={searchGrounded}
                    onChange={(e) => setSearchGrounded(e.target.checked)}
                    className="w-4 h-4 text-primary rounded outline-none border-outline-variant cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-tertiary" />
                    <div>
                      <p className="font-semibold text-on-surface">深度思维推导模式 (Reasoning)</p>
                      <p className="text-[10px] text-on-surface-variant">提升长程计算、代码、及演进分析精度</p>
                    </div>
                  </div>
                  <select
                    value={reasoningLevel}
                    onChange={(e) => setReasoningLevel(e.target.value as any)}
                    className="bg-transparent font-medium border-none text-primary cursor-pointer outline-none focus:ring-0 text-[11px]"
                  >
                    <option value="standard">标准精度</option>
                    <option value="high">双重思维链</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Action prompts list */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 py-1 text-on-surface-variant">
                <Info className="w-4 h-4" />
                <h4 className="font-headline text-xs font-bold tracking-wider uppercase">调配预设推导指令</h4>
              </div>

              <div className="space-y-3">
                {PRESET_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActivePromptIndex(idx);
                      handleSendMessage(prompt.query);
                    }}
                    className="w-full text-left p-3.5 bg-surface-container-low/50 hover:bg-primary/5 hover:border-primary/20 border border-outline-variant/10 rounded-2xl transition-all cursor-pointer group flex justify-between items-center"
                  >
                    <div className="space-y-1 truncate pr-1">
                      <p className="font-headline text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                        {prompt.title}
                      </p>
                      <p className="text-[10px] text-on-surface-variant truncate">
                        {prompt.query}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-on-surface-variant flex items-start gap-1 p-3 bg-surface-container-low/40 rounded-xl">
            <Activity className="w-3.5 h-3.5 text-primary mt-0.5" />
            <span>智能助理将实时监听当前激活数据底座中的样本特征。可直接引用 PostgreSQL / Snowflake 数据结构表。</span>
          </div>
        </div>

        {/* Right column Conversational Portal (8 cols) */}
        <div className="lg:col-span-8 bg-surface rounded-3xl p-6 border border-surface-container-highest/50 flex flex-col justify-between h-[600px]">
          
          {/* Chat messaging display terminal */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 select-text scrollbar-thin">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-4 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'
                }`}
              >
                {/* Visual Avatar Identifier */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-white font-semibold text-xs' 
                    : 'bg-primary/10 text-primary'
                }`}>
                  {msg.sender === 'user' ? 'U' : <Brain className="w-4 h-4" />}
                </div>

                <div className="space-y-2">
                  <div className={`p-4 rounded-3xl ${
                    msg.sender === 'user'
                      ? 'bg-primary/5 text-on-surface border border-primary/10'
                      : 'bg-surface-container-low text-on-surface border border-outline-variant/10'
                  }`}>
                    {renderMessageContent(msg.text)}

                    {/* Integrated dynamic clickable chips representing Search result Groundings */}
                    {msg.sender === 'ai' && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-outline-variant/15 space-y-1.5 text-left">
                        <span className="text-[10px] font-label text-on-surface-variant block uppercase tracking-wide">
                          推演参考来源 (Grounding Evidence)
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((src, sIdx) => (
                            <a
                              key={sIdx}
                              href={src.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 bg-surface border border-outline-variant/15 px-2.5 py-1 rounded-full text-[10px] text-primary font-medium hover:bg-primary/5 transition-colors cursor-pointer"
                            >
                              <Globe className="w-3 h-3 text-primary" />
                              <span>{src.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <span className="text-[9px] text-on-surface-variant block font-label px-2">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Inference Loader Indicator */}
            {isLoading && (
              <div className="flex gap-4 max-w-[80%] mr-auto text-left">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary animate-spin">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div className="bg-surface-container-low p-4 rounded-3xl border border-outline-variant/10 animate-pulse space-y-2 w-72">
                  <div className="h-3 bg-surface-container-highest rounded w-3/4" />
                  <div className="h-3 bg-surface-container-highest rounded w-1/2" />
                  <div className="pt-2 flex items-center gap-1.5 text-[10px] font-mono text-primary font-bold">
                    <Terminal className="w-3 h-3 animate-bounce" />
                    <span>MarAI 正在进行多维矩阵特征审计...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat message entry box */}
          <div className="pt-4 border-t border-surface-container-high mt-4">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center bg-surface-container-low rounded-2xl border border-outline-variant/10 group focus-within:border-primary/20 transition-all shadow-sm"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="键入与 亚太消费者意图 / 离线 Snowflake 底座相关的推演细节问题..."
                disabled={isLoading}
                className="flex-1 bg-transparent border-none outline-none font-body text-xs md:text-sm text-on-surface px-5 py-4 disabled:opacity-50 pr-12"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-3.5 p-2 bg-primary disabled:bg-surface-container-highest text-white disabled:text-on-surface-variant rounded-xl transition-all cursor-pointer hover:opacity-90 flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
