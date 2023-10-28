import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { type NextRequest, NextResponse } from "next/server";
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone"; // Import Pinecone from the new package
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbeddings } from "~/app/utils/embeddings";
import md5 from "md5";
import { env } from "~/env.mjs";
import { chunkedUpsert } from "~/app/utils/chunkedUpsert";


async function embedDocument(doc: Document, bookTitle: string): Promise<PineconeRecord> {
    try {
      const embedding = await getEmbeddings(doc.pageContent);
      const hash = md5(doc.pageContent);
  
      return {
        id: hash,
        values: embedding,
        metadata: {
          chunk: doc.pageContent,
          text: doc.metadata.text as string,
          bookTitle,
          hash: doc.metadata.hash as string
        }
      } as PineconeRecord;
    } catch (error) {
      console.log("Error embedding document: ", error)
      throw error;
    }
  }

export async function POST(request: NextRequest) {
  // Extract FormData from the request
  const data = await request.formData();
  // Extract the uploaded file from the FormData
  const file: File | null = data.get("file") as unknown as File;

  // Make sure file exists
  if (!file) {
    return NextResponse.json({ success: false, error: "No file found" });
  }

  // Make sure the file is a PDF
  if (file.type !== "application/pdf") {
    return NextResponse.json({ success: false, error: "Invalid file type" });
  }

  // Use the PDFLoader to load the PDF 
  const pdfLoader = new PDFLoader(file);

    // Use the PDFLoader to split the PDF into documents
  const splitDocuments = await pdfLoader.loadAndSplit();

//   console.log(splitDocuments)

// Instantiate a new Pinecone client, which will automatically read the
// env vars: PINECONE_API_KEY and PINECONE_ENVIRONMENT which come from
// the Pinecone dashboard at https://app.pinecone.io

const pinecone = new Pinecone();

const pineconeIndex = pinecone.Index(env.PINECONE_INDEX_NAME);

  // Use Langchain's integration with Pinecone to store the documents
//   await PineconeStore.fromDocuments(splitDocuments, new OpenAIEmbeddings(), {
//     pineconeIndex,
//   });
try {
    const vectors = await Promise.all(splitDocuments.flat().map(document => embedDocument(document, 'atomic habits')));
    await chunkedUpsert(pineconeIndex, vectors, '', 10);
    return NextResponse.json({ success: true });
    // console.log(vectors)
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, error: "Failed to add data" });
  }

//   return NextResponse.json({ success: true });
}