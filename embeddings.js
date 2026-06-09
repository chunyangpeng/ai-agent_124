import { client } from './lib/openai.js';

const EMBEDDING_MODEL = 'text-embedding-3-small';

/**
 * 取得單一文字的 Embedding 向量
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export async function getEmbedding(text) {
  const res = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return res.data[0].embedding;
}

/**
 * 批次取得多筆文字的 Embedding 向量
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
export async function getEmbeddings(texts) {
  const res = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

/**
 * 計算兩個向量的餘弦相似度（Cosine Similarity）
 * 回傳值介於 -1 ~ 1，越接近 1 代表越相似
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number}
 */
export function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
