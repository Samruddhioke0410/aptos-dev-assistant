import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { initPinecone } from '../utils/pinecone';
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Fetches Aptos documentation from multiple sources.
 * This function scrapes content from official Aptos documentation, GitHub, and other resources.
 */
async function fetchAptosDocuments(): Promise<Document[]> {
  const baseUrls = [
    'https://aptos.dev/en/build/smart-contracts/book/modules-and-scripts',
    'https://aptos.dev/en/build/smart-contracts/scripts',
    'https://aptos.guide/en/build/smart-contracts/scripts/running-scripts',
    'https://aptos-labs.github.io/ts-sdk-doc/',
    'https://github.com/aptos-labs/developer-docs'
  ];

  const documents: Document[] = [];

  for (const baseUrl of baseUrls) {
    try {
      console.log(`Fetching content from ${baseUrl}...`);
      const response = await axios.get(baseUrl);
      const $ = cheerio.load(response.data);

      // Extract text content from relevant HTML tags
      $('article, section, div, p, pre, code').each((_, element) => {
        const text = $(element).text().trim();
        if (text) {
          documents.push(
            new Document({
              pageContent: text,
              metadata: { source: baseUrl }
            })
          );
        }
      });
    } catch (error) {
      console.error(`Error fetching content from ${baseUrl}:`, error.message);
    }
  }

  return documents;
}

/**
 * Main function to ingest documents into Pinecone.
 * It fetches the documents, splits them into smaller chunks, and stores them in Pinecone.
 */
async function ingestDocs() {
  try {
    // Initialize Pinecone client
    const pinecone = await initPinecone();
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

    console.log('Fetching Aptos documentation...');
    const rawDocs = await fetchAptosDocuments();

    console.log(`Fetched ${rawDocs.length} raw documents. Splitting into chunks...`);
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    });

    // Split documents into smaller chunks for better embeddings
    const splitDocs = await textSplitter.splitDocuments(rawDocs);
    console.log(`Split into ${splitDocs.length} document chunks.`);

    console.log('Creating embeddings and storing in Pinecone...');
    await PineconeStore.fromDocuments(
      splitDocs,
      new OpenAIEmbeddings(),
      { pineconeIndex: index }
    );

    console.log('Ingestion complete! Documents are now stored in Pinecone.');
  } catch (error) {
    console.error('Error during ingestion:', error.message);
  }
}

// Run the ingestion process
ingestDocs();
