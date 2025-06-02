import * as monaco from 'monaco-editor'

/**
 * C 语言代码补全建议
 */
export const cCompletionItems = [
  // 基本数据类型
  { 
    label: 'int', 
    kind: monaco.languages.CompletionItemKind.Keyword, 
    insertText: 'int',
    detail: '整数类型',
    documentation: '32位有符号整数类型'
  },
  { 
    label: 'char', 
    kind: monaco.languages.CompletionItemKind.Keyword, 
    insertText: 'char',
    detail: '字符类型',
    documentation: '8位字符类型'
  },
  { 
    label: 'float', 
    kind: monaco.languages.CompletionItemKind.Keyword, 
    insertText: 'float',
    detail: '单精度浮点类型',
    documentation: '32位单精度浮点类型'
  },
  { 
    label: 'double', 
    kind: monaco.languages.CompletionItemKind.Keyword, 
    insertText: 'double',
    detail: '双精度浮点类型',
    documentation: '64位双精度浮点类型'
  },
  { 
    label: 'void', 
    kind: monaco.languages.CompletionItemKind.Keyword, 
    insertText: 'void',
    detail: '空类型',
    documentation: '表示无返回值或无参数'
  },
  { 
    label: 'long', 
    kind: monaco.languages.CompletionItemKind.Keyword, 
    insertText: 'long',
    detail: '长整型',
    documentation: '长整数类型'
  },
  { 
    label: 'short', 
    kind: monaco.languages.CompletionItemKind.Keyword, 
    insertText: 'short',
    detail: '短整型',
    documentation: '短整数类型'
  },
  { 
    label: 'unsigned', 
    kind: monaco.languages.CompletionItemKind.Keyword, 
    insertText: 'unsigned',
    detail: '无符号修饰符',
    documentation: '无符号数修饰符'
  },
  { 
    label: 'signed', 
    kind: monaco.languages.CompletionItemKind.Keyword, 
    insertText: 'signed',
    detail: '有符号修饰符',
    documentation: '有符号数修饰符'
  },
  { 
    label: 'const', 
    kind: monaco.languages.CompletionItemKind.Keyword, 
    insertText: 'const',
    detail: '常量修饰符',
    documentation: '常量修饰符，表示变量不可修改'
  },
  { 
    label: 'static', 
    kind: monaco.languages.CompletionItemKind.Keyword, 
    insertText: 'static',
    detail: '静态修饰符',
    documentation: '静态存储类修饰符'
  },
  { 
    label: 'extern', 
    kind: monaco.languages.CompletionItemKind.Keyword, 
    insertText: 'extern',
    detail: '外部修饰符',
    documentation: '外部变量声明修饰符'
  },
  
  // 控制结构代码片段
  { 
    label: 'if', 
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'if (${1:condition}) {\n\t${2:// code}\n}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'if 条件语句',
    documentation: '条件判断语句'
  },
  {
    label: 'if-else',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'if (${1:condition}) {\n\t${2:// true code}\n} else {\n\t${3:// false code}\n}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'if-else 条件语句',
    documentation: '条件判断语句（含else分支）'
  },
  {
    label: 'for',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'for (${1:int i = 0}; ${2:i < n}; ${3:i++}) {\n\t${4:// code}\n}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'for 循环',
    documentation: 'for 循环语句'
  },
  {
    label: 'while',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'while (${1:condition}) {\n\t${2:// code}\n}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'while 循环',
    documentation: 'while 循环语句'
  },
  {
    label: 'do-while',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'do {\n\t${1:// code}\n} while (${2:condition});',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'do-while 循环',
    documentation: 'do-while 循环语句'
  },
  {
    label: 'switch',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'switch (${1:expression}) {\n\tcase ${2:value1}:\n\t\t${3:// code}\n\t\tbreak;\n\tcase ${4:value2}:\n\t\t${5:// code}\n\t\tbreak;\n\tdefault:\n\t\t${6:// default code}\n\t\tbreak;\n}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'switch 语句',
    documentation: 'switch 多分支选择语句'
  },
  
  // 函数模板
  {
    label: 'main',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'int main() {\n\t${1:// code}\n\treturn 0;\n}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'main 函数',
    documentation: '程序主入口函数'
  },
  {
    label: 'main-args',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'int main(int argc, char *argv[]) {\n\t${1:// code}\n\treturn 0;\n}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'main 函数（带参数）',
    documentation: '带命令行参数的main函数'
  },
  {
    label: 'function',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: '${1:int} ${2:functionName}(${3:parameters}) {\n\t${4:// code}\n\treturn ${5:value};\n}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: '函数模板',
    documentation: '通用函数模板'
  },
  
  // 标准库函数
  {
    label: 'printf',
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: 'printf("${1:%s}\\n"${2:, variable});',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'printf - 格式化输出',
    documentation: '格式化输出函数，需要 #include <stdio.h>'
  },
  {
    label: 'scanf',
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: 'scanf("${1:%d}", &${2:variable});',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'scanf - 格式化输入',
    documentation: '格式化输入函数，需要 #include <stdio.h>'
  },
  {
    label: 'malloc',
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: 'malloc(${1:size})',
    detail: 'malloc - 动态内存分配',
    documentation: '动态内存分配函数，需要 #include <stdlib.h>'
  },
  {
    label: 'free',
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: 'free(${1:ptr});',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'free - 释放内存',
    documentation: '释放动态分配的内存，需要 #include <stdlib.h>'
  },
  {
    label: 'strlen',
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: 'strlen(${1:str})',
    detail: 'strlen - 字符串长度',
    documentation: '获取字符串长度，需要 #include <string.h>'
  },
  {
    label: 'strcpy',
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: 'strcpy(${1:dest}, ${2:src});',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: 'strcpy - 字符串复制',
    documentation: '字符串复制函数，需要 #include <string.h>'
  },
  {
    label: 'strcmp',
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: 'strcmp(${1:str1}, ${2:str2})',
    detail: 'strcmp - 字符串比较',
    documentation: '字符串比较函数，需要 #include <string.h>'
  },
  
  // 头文件
  {
    label: '#include <stdio.h>',
    kind: monaco.languages.CompletionItemKind.Module,
    insertText: '#include <stdio.h>',
    detail: '标准输入输出头文件',
    documentation: '包含 printf, scanf 等标准输入输出函数'
  },
  {
    label: '#include <stdlib.h>',
    kind: monaco.languages.CompletionItemKind.Module,
    insertText: '#include <stdlib.h>',
    detail: '标准库头文件',
    documentation: '包含 malloc, free, exit 等标准库函数'
  },
  {
    label: '#include <string.h>',
    kind: monaco.languages.CompletionItemKind.Module,
    insertText: '#include <string.h>',
    detail: '字符串处理头文件',
    documentation: '包含 strlen, strcpy, strcmp 等字符串处理函数'
  },
  {
    label: '#include <math.h>',
    kind: monaco.languages.CompletionItemKind.Module,
    insertText: '#include <math.h>',
    detail: '数学函数头文件',
    documentation: '包含 sin, cos, sqrt 等数学函数'
  },
  {
    label: '#include <time.h>',
    kind: monaco.languages.CompletionItemKind.Module,
    insertText: '#include <time.h>',
    detail: '时间处理头文件',
    documentation: '包含时间和日期处理函数'
  },
  
  // 预处理器指令
  {
    label: '#define',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: '#define ${1:MACRO_NAME} ${2:value}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: '宏定义',
    documentation: '定义宏常量或宏函数'
  },
  {
    label: '#ifdef',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: '#ifdef ${1:MACRO}\n${2:// code}\n#endif',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    detail: '条件编译',
    documentation: '条件编译指令'
  }
]

/**
 * 注册 C 语言代码补全
 */
export function registerCLanguageCompletion(monacoInstance: typeof monaco) {
  monacoInstance.languages.registerCompletionItemProvider('c', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      }

      const suggestions = cCompletionItems.map(item => ({
        ...item,
        range: range
      }))

      return { suggestions }
    }
  })
}
