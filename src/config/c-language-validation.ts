import * as monaco from 'monaco-editor'

/**
 * C 语言语法错误类型
 */
export enum CSyntaxErrorType {
  MISSING_SEMICOLON = 'missing_semicolon',
  UNMATCHED_BRACE = 'unmatched_brace',
  UNMATCHED_PARENTHESIS = 'unmatched_parenthesis',
  UNMATCHED_BRACKET = 'unmatched_bracket',
  INVALID_CHARACTER = 'invalid_character',
  UNDEFINED_VARIABLE = 'undefined_variable',
  INVALID_SYNTAX = 'invalid_syntax',
  MISSING_MAIN_FUNCTION = 'missing_main_function',
  INVALID_INCLUDE = 'invalid_include',
  MISSING_RETURN = 'missing_return'
}

/**
 * 语法错误信息
 */
export interface CSyntaxError {
  type: CSyntaxErrorType
  message: string
  line: number
  column: number
  endLine: number
  endColumn: number
  severity: monaco.MarkerSeverity
}

/**
 * C 语言语法校验器
 */
export class CSyntaxValidator {
  private model: monaco.editor.ITextModel
  private markers: monaco.editor.IMarkerData[] = []

  constructor(model: monaco.editor.ITextModel) {
    this.model = model
  }

  /**
   * 执行语法校验
   */
  validate(): monaco.editor.IMarkerData[] {
    this.markers = []
    const code = this.model.getValue()
    const lines = code.split('\n')

    // 检查各种语法错误
    this.checkBracketMatching(lines)
    this.checkSemicolons(lines)
    this.checkIncludes(lines)
    this.checkMainFunction(code)
    this.checkBasicSyntax(lines)

    return this.markers
  }

  /**
   * 检查括号匹配
   */
  private checkBracketMatching(lines: string[]) {
    const bracketStack: Array<{ char: string; line: number; column: number }> = []
    const bracketPairs = {
      '{': '}',
      '(': ')',
      '[': ']'
    }

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex]
      let inString = false
      let inComment = false
      let inLineComment = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        const nextChar = line[i + 1]

        // 处理注释
        if (!inString && char === '/' && nextChar === '/') {
          inLineComment = true
          i++
          continue
        }
        if (!inString && char === '/' && nextChar === '*') {
          inComment = true
          i++
          continue
        }
        if (inComment && char === '*' && nextChar === '/') {
          inComment = false
          i++
          continue
        }

        if (inLineComment || inComment) continue

