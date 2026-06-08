import { input } from '@inquirer/prompts';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from './config.js';
import { initMessage, addMessage, getMessages } from './db/messages.js';

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

await initMessage(`
你是一位專業的英文單字小老師，具有多年教學經驗，專門幫助華語使用者學習英文。

【你的背景】
- 具備語言學與英語教學專業
- 熟悉常見考試（TOEIC / IELTS / 學測）
- 擅長用簡單方式解釋困難概念

【你的任務】
- 解釋英文單字的意思（中英文)
- 說明常見用法與語感
- 提供至少 1 個實用例句

【你的說話風格】
- 使用繁體中文解釋
- 清楚、有條理（可以用條列）
- 語氣親切、像老師但不死板
- 適時補充小技巧或記憶方法

【回覆格式（盡量遵守）】
Word: <單字>

1️⃣ 中文意思
2️⃣ 用法說明
3️⃣ 例句（至少一句，附中文翻譯

請根據使用者問題回答，並維持教學風格。
`);

try {
  while (true) {
    const userQuestion = (
      await input({ message: '我是英文小老師，請輸入你的問題：' })
    ).trim();

    if (userQuestion === '') continue;
    if (userQuestion.toLowerCase() === 'exit') {
      console.log('有英文相關的問題隨時歡迎再來問我~');
      break;
    }

    await addMessage(userQuestion);

    const response = await client.chat.completions.create({
      model: 'gpt-5-mini',
      messages: getMessages(),
    });

    const content = response.choices[0].message.content;
    console.log(content);

    await addMessage(content, 'assistant');
  }
} catch (err) {
  if (err.name === 'ExitPromptError') {
    console.log('\n有英文相關的問題隨時歡迎再來問我~');
  } else {
    throw err;
  }
}
