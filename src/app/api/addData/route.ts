import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { type NextRequest, NextResponse } from "next/server";
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone"; 
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbeddings } from "~/app/utils/embeddings";
import md5 from "md5";
import { env } from "~/env.mjs";
import { chunkedUpsert } from "~/app/utils/chunkedUpsert";
import nlp from 'compromise';  // Add this import for NLP functionality

function chunkString(str: string, length: number) {
  const size = Math.ceil(str.length / length);
  const chunks = new Array(size);
  let index = 0;

  for (let i = 0; i < size; i++) {
    chunks[i] = str.slice(index, index + length);
    index += length;
  }
  return chunks;
}

async function embedDocument(doc: Document, bookTitle: string, author: string): Promise<PineconeRecord[]> {
  try {
    const chunks = chunkString(doc.pageContent, 1000);  // 500 is your chunk size
    const chunkVectors = chunks.map(async (chunk) => {
      const embedding = await getEmbeddings(chunk);
      const uniqueId = `${md5(chunk)}-${new Date().toISOString()}`;
      
      return {
        id: uniqueId,
        values: embedding,
        metadata: {
          chunk: chunk,
          text: doc.metadata.text as string,
          bookTitle,
          author
        }
      } as PineconeRecord;
    });
    return await Promise.all(chunkVectors);
  } catch (error) {
    console.error("Error embedding document:", error);
    throw error;
  }
}
export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
  const bookTitle: string | null = data.get("bookTitle") as unknown as string;
  const author: string | null = data.get("author") as unknown as string;

  if (!file) {
    return NextResponse.json({ success: false, error: "No file found" });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ success: false, error: "Invalid file type" });
  }

  const pdfLoader = new PDFLoader(file);
  const splitDocuments = await pdfLoader.loadAndSplit();

  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(env.PINECONE_INDEX_NAME);

  try {
    console.log("Attempting to embed and upsert documents...");
    const vectors = await Promise.all(splitDocuments.flat().map(async document => await embedDocument(document, bookTitle, author)));
    const flattenedVectors = vectors.flat();
    await chunkedUpsert(pineconeIndex, flattenedVectors, '', 10);
    console.log("Successfully embedded and upserted documents.");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed POST request. Error:", error);
    return NextResponse.json({ success: false, error: "Failed to add data" });
  }
}