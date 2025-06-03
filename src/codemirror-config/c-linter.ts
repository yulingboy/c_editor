import { linter } from '@codemirror/lint'
import type { Diagnostic } from '@codemirror/lint'
import type { Extension } from '@codemirror/state'

/**
 * C 语言语法校验
 */

/**
 * 检查括号匹配
 */
function checkBracketMatching(text: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = []
  const stack: { char: string; pos: number }[] = []
  const brackets = { '{': '}', '[': ']', '(': ')' }
  
  let inString = false
  let inChar = false
  let inComment = false
  let inLineComment = false
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const nextChar = text[i + 1]
    const prevChar = text[i - 1]
    
    // 处理注释
    if (!inString && !inChar) {
      if (char === '/' && nextChar === '/') {
        inLineComment = true
        continue
      }
      if (char === '/' && nextChar === '*') {
        inComment = true
        continue
      }
      if (inComment && char === '*' && nextChar === '/') {
        inComment = false
        i++ // 跳过下一个字符
        continue
      }
      if (inLineComment && char === '\n') {
        inLineComment = false
        continue
      }
    }
    
    // 在注释中跳过检查
    if (inComment || inLineComment) continue
    
    // 处理字符串
    if (char === '"' && prevChar !== '\\') {
      inString = !inString
      continue
    }
    if (char === "'" && prevChar !== '\\') {
      inChar = !inChar
      continue
    }
    
    // 在字符串中跳过检查
    if (inString || inChar) continue
    
    // 检查括号
    if (char in brackets) {
      stack.push({ char: brackets[char as keyof typeof brackets], pos: i })
    } else if (Object.values(brackets).includes(char)) {
      if (stack.length === 0 || stack[stack.length - 1].char !== char) {
        diagnostics.push({
          from: i,
          to: i + 1,
          severity: 'error',
          message: `不匹配的 '${char}'`
        })
      } else {
        stack.pop()
      }
    }
  }
  
  // 检查未闭合的括号
  for (const item of stack) {
    diagnostics.push({
      from: item.pos,
      to: item.pos + 1,
      severity: 'error',
      message: `未闭合的括号`
    })
  }
  
  return diagnostics
}

/**
 * 检查是否包含必要的头文件
 */
function checkRequiredHeaders(text: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = []
  
  // 检查是否已包含某个头文件
  const hasInclude = (header: string) => 
    text.includes(`#include <${header}>`) || text.includes(`#include "${header}"`)
  
  // 检查 stdio.h
  if ((text.includes('printf') || text.includes('scanf') || 
       text.includes('getchar') || text.includes('putchar')) && 
      !hasInclude('stdio.h')) {
    
    // 在文件开头添加警告
    diagnostics.push({
      from: 0,
      to: 1,
      severity: 'warning',
      message: '使用了 stdio 函数，建议包含 #include <stdio.h>'
    })
  }
  
  // 检查 stdlib.h
  if ((text.includes('malloc') || text.includes('free') || 
       text.includes('exit') || text.includes('rand')) && 
      !hasInclude('stdlib.h')) {
    
    diagnostics.push({
      from: 0,
      to: 1,
      severity: 'warning',
      message: '使用了 stdlib 函数，建议包含 #include <stdlib.h>'
    })
  }
  
  // 检查 string.h
  if ((text.includes('strlen') || text.includes('strcmp') || 
       text.includes('strcpy') || text.includes('strcat')) && 
      !hasInclude('string.h')) {
    
    diagnostics.push({
      from: 0,
      to: 1,
      severity: 'warning',
      message: '使用了 string 函数，建议包含 #include <string.h>'
    })
  }
  
  return diagnostics
}

/**
 * 检查基本语法错误
 */
function checkBasicSyntax(text: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = []
  const lines = text.split('\n')
  
  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || 
        trimmed.startsWith('#') || trimmed.endsWith('{') || trimmed.endsWith('}')) {
      return
    }
    
    // 检查可能缺少分号的行
    if (/^\s*(int|char|float|double|return|.*=.*|.*\+\+|.*--)/.test(trimmed) && 
        !trimmed.endsWith(';') && !trimmed.includes('(') && !trimmed.includes(')')) {
      
      const lineStart = lines.slice(0, lineIndex).join('\n').length + (lineIndex > 0 ? 1 : 0)
      const lineEnd = lineStart + line.length
      
      diagnostics.push({
        from: lineEnd - 1,
        to: lineEnd,
        severity: 'error',
        message: '可能缺少分号'
      })
    }
  })
  
  return diagnostics
}

/**
 * C 语言语法校验函数
 */
function cLinter(view: any) {
  const diagnostics: Diagnostic[] = []
  const text = view.state.doc.toString()
  
  // 基本语法检查
  diagnostics.push(...checkBasicSyntax(text))
  
  // 括号匹配检查
  diagnostics.push(...checkBracketMatching(text))
  
  // 头文件检查
  diagnostics.push(...checkRequiredHeaders(text))
  
  // 检查是否有 main 函数
  if (!text.includes('int main') && text.trim().length > 50) {
    diagnostics.push({
      from: 0,
      to: 1,
      severity: 'info',
      message: '建议包含 main 函数作为程序入口'
    })
  }
  
  return diagnostics
}

/**
 * 创建 C 语言语法校验扩展
 */
export function createCLintExtension(): Extension {
  return linter(cLinter, { delay: 500 })
}
