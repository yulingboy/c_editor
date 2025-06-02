/**
 * C 语言代码格式化器
 * 基于简化的规则实现代码格式化
 */

export interface FormatterOptions {
  tabSize: number
  insertSpaces: boolean
  maxLineLength: number
  bracketStyle: 'allman' | 'k&r' | 'gnu'
  indentCaseLabels: boolean
  spaceAfterKeywords: boolean
  spaceBeforeFunctionParens: boolean
}

const defaultOptions: FormatterOptions = {
  tabSize: 4,
  insertSpaces: true,
  maxLineLength: 80,
  bracketStyle: 'allman',
  indentCaseLabels: true,
  spaceAfterKeywords: true,
  spaceBeforeFunctionParens: false
}

export class CFormatter {
  private options: FormatterOptions

  constructor(options: Partial<FormatterOptions> = {}) {
    this.options = { ...defaultOptions, ...options }
  }  /**
   * 格式化 C 语言代码
   */
  format(code: string): string {
    // 输入验证
    if (!code || typeof code !== 'string') {
      console.log('格式化器: 输入无效')
      return ''
    }
    
    // 处理空字符串
    if (code.trim() === '') {
      console.log('格式化器: 输入为空')
      return ''
    }

    // 防止处理过长的代码
    if (code.length > 100000) {
      console.warn('格式化器: 代码过长，跳过格式化')
      return code
    }

    try {
      console.log('格式化器: 开始处理，代码长度:', code.length)
      
      const lines = code.split('\n')
      const formattedLines: string[] = []
      let indentLevel = 0
      let inComment = false
      let inString = false
      let inChar = false

      // 限制处理的行数，防止无限循环
      const maxLines = Math.min(lines.length, 1000)
        for (let i = 0; i < maxLines; i++) {
        const line = lines[i].trim()
        
        if (!line) {
          formattedLines.push('')
          continue
        }

        // 处理预处理器指令
        if (line.startsWith('#')) {
          formattedLines.push(line)
          continue
        }

        // 首先处理缩进逻辑
        let lineIndentLevel = indentLevel
        
        // 如果行以}开头，减少缩进
        if (line.startsWith('}')) {
          lineIndentLevel = Math.max(0, indentLevel - 1)
        }
        // 如果行以else开头，与对应的if保持同级
        else if (line.startsWith('else')) {
          lineIndentLevel = Math.max(0, indentLevel - 1)
        }

        // 处理行内容
        const { processedLine, newIndentLevel } = this.processLine(
          line, 
          indentLevel, 
          { inComment, inString, inChar }
        )

        // 更新状态
        const state = this.updateState(line, { inComment, inString, inChar })
        inComment = state.inComment
        inString = state.inString
        inChar = state.inChar

        // 应用缩进 - 使用计算出的行缩进级别
        const safeIndentLevel = Math.max(0, Math.min(lineIndentLevel, 20))
        const indentedLine = this.applyIndent(processedLine, safeIndentLevel)
        formattedLines.push(indentedLine)

        // 更新下一行的缩进级别
        indentLevel = Math.max(0, Math.min(newIndentLevel, 20))
      }

      // 如果有未处理的行，直接添加
      if (lines.length > maxLines) {
        console.warn('格式化器: 部分行未处理，直接添加')
        for (let i = maxLines; i < lines.length; i++) {
          formattedLines.push(lines[i])
        }
      }

      const result = formattedLines.join('\n')
      console.log('格式化器: 完成处理，结果长度:', result.length)
      return result
      
    } catch (error) {
      console.error('格式化过程中出错:', error)
      return code // 出错时返回原始代码
    }
  }  /**
   * 处理单行代码 - 改进版本
   */
  private processLine(
    line: string, 
    currentIndent: number, 
    state: { inComment: boolean, inString: boolean, inChar: boolean }
  ): { processedLine: string, newIndentLevel: number } {
    let processedLine = line
    let newIndentLevel = currentIndent

    // 如果在多行注释中，保持原有缩进
    if (state.inComment) {
      return { processedLine, newIndentLevel: currentIndent }
    }

    // 计算大括号对下一行缩进的影响
    const openBraces = (line.match(/\{/g) || []).length
    const closeBraces = (line.match(/\}/g) || []).length
    
    // 更新下一行的缩进级别
    newIndentLevel = currentIndent + openBraces - closeBraces

    // 改进的关键字格式化
    if (this.options.spaceAfterKeywords) {
      processedLine = this.addSpacesAfterKeywords(processedLine)
    }
    
    // 改进操作符格式化
    processedLine = this.formatOperators(processedLine)

    return { processedLine, newIndentLevel }
  }
  /**
   * 更新解析状态 - 简化版本
   */
  private updateState(
    line: string, 
    state: { inComment: boolean, inString: boolean, inChar: boolean }
  ): { inComment: boolean, inString: boolean, inChar: boolean } {
    // 简化状态更新，只处理基本情况
    let { inComment, inString, inChar } = state

    // 检查多行注释的结束
    if (inComment && line.includes('*/')) {
      inComment = false
    }
    
    // 检查多行注释的开始（只在非字符串状态下）
    if (!inString && !inChar && !inComment && line.includes('/*')) {
      inComment = true
    }

    return { inComment, inString, inChar }
  }

  /**
   * 应用缩进
   */
  private applyIndent(line: string, indentLevel: number): string {
    const indent = this.options.insertSpaces 
      ? ' '.repeat(this.options.tabSize * indentLevel)
      : '\t'.repeat(indentLevel)
    
    return indent + line
  }  /**
   * 在关键字后添加空格
   */
  private addSpacesAfterKeywords(line: string): string {
    const keywords = ['if', 'while', 'for', 'switch', 'return', 'sizeof']
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\(`, 'g')
      line = line.replace(regex, `${keyword} (`)
    })

    return line
  }

  /**
   * 格式化操作符 - 安全版本
   */
  private formatOperators(line: string): string {
    try {
      // 在赋值操作符周围添加空格
      line = line.replace(/([a-zA-Z0-9_])\s*=\s*([a-zA-Z0-9_])/g, '$1 = $2')
      
      // 在比较操作符周围添加空格
      line = line.replace(/([a-zA-Z0-9_])\s*>\s*([a-zA-Z0-9_])/g, '$1 > $2')
      line = line.replace(/([a-zA-Z0-9_])\s*<\s*([a-zA-Z0-9_])/g, '$1 < $2')
      
      // 在逗号后添加空格
      line = line.replace(/,\s*/g, ', ')
      
      return line
    } catch (error) {
      console.warn('操作符格式化失败，返回原始行:', error)
      return line
    }
  }

  /**
   * 更新格式化选项
   */
  updateOptions(options: Partial<FormatterOptions>): void {
    this.options = { ...this.options, ...options }
  }

  /**
   * 获取当前选项
   */
  getOptions(): FormatterOptions {
    return { ...this.options }
  }
}

/**
 * 默认格式化器实例
 */
export const defaultFormatter = new CFormatter()

/**
 * 快速格式化函数
 */
export function formatCCode(code: string, options?: Partial<FormatterOptions>): string {
  const formatter = options ? new CFormatter(options) : defaultFormatter
  return formatter.format(code)
}
