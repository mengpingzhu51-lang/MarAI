import type { NextApiRequest, NextApiResponse } from 'next';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MemorySaver } from '@langchain/langgraph';
import { HumanMessage, SystemMessage, isAIMessage } from '@langchain/core/messages';

// ---------------------------------------------------------------------------
// LangGraph.js Agent Setup
// ---------------------------------------------------------------------------
// Lazy initialization to keep cold-start light and tolerate missing config.
// The agent is OpenAI-compatible: works with OpenAI, Azure OpenAI, DeepSeek,
// vLLM, OpenRouter, Together, Groq, or any self-hosted gateway exposing the
// OpenAI Chat Completions schema.
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT =
  'You are MarAI, a premium data intelligence platform and core decision intelligence agent. ' +
  'Speak in highly elegant, objective, standard Simplified Chinese. ' +
  'Present information clearly, with beautiful spacing, rich bullet points, and appropriate professional styling. ' +
  'Use Markdown for structuring your responses.';

let agentInstance: ReturnType<typeof createReactAgent> | null = null;

function getAgent() {
  if (agentInstance) return agentInstance;

  const apiKey = process.env.LANGGRAPH_LLM_API_KEY;
  const baseURL = process.env.LANGGRAPH_LLM_BASE_URL;
  const model = process.env.LANGGRAPH_LLM_MODEL || 'gpt-4o-mini';
  const temperature = Number(process.env.LANGGRAPH_LLM_TEMPERATURE ?? '0.2');
  const maxTokensRaw = process.env.LANGGRAPH_LLM_MAX_TOKENS;
  const maxTokens = maxTokensRaw ? Number(maxTokensRaw) : 2048;

  if (!apiKey) {
    throw new Error('LANGGRAPH_LLM_API_KEY is not configured');
  }

  const llm = new ChatOpenAI({
    apiKey,
    model,
    temperature,
    maxTokens,
    // configuration.baseURL applies to OpenAI-compatible gateways.
    ...(baseURL ? { configuration: { baseURL } } : {}),
  });

  agentInstance = createReactAgent({
    llm,
    // No tools wired in by default — extend here (e.g. retrieval, web search).
    tools: [],
    checkpointSaver: new MemorySaver(),
  });

  return agentInstance;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, threadId } = req.body ?? {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: '消息内容不能为空' });
    }

    if (!process.env.LANGGRAPH_LLM_API_KEY) {
      // Fallback simulation when the agent backend is not configured.
      return res.json({
        text:
          `💡 **【MarAI 数据智能系统提示：LangGraph 演示模式】**\n` +
          `当前未配置 \`LANGGRAPH_LLM_API_KEY\`，本节点已自动切换至本地仿真分析引擎。配置 LangGraph 端点后，将由 LangGraph.js 智能体提供实时分析。\n\n` +
          `针对您的提问 **「${message}」**，MarAI 模拟得出以下指标：\n\n` +
          `1. **景气特征**：周期间隔上升阻力，置信度 **91.4%**。\n` +
          `2. **数据集状态**：Amazon S3 / Snowflake 已连接。\n` +
          `3. **建议**：聚焦行业转折节点，结合「数据归档」清洗历史卷宗以微调决策误差。\n\n` +
          `*请在 \`.env\` 中配置 \`LANGGRAPH_LLM_*\` 系列变量后重启服务。*`,
        sources: [
          { title: 'MarAI 宏观分析知识库 (LangGraph 节点)', uri: '#' },
          { title: 'AWS 与 Snowflake 数据集成模型', uri: '#' },
        ],
      });
    }

    const agent = getAgent();

    const finalState = await agent.invoke(
      {
        messages: [
          new SystemMessage(SYSTEM_PROMPT),
          new HumanMessage(message),
        ],
      },
      {
        configurable: { thread_id: threadId || 'marai-default' },
      }
    );

    // Extract the last AI message as the agent's reply.
    const messages = (finalState as any).messages ?? [];
    const lastAi = [...messages].reverse().find((m: any) => isAIMessage(m));
    const text =
      typeof lastAi?.content === 'string'
        ? lastAi.content
        : Array.isArray(lastAi?.content)
        ? lastAi.content.map((c: any) => c?.text ?? '').join('')
        : '无法生成有效的智能分析，请稍后重试。';

    return res.json({ text, sources: [] });
  } catch (err: any) {
    console.error('LangGraph inference error:', err);
    return res
      .status(500)
      .json({ error: err?.message || '服务器端 LangGraph 推理计算遇到了问题' });
  }
}
