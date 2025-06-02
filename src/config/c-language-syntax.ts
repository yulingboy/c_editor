import * as monaco from 'monaco-editor'

/**
 * C 语言语法高亮配置
 */
export const cLanguageSyntax: monaco.languages.IMonarchLanguage = {
  tokenizer: {
    root: [
      // 关键字
      [/\b(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|restrict|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/, 'keyword'],
      
      // 预处理器指令
      [/#\s*(include|define|undef|ifdef|ifndef|if|else|elif|endif|error|pragma|line)\b/, 'keyword.preprocessor'],
      
      // 字符串
      [/"([^"\\]|\\.)*"/, 'string'],
      [/'([^'\\]|\\.)*'/, 'string.char'],
      
      // 注释
      [/\/\/.*$/, 'comment'],
      [/\/\*/, 'comment', '@comment'],
      
      // 数字
      [/\d+\.?\d*([eE][-+]?\d+)?[fFlL]?/, 'number'],
      [/0[xX][0-9a-fA-F]+[lL]?/, 'number.hex'],
      [/0[0-7]+[lL]?/, 'number.octal'],
      
      // 操作符
      [/[+\-*/%=!<>&|^~?:]/, 'operator'],
      [/&&|\|\||<<|>>|\+\+|--/, 'operator'],
      [/==|!=|<=|>=|->|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|<<=|>>=/, 'operator'],
      
      // 分隔符
      [/[{}()\[\];,.]/, 'delimiter'],
      
      // 标识符
      [/[a-zA-Z_]\w*/, 'identifier'],
    ],
    
    comment: [
      [/[^\/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[\/*]/, 'comment']
    ]
  }
}

/**
 * 注册 C 语言语法高亮
 */
export function registerCLanguageSyntax(monacoInstance: typeof monaco) {
  // 注册 C 语言
  monacoInstance.languages.register({ id: 'c' })
  
  // 设置语法高亮
  monacoInstance.languages.setMonarchTokensProvider('c', cLanguageSyntax)
  
  // 设置语言配置
  monacoInstance.languages.setLanguageConfiguration('c', {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/']
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    folding: {
      markers: {
        start: new RegExp('^\\s*#pragma\\s+region\\b'),
        end: new RegExp('^\\s*#pragma\\s+endregion\\b')
      }
    }
  })
}