        // 处理字符串
        if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
          inString = !inString
          continue
        }

        if (inString) continue

        // 检查开括号
        if (char in bracketPairs) {
          bracketStack.push({ char, line: lineIndex, column: i })
        }
        // 检查闭括号
        else if (Object.values(bracketPairs).includes(char)) {
          if (bracketStack.length === 0) {
            this.addMarker({
              line: lineIndex + 1,
              column: i + 1,
              endLine: lineIndex + 1,
              endColumn: i + 2,
              severity: monaco.MarkerSeverity.Error,
              message: `未匹配的 '${char}'`
            })
          } else {
            const lastBracket = bracketStack.pop()!
            const expectedClosing = bracketPairs[lastBracket.char as keyof typeof bracketPairs]
            if (char !== expectedClosing) {
              this.addMarker({
                line: lineIndex + 1,
                column: i + 1,
                endLine: lineIndex + 1,
                endColumn: i + 2,
                severity: monaco.MarkerSeverity.Error,
                message: `括号不匹配: 期望 '${expectedClosing}' 但发现 '${char}'`
              })
            }
          }
        }
      }
    }

    // 检查未闭合的括号
    bracketStack.forEach(bracket => {
      const expectedClosing = bracketPairs[bracket.char as keyof typeof bracketPairs]
      this.addMarker({
        line: bracket.line + 1,
        column: bracket.column + 1,
        endLine: bracket.line + 1,
        endColumn: bracket.column + 2,
        severity: monaco.MarkerSeverity.Error,
        message: `未闭合的 '${bracket.char}', 期望 '${expectedClosing}'`
      })
    })
  }

  /**
   * 检查分号
   */
  private checkSemicolons(lines: string[]) {
    const requiresSemicolon = /^(\s*).*[^{};]\s*$/
    const isControlStatement = /^\s*(if|while|for|switch|else|do)\s*[\(|{]/
    const isPreprocessor = /^\s*#/
    const isFunctionDeclaration = /^\s*\w+\s+\w+\s*\([^)]*\)\s*$/
    const isComment = /^\s*(\/\/|\/\*)/

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (!line || isPreprocessor.test(line) || isComment.test(line)) {
        continue
      }

      // 检查是否需要分号但没有分号
      if (requiresSemicolon.test(line) && 
          !isControlStatement.test(line) && 
          !isFunctionDeclaration.test(line) &&
          !line.endsWith('{') &&
          line.length > 0) {
        
        // 检查下一行是否是闭合括号
        const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : ''
        if (!nextLine.startsWith('}')) {
          this.addMarker({
            line: i + 1,
            column: lines[i].length,
            endLine: i + 1,
            endColumn: lines[i].length + 1,
            severity: monaco.MarkerSeverity.Error,
            message: '缺少分号 ";"'
          })
        }
      }
    }
  }

  /**
   * 检查 include 语句
   */
  private checkIncludes(lines: string[]) {
    const includeRegex = /^\s*#include\s*[<"]([^>"]+)[">]/
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const match = line.match(/^\s*#include\s*(.*)$/)
      
      if (match) {
        const includeStatement = match[1].trim()
        if (!includeRegex.test(line)) {
          this.addMarker({
            line: i + 1,
            column: 1,
            endLine: i + 1,
            endColumn: line.length + 1,
            severity: monaco.MarkerSeverity.Error,
            message: '无效的 include 语法，应该使用 #include <filename.h> 或 #include "filename.h"'
          })
        }
      }
    }
  }

  /**
   * 检查 main 函数
   */
  private checkMainFunction(code: string) {
    const mainFunctionRegex = /int\s+main\s*\([^)]*\)\s*{/
    if (!mainFunctionRegex.test(code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, ''))) {
      this.addMarker({
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 1,
        severity: monaco.MarkerSeverity.Warning,
        message: '建议定义 main 函数作为程序入口点'
      })
    }
  }

  /**
   * 检查基本语法
   */
  private checkBasicSyntax(lines: string[]) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // 检查无效字符（中文字符等）
      const invalidChars = line.match(/[^\x00-\x7F]/g)
      if (invalidChars) {
        const charIndex = line.search(/[^\x00-\x7F]/)
        this.addMarker({
          line: i + 1,
          column: charIndex + 1,
          endLine: i + 1,
          endColumn: charIndex + 2,
          severity: monaco.MarkerSeverity.Warning,
          message: `可能包含无效字符: ${invalidChars[0]}`
        })
      }

      // 检查常见的语法错误
      if (line.includes('；')) {
        const index = line.indexOf('；')
        this.addMarker({
          line: i + 1,
          column: index + 1,
          endLine: i + 1,
          endColumn: index + 2,
          severity: monaco.MarkerSeverity.Error,
          message: '使用了中文分号，应该使用英文分号 ";"'
        })
      }

      if (line.includes('（') || line.includes('）')) {
        const index = line.search(/[（）]/);
        if (index !== -1) {
          this.addMarker({
            line: i + 1,
            column: index + 1,
            endLine: i + 1,
            endColumn: index + 2,
            severity: monaco.MarkerSeverity.Error,
            message: '使用了中文括号，应该使用英文括号 "()"'
          })
        }
      }
    }
  }

  /**
   * 添加错误标记
   */
  private addMarker(error: {
    line: number
    column: number
    endLine: number
    endColumn: number
    severity: monaco.MarkerSeverity
    message: string
  }) {
    this.markers.push({
      startLineNumber: error.line,
      startColumn: error.column,
      endLineNumber: error.endLine,
      endColumn: error.endColumn,
      severity: error.severity,
      message: error.message,
      source: 'C语言校验器'
    })
  }
}

/**
 * 注册 C 语言语法校验
 */
export function registerCLanguageValidation(monacoInstance: typeof monaco) {
  // 创建诊断适配器
  const diagnosticsAdapter = {
    validate: (model: monaco.editor.ITextModel) => {
      const validator = new CSyntaxValidator(model)
      const markers = validator.validate()
      
      // 设置标记
      monacoInstance.editor.setModelMarkers(model, 'c-language', markers)
    }
  }

  // 监听模型内容变化
  monacoInstance.editor.onDidCreateModel((model) => {
    if (model.getLanguageId() === 'c') {
      // 初始校验
      diagnosticsAdapter.validate(model)
      
      // 监听内容变化进行实时校验
      model.onDidChangeContent(() => {
        // 防抖处理，避免频繁校验
        clearTimeout((model as any)._validationTimeout)
        ;(model as any)._validationTimeout = setTimeout(() => {
          diagnosticsAdapter.validate(model)
        }, 500)
      })
    }
  })

  // 对现有模型进行校验
  monacoInstance.editor.getModels().forEach(model => {
    if (model.getLanguageId() === 'c') {
      diagnosticsAdapter.validate(model)
    }
  })

  console.log('C 语言语法校验已注册')
}
