import OpenAI from 'openai';
import readline from 'readline';
import { OPENAI_API_KEY } from './config.js';
import { calculateTool, calculate } from './calculator.js';

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask() {
  rl.question('\n請輸入算式（或輸入 exit 離開）：', async (userInput) => {
    if (userInput.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    const messages = [
      {
        role: 'system',
        content:
          '你是一個計算機助手。無論任何數學問題一律使用 calculate tool，禁止自行計算。',
      },
      {
        role: 'user',
        content: userInput,
      },
    ];

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-5-mini',
        messages,
        tools: [calculateTool],
        tool_choice: 'auto',
      });

      const message = response.choices[0].message;
      console.dir(message, { depth: null });

      if (message.tool_calls) {
        const toolCall = message.tool_calls[0];
        const args = JSON.parse(toolCall.function.arguments);

        let toolResult;

        if (toolCall.function.name === 'calculate') {
          toolResult = calculate(args);
        }

        const secondResponse = await client.chat.completions.create({
          model: 'gpt-5-mini',
          messages: [
            ...messages,
            message,
            {
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify(toolResult),
            },
          ],
        });

        console.log('\n✅ 結果：');
        console.log(secondResponse.choices[0].message.content);
      } else {
        console.log('\n🤖 回答：');
        console.log(message.content);
      }
    } catch (err) {
      console.error('❌ 發生錯誤：', err);
    }

    ask();
  });
}

ask();
