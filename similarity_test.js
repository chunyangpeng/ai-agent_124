import { getEmbeddings, cosineSimilarity } from './embeddings.js';

const groups = [
  {
    name: '第 1 組：意思相近的句子',
    sentences: ['我喜歡貓', '貓咪很可愛', '我養了一隻貓'],
  },
  {
    name: '第 2 組：意思不同的句子',
    sentences: ['今天天氣很好', '我要去買菜', '電腦壞了'],
  },
  {
    name: '第 3 組：自訂測試案例',
    sentences: ['學習程式設計很有趣', '寫程式可以解決問題', '今晚要吃火鍋'],
  },
];

async function main() {
  console.log('=== 向量相似度實驗 ===\n');

  for (const group of groups) {
    console.log(`📌 ${group.name}`);
    console.log(`   句子：${group.sentences.map((s) => `「${s}」`).join('、')}`);

    const vectors = await getEmbeddings(group.sentences);

    console.log('   相似度計算結果：');
    for (let i = 0; i < group.sentences.length; i++) {
      for (let j = i + 1; j < group.sentences.length; j++) {
        const similarity = cosineSimilarity(vectors[i], vectors[j]);
        console.log(
          `     「${group.sentences[i]}」vs「${group.sentences[j]}」→ ${similarity.toFixed(4)}`
        );
      }
    }
    console.log();
  }

  console.log('=== 預期結果 ===');
  console.log('✅ 第 1 組（貓咪主題）的句子語意相近，相似度應明顯高於其他組');
  console.log('✅ 第 2 組（意思不同）的句子各自獨立，相似度應相對較低');
  console.log('✅ 第 3 組中前兩句（程式設計）應比第三句（火鍋）彼此更相似');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
