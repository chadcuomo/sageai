import { NextRequest } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone"; // Import Pinecone from the new package
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain, VectorDBQAChain } from "langchain/chains";
import { StreamingTextResponse, LangChainStream } from "ai";
import { CallbackManager } from "langchain/callbacks";
import { env } from "~/env.mjs";
import { PromptTemplate } from "langchain/dist/prompts/prompt";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { RunnableSequence } from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";
import { LLMChain } from "langchain/chains";
import { formatDocumentsAsString } from "langchain/util/document";

export async function POST(request: NextRequest) {
  // Parse the POST request's JSON body
  const body = await request.json();

  // Use Vercel's `ai` package to set up a stream
  const { stream, handlers } = LangChainStream();

  const memory = new BufferMemory({
    memoryKey: "chat_history",
    returnMessages: true,
  });

  /* Ensure our chat history is always passed in as a string */
  const serializeChatHistory = (chatHistory: string | Array<string>) => {
    if (Array.isArray(chatHistory)) {
      return chatHistory.join("\n");
    }
    return chatHistory;
  };

  // Define your Pinecone configuration
  const pineconeConfig = {
    apiKey: env.PINECONE_API_KEY || "", // Replace with your Pinecone API key
    environment: "gcp-starter", // Replace with your desired environment
  };

  // Initialize the Pinecone client with the configuration
  const pinecone = new Pinecone(pineconeConfig);

  // Use the Pinecone instance to create an index
  const indexName = env.PINECONE_INDEX_NAME || ""; // Replace with your index name
  const pineconeIndex = pinecone.Index(indexName);

  // Initialize our vector store
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex },
  );

  const results = await vectorStore.similaritySearch("pinecone", 1, {
    bookTitle: "atomic habits",
  });

  console.log('results', results);

  // Specify the OpenAI model we'd like to use, and turn on streaming
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    streaming: true,
    callbackManager: CallbackManager.fromHandlers(handlers),
  });

 
  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
    {
      memory,
    },
  );

  console.log("chain", chain);

  // Call our chain with the prompt given by the user
  chain.call({ query: body.prompt }).catch(console.error);

  // Return an output stream to the frontend
  return new StreamingTextResponse(stream);
}
