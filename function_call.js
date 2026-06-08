import { input } from '@inquirer/prompts';
import { client, DEFAULT_MODEL } from './lib/openai.js';
import { spinner } from './utils/spinner.js';
import { toOpenAITool } from './utils/func-tool.js';
import * as allTools from './tools/index.js';

const toolList = Object.values(allTools);
const tools = toolList.map(toOpenAITool);
const AVAILABLE_TOOLS = Object.fromEntries(toolList.map((t) => [t.name, t.fn]));

const messages = [
  {
    role: 'system',
    content: `你是一個實用的 AI 助理，可以幫使用者查詢以下資訊：
- 🕐 目前台灣時間（使用 get_current_time 工具）
- 🌤 指定城市的即時天氣，包括溫度、濕度與天氣狀況（使用 get_weather 工具）

請依照使用者的問題判斷是否需要呼叫工具：
- 若問到時間，請呼叫 get_current_time
- 若問到天氣，請呼叫 get_weather 並傳入對應城市（英文名稱）
- 若同時問到多個問題，請同時呼叫所有需要的工具，取得結果後整合成一個完整的回答

回覆請使用繁體中文。`,
  },
];

try {
  while (true) {
    const userInput = (
      await input({
        message:
          '請輸入你的問題(可以詢問時間及天氣相關的問題)（輸入 exit 離開）：',
      })
    ).trim();

    if (userInput === '') continue;
    if (userInput.toLowerCase() === 'exit') {
      console.log('謝謝你的使用，有任何需要可以天氣跟時間的問題可以再跟我詢問！！');
      break;
    }

    messages.push({ role: 'user', content: userInput });

    // 內層迴圈：持續處理 tool calls，直到 AI 產出最終文字回覆
    while (true) {
      const spin = spinner('思考中...').start();

      const response = await client.chat.completions.create({
        model: DEFAULT_MODEL,
        messages,
        tools,
        tool_choice: 'auto',
      });

      spin.stop();

      const message = response.choices[0].message;
      messages.push(message);

      if (!message.tool_calls || message.tool_calls.length === 0) {
        console.log('\n' + message.content + '\n');
        break;
      }

      for (const toolCall of message.tool_calls) {
        const fnName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        console.log(`\n[呼叫 tool] ${fnName}(${JSON.stringify(args)})`);

        const fn = AVAILABLE_TOOLS[fnName];
        const result = await fn(args);

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    }
  }
} catch (err) {
  if (err.name === 'ExitPromptError') {
    console.log('\n謝謝你的使用，有任何需要可以天氣跟時間的問題可以再跟我詢問！');
  } else {
    throw err;
  }
}
