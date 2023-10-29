import { getEmbeddings } from "@/utils/embeddings";
import { Document, MarkdownTextSplitter, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter";
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { chunkedUpsert } from '../../utils/chunkedUpsert'
import md5 from "md5";
import { Crawler, Page } from "./crawler";
import { truncateStringByBytes } from "@/utils/truncateString"

interface SeedOptions {
  splittingMethod: string
  chunkSize: number
  chunkOverlap: number
}

type DocumentSplitter = RecursiveCharacterTextSplitter | MarkdownTextSplitter

async function seed(url: string, limit: number, indexName: string, options: SeedOptions, pages) {
  try {
    // Initialize the Pinecone client
    const pinecone = new Pinecone();

    // Destructure the options object
    const { splittingMethod, chunkSize, chunkOverlap } = options;

 


    // Choose the appropriate document splitter based on the splitting method
    const splitter: DocumentSplitter = splittingMethod === 'recursive' ?
      new RecursiveCharacterTextSplitter({ chunkSize, chunkOverlap }) : new MarkdownTextSplitter({});

    // Prepare documents by splitting the pages
    const documents = await Promise.all(pages.map(page => prepareDocument(page, splitter)));

    // Create Pinecone index if it does not exist
    const indexList = await pinecone.listIndexes();
    const indexExists = indexList.some(index => index.name === indexName)
    if (!indexExists) {
      await pinecone.createIndex({
        name: indexName,
        dimension: 1536,
        waitUntilReady: true,
      });
    }

    const index = pinecone.Index(indexName)

    // Get the vector embeddings for the documents
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    // Upsert vectors into the Pinecone index
    await chunkedUpsert(index!, vectors, '', 10);

    // Return the first document
    return documents[0];
  } catch (error) {
    console.error("Error seeding:", error);
    throw error;
  }
}

/*
Pinecone Initialization: You initialize the Pinecone client right at the start.

Options Destructuring: You're pulling out splittingMethod, chunkSize, and chunkOverlap from the options object.

Crawler Initialization: Then, you initialize a Crawler class instance with depth 1 and limit as either the passed limit or 100 as a fallback.

Page Crawling: You then proceed to crawl the specified URL and store the crawled pages.

Document Splitting: Based on the splittingMethod, you choose between RecursiveCharacterTextSplitter and MarkdownTextSplitter to split the pages into smaller documents.

Pinecone Index Check: Before upserting the data, you check if the Pinecone index exists, and if it doesn't, you create it.

Document Embedding: You transform each document into a vector space using what I assume is a function called embedDocument.

Upsert into Pinecone: Finally, you upsert the vectors into the Pinecone index using a function named chunkedUpsert.

Return: The function returns the first document that was prepared and, I assume, upserted into Pinecone.
*/

async function embedDocument(doc: Document): Promise<PineconeRecord> {
  try {
    // Generate OpenAI embeddings for the document content
    const embedding = await getEmbeddings(doc.pageContent);

    // Create a hash of the document content
    const hash = md5(doc.pageContent);

    // Return the vector embedding object
    return {
      id: hash, // The ID of the vector is the hash of the document content
      values: embedding, // The vector values are the OpenAI embeddings
      metadata: { // The metadata includes details about the document
        chunk: doc.pageContent, // The chunk of text that the vector represents
        text: doc.metadata.text as string, // The text of the document
        url: doc.metadata.url as string, // The URL where the document was found
        hash: doc.metadata.hash as string // The hash of the document content
      }
    } as PineconeRecord;
  } catch (error) {
    console.log("Error embedding document: ", error)
    throw error
  }
}
/*
Get Embeddings: Calls getEmbeddings() to obtain embeddings for the content of a document. I'm assuming getEmbeddings interfaces with some pre-trained model to generate these embeddings.

Hash Creation: Creates an MD5 hash of the document content.

Pinecone Record Formation: Returns a Pinecone record with the following fields:

id: A hash of the document content.
values: The actual embeddings.
metadata: Additional information about the document, including the chunk of text, textual metadata, URL, and hash.
Here are some points to consider:

Hashing Algorithm: MD5 is fast but not the most secure hashing algorithm. Depending on your use case, a more collision-resistant hash might be more suitable.

Error Handling: Just like your other pieces of code, you have basic error handling. Depending on your project's needs, you might consider more robust logging or monitoring.

Asynchronous Operations: It’s asynchronous, which is expected because you’re likely making an external call to get those embeddings.

Metadata Redundancy: You're storing the hash both as the id and within metadata. Is this redundancy needed?
*/

async function prepareDocument(page: Page, splitter: DocumentSplitter): Promise<Document[]> {
  // Get the content of the page
  const pageContent = page.content;

  // Split the documents using the provided splitter
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        url: page.url,
        // Truncate the text to a maximum byte length
        text: truncateStringByBytes(pageContent, 36000)
      },
    }),
  ]);

  // Map over the documents and add a hash to their metadata
  return docs.map((doc: Document) => {
    return {
      pageContent: doc.pageContent,
      metadata: {
        ...doc.metadata,
        // Create a hash of the document content
        hash: md5(doc.pageContent)
      },
    };
  });
}




export default seed;
