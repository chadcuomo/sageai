import { Pinecone, type ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { env } from "~/env.mjs";

export type Metadata = {
  bookTitle: string,
  text: string,
  chunk: string,
}

// The function `getMatchesFromEmbeddings` is used to retrieve matches for the given embeddings
const getMatchesFromEmbeddings = async (embeddings: number[], topK: number, namespace: string , bookTitle: string): Promise<ScoredPineconeRecord<Metadata>[]> => {
  // Obtain a client for Pinecone
  const pineconeConfig = {
    apiKey: env.PINECONE_API_KEY || "", // Replace with your Pinecone API key
    environment: "gcp-starter", // Replace with your desired environment
  };

  const pinecone = new Pinecone(pineconeConfig);

  // Use the Pinecone instance to create an index
  const indexName = env.PINECONE_INDEX_NAME || ""; // Replace with your index name
  const pineconeIndex = pinecone.Index(indexName);

  // Get the namespace
//   const pineconeNamespace = index.namespace(namespace ?? '')

  try {
    // Query the index with the defined request
    const queryResult = await pineconeIndex.query({
      vector: embeddings,
      topK,
      filter: {
        "bookTitle": {"$eq": bookTitle},
    },
      includeMetadata: true,
    })
    return queryResult.matches || []
  } catch (e) {
    // Log the error and throw it
    console.log("Error querying embeddings: ", e)
    throw new Error(`Error querying embeddings: ${e}`)
  }
}

export { getMatchesFromEmbeddings }

/*
The getMatchesFromEmbeddings function takes three arguments:

embeddings: The numerical embeddings for which you want to find matches.
topK: The number of top matches you're interested in.
namespace: A string to specify a particular namespace within the index.
It returns a Promise that resolves to an array of ScoredPineconeRecord objects with Metadata types.

Function Flow
Pinecone Client: Initializes a Pinecone client.

Index Name Validation: Checks if the Pinecone index name is set in the environment variables and if that index exists.

Namespace Setup: Retrieves the Pinecone index based on the environment variable and initializes the namespace specified.

Query Execution: Executes a query on Pinecone's index to find the topK matches for the given embeddings.

Error Handling: Catches and logs any error that occurs during the query execution.

Key Points
Pinecone Namespace: The function specifically allows you to operate within a Pinecone namespace, a feature you might be leveraging for data segmentation.

Metadata in Response: The query asks for metadata to be included in the result, which presumably will be data like url, text, chunk, and hash as defined in the Metadata type.

Error Throwing: If any of the preliminary checks fail or if the Pinecone query fails, the function throws an error.

In a nutshell, this utility function is your workhorse for querying Pinecone's index to find the best matches for given embeddings, within a specified namespace.
*/
