import type { Index, PineconeRecord } from '@pinecone-database/pinecone';

const sliceIntoChunks = <T>(arr: T[], chunkSize: number) => {
  return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
    arr.slice(i * chunkSize, (i + 1) * chunkSize)
  );
};

// Function to truncate text to a maximum length
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength);
};

export const chunkedUpsert = async (
  index: Index,
  vectors: Array<PineconeRecord>,
  namespace: string,
  chunkSize = 10, // Reduce the chunk size further
  maxTextLength = 36000 // Adjust this as needed
) => {
  // Split the vectors into smaller chunks
  const chunks = sliceIntoChunks<PineconeRecord>(vectors, chunkSize);

  try {
    // Upsert each chunk of vectors into the index
    await Promise.allSettled(
      chunks.map(async (chunk) => {
        try {
          // Truncate the text before upserting
          const truncatedChunk = chunk.map((record) => ({
            ...record,
            metadata: {
              ...record.metadata,
              chunk: truncateText(record.metadata.chunk, maxTextLength),
            },
          }));

          await index.namespace(namespace).upsert(truncatedChunk);
        } catch (e) {
          console.log('Error upserting chunk', e);
        }
      })
    );

    return true;
  } catch (e) {
    throw new Error(`Error upserting vectors into index: ${e}`);
  }
};