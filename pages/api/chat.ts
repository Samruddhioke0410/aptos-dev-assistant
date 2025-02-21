import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { initPinecone } from '../../utils/pinecone';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;
    const pinecone = await initPinecone();
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { pineconeIndex: index }
    );
    
    const relevantDocs = await vectorStore.similaritySearch(message, 3);
    const context = relevantDocs.map(doc => doc.pageContent).join('\n');
    
    const systemPrompt = `You are an AI assistant specialized in Aptos blockchain development. 
    Use the following context to answer questions accurately and concisely. 
    If you're not sure about something, say so rather than making assumptions.
    
    Context: ${context}`;

    const conversationHistory = history
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join('\n');

    const llm = new OpenAI({ 
      temperature: 0.7,
      modelName: 'gpt-4',
    });

    const response = await llm.call(
      `${systemPrompt}\n\nConversation History:\n${conversationHistory}\n\nUser: ${message}\nAssistant:`
    );
    
    res.status(200).json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
