import { CompletionContext, autocompletion } from '@codemirror/autocomplete'
import type { Extension } from '@codemirror/state'

/**
 * C 语言关键字和函数补全配置
 */

// C 语言关键字
const cKeywords = [
  'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
  'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if',
  'inline', 'int', 'long', 'register', 'restrict', 'return', 'short',
  'signed', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union',
  'unsigned', 'void', 'volatile', 'while', '_Bool', '_Complex', '_Imaginary'
]

// 标准库函数
const cStandardFunctions = [
  // stdio.h
  'printf', 'scanf', 'fprintf', 'fscanf', 'sprintf', 'sscanf',
  'fopen', 'fclose', 'fread', 'fwrite', 'fseek', 'ftell', 'rewind',
  'getchar', 'putchar', 'gets', 'puts', 'fgets', 'fputs',
  
  // stdlib.h
  'malloc', 'calloc', 'realloc', 'free', 'exit', 'abort',
  'atoi', 'atof', 'atol', 'strtol', 'strtod', 'rand', 'srand',
  
  // string.h
  'strlen', 'strcmp', 'strncmp', 'strcpy', 'strncpy', 'strcat', 'strncat',
  'strchr', 'strrchr', 'strstr', 'strtok', 'memcpy', 'memmove', 'memset', 'memcmp',
  
  // math.h
  'sqrt', 'pow', 'exp', 'log', 'log10', 'sin', 'cos', 'tan',
  'asin', 'acos', 'atan', 'atan2', 'ceil', 'floor', 'fabs',
  
  // time.h
  'time', 'clock', 'difftime', 'mktime', 'strftime', 'ctime', 'gmtime', 'localtime'
]

// 预处理器指令
const cPreprocessor = [
  '#include', '#define', '#undef', '#ifdef', '#ifndef', '#if', '#endif',
  '#else', '#elif', '#pragma', '#error', '#warning', '#line'
]

// 常用头文件
const cHeaders = [
  '<stdio.h>', '<stdlib.h>', '<string.h>', '<math.h>', '<time.h>',
  '<ctype.h>', '<assert.h>', '<errno.h>', '<float.h>', '<limits.h>',
  '<locale.h>', '<setjmp.h>', '<signal.h>', '<stdarg.h>', '<stddef.h>'
]

// 代码模板
const cTemplates = [
  {
    label: 'main',
    detail: 'main function template',
    info: '主函数模板',
    apply: 'int main() {\n    ${}\n    return 0;\n}'
  },
  {
    label: 'for',
    detail: 'for loop template',
    info: 'for 循环模板',
    apply: 'for (int ${i} = 0; ${i} < ${n}; ${i}++) {\n    ${}\n}'
  },
  {
    label: 'while',
    detail: 'while loop template',
    info: 'while 循环模板',
    apply: 'while (${condition}) {\n    ${}\n}'
  },
  {
    label: 'if',
    detail: 'if statement template',
    info: 'if 语句模板',
    apply: 'if (${condition}) {\n    ${}\n}'
  },
  {
    label: 'ifelse',
    detail: 'if-else statement template',
    info: 'if-else 语句模板',
    apply: 'if (${condition}) {\n    ${}\n} else {\n    ${}\n}'
  },
  {
    label: 'switch',
    detail: 'switch statement template',
    info: 'switch 语句模板',
    apply: 'switch (${expression}) {\n    case ${value}:\n        ${}\n        break;\n    default:\n        ${}\n        break;\n}'
  },
  {
    label: 'struct',
    detail: 'struct definition template',
    info: '结构体定义模板',
    apply: 'struct ${name} {\n    ${}\n};'
  }
]

/**
 * C 语言补全函数
 */
function cCompletion(context: CompletionContext) {
  const word = context.matchBefore(/\w*/)
  if (!word) return null
  
  if (word.from === word.to && !context.explicit) return null

  const completions = []

  // 添加关键字补全
  for (const keyword of cKeywords) {
    if (keyword.startsWith(word.text)) {
      completions.push({
        label: keyword,
        type: 'keyword',
        detail: 'C keyword',
        info: `C 语言关键字: ${keyword}`
      })
    }
  }

  // 添加函数补全
  for (const func of cStandardFunctions) {
    if (func.startsWith(word.text)) {
      completions.push({
        label: func,
        type: 'function',
        detail: 'Standard function',
        info: `标准库函数: ${func}()`,
        apply: `${func}()`
      })
    }
  }

  // 添加预处理器补全
  for (const prep of cPreprocessor) {
    if (prep.startsWith(word.text)) {
      completions.push({
        label: prep,
        type: 'keyword',
        detail: 'Preprocessor directive',
        info: `预处理器指令: ${prep}`
      })
    }
  }

  // 添加头文件补全
  if (word.text === 'include' || context.state.sliceDoc(word.from - 8, word.from) === '#include') {
    for (const header of cHeaders) {
      completions.push({
        label: header,
        type: 'text',
        detail: 'Header file',
        info: `头文件: ${header}`
      })
    }
  }

  // 添加代码模板补全
  for (const template of cTemplates) {
    if (template.label.startsWith(word.text)) {
      completions.push({
        label: template.label,
        type: 'text',
        detail: template.detail,
        info: template.info,
        apply: template.apply
      })
    }
  }

  return {
    from: word.from,
    options: completions
  }
}

/**
 * 创建 C 语言自动补全扩展
 */
export function createCCompletionExtension(): Extension {
  return autocompletion({
    override: [cCompletion],
    activateOnTyping: true,
    maxRenderedOptions: 20
  })
}
