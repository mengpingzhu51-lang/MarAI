import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from "@google/genai";

// Lazy initialize Gemini client to adhere to agent constraints (resilient to missing keys)
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "消息内容不能为空" });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Simulate reply if key is not configured
      return res.json({
        text: `💡 **【MarAI 数据智能系统提示：Next.js 演示模式】**\n由于系统当前未配置 \`GEMINI_API_KEY\` 凭证，本 Next.js 节点已自动为您调配高度仿真的本地分析引擎。配置 API 密钥后，系统将为您提供实时的、网络检索增强后的权威市场分析。\n\n针对您的提问 **「${message}」**，MarAI 模拟计算出以下市场洞察指标：\n\n1. **宏观景气特征分析**：该提问涉及的数据流当前表现出周期间隔的上升阻力，置信度判定为 **91.4%**。\n2. **数据集同步可用度**：关联的 Amazon S3 与 Snowflake 数据集已在新 Next.js 微服务体系中激活连接状态。\n3. **多维推理结论**：建议聚焦行业核心转折节点，通过「数据归档」板块进一步清洗历史卷卷宗以微调决策误差。\n\n*您可在 **Settings（设置）** 或 **AI Studio 平台环境的 Secrets 管理面板** 中配置真实的 API 密钥。*`,
        sources: [
          { title: "MarAI 宏观分析知识库 (Next.js 节点)", uri: "#" },
          { title: "AWS 与 Snowflake 数据集成模型", uri: "#" }
        ]
      });
    }

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: "You are MarAI, a premium data intelligence platform and core decision intelligence agent. Speak in highly elegant, objective, standard Simplified Chinese. Present information clear, with beautiful spacing, rich bullet points, and appropriate professional styling context. Use Markdown for structuring your responses.",
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "无法生成有效的智能分析，请稍后重试。";
    
    // Extract url groundings
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = chunks ? chunks.map((c: any) => ({
      title: c.web?.title || c.web?.uri || "Grounding Reference",
      uri: c.web?.uri
    })).filter((s: any) => s.uri) : [];

    res.json({ text, sources });
  } catch (err: any) {
    console.error("Gemini Next.js Inference error:", err);
    res.status(500).json({ error: err?.message || "服务器端多模态推理计算遇到了问题" });
  }
}
