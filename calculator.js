export const calculateTool = {
  type: 'function',
  function: {
    name: 'calculate',
    description: '進行數學計算（支援 + - * / 與括號）',
    parameters: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: '數學運算式，例如 "10+5*2"',
        },
      },
      required: ['expression'],
    },
  },
};

export function calculate({ expression }) {
  try {
    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
      return { error: '非法運算式' };
    }

    const result = new Function(`return (${expression})`)();

    return { result };
  } catch (err) {
    return { error: '計算錯誤' };
  }
}
