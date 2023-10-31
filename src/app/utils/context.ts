import { type ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { getMatchesFromEmbeddings } from "./pinecone";
import { getEmbeddings } from './embeddings'

export type Metadata = {
  bookTitle: string,
  text: string,
  chunk: string,
}

// The function `getContext` is used to retrieve the context of a given message
export const getContext = async (message: string, namespace: string, bookTitle: string): Promise<string | ScoredPineconeRecord[]> => {
 const maxTokens = 3000
 const minScore = 0.7
 const getOnlyText = true
  // Get the embeddings of the input message
  const embedding = await getEmbeddings(message);

  // Retrieve the matches for the embeddings from the specified namespace
  const matches = await getMatchesFromEmbeddings(embedding, 3, namespace, bookTitle);

  // Filter out the matches that have a score lower than the minimum score
  const qualifyingDocs = matches.filter(m => m.score && m.score > minScore);

  if (!getOnlyText) {
    // Use a map to deduplicate matches by URL
    return qualifyingDocs
  }

  let docs = matches ? qualifyingDocs.map(match => (match.metadata as Metadata).chunk) : [];
  // Join all the chunks of text together, truncate to the maximum number of tokens, and return the result
  return docs.join("\n").substring(0, maxTokens)
}

/*
The getContext function is designed to retrieve the context for a given message. It takes in five arguments:

message: The message string for which the context is needed.
namespace: A namespace used to fetch relevant data.
maxTokens: Maximum number of tokens in the returned context (default is 3000).
minScore: The minimum score for matches to be considered (default is 0.7).
getOnlyText: Flag to decide if only text data is needed (default is true).
The function returns a Promise that can either be a string containing the context or an array of ScoredVector objects.

Flow
Embedding Retrieval: Uses the getEmbeddings function to get the embeddings for the message.

Fetching Matches: Utilizes the getMatchesFromEmbeddings function to retrieve vectors that match the embeddings within the specified namespace. It tries to fetch 3 such matches.

Qualification Filter: Filters out matches that have a score lower than minScore.

Data Formatting: If getOnlyText is false, the function returns the qualifying matches as they are (likely for further processing).

Context Preparation: If getOnlyText is true, the function maps over the qualifying matches and extracts the chunk from each match's metadata. It then joins these chunks, truncates them to maxTokens length, and returns the resulting string.

Return Value
It returns either a string or an array of ScoredVector based on the getOnlyText flag. The string would be the aggregated and truncated context while the array would be the raw data for further manipulation.
*/
