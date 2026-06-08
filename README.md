# 🧠 Node.js 功能整合專案

本專案包含多個練習題，主要展示聊天機器人、計算機與 Function Calling（工具呼叫）等功能。

---

## 📌 選題清單

- 題目 1 → `main_chat_bot.js`
- 題目 2 → `main_calculator.js`
- 題目 4 → `function_call.js`
- 題目 5 → （未展示）

---



第四題 function calling 執行結果: 

❯ node function_call.js

✔ 請輸入你的問題(可以詢問時間及天氣相關的問題)（輸入 exit 離開）： 現在幾點?
[呼叫 tool] get_current_time({})
現在是 2026/6/8 下午5:13:12（台灣時間）。需要我幫你做其他事嗎？

✔ 請輸入你的問題(可以詢問時間及天氣相關的問題)（輸入 exit 離開）： 台中現在天氣如何?
[呼叫 tool] get_weather({"city":"Taichung"})
台中現在是陰、多雲，溫度約 28.95°C，濕度 76%。需要我幫你看未來幾小時或幾天的天氣預報嗎？

✔ 請輸入你的問題(可以詢問時間及天氣相關的問題)（輸入 exit 離開）： 現在幾點? 六都天氣如何?
[呼叫 tool] get_current_time({})
[呼叫 tool] get_weather({"city":"Taipei"})
[呼叫 tool] get_weather({"city":"New Taipei"})
[呼叫 tool] get_weather({"city":"Taoyuan"})
[呼叫 tool] get_weather({"city":"Taichung"})
[呼叫 tool] get_weather({"city":"Tainan"})
[呼叫 tool] get_weather({"city":"Kaohsiung"})

現在是 2026/6/8 下午5:13:55（台灣時間）。六都目前天氣如下：
- 台北市：陰、多雲，溫度 26.4°C，濕度 56%
- 新北市：小雨，溫度 26.7°C，濕度 16%
- 桃園市：陰、多雲，溫度 23.7°C，濕度 39%
- 台中市：陰、多雲，溫度 29.0°C，濕度 76%
- 台南市：小雨，溫度 27.3°C，濕度 88%
- 高雄市：陰、多雲，溫度 26.6°C，濕度 95%

注意：新北與台南目前有小雨，外出可考慮帶傘。要我幫你看各地未來幾小時或幾天的預報、雷達圖，或特定城市的詳細資訊嗎？

? 請輸入你的問題(可以詢問時間及天氣相關的問題)（輸入 exit 離開）：

謝謝你的使用，有任何需要可以天氣跟時間的問題可以再跟我詢問！