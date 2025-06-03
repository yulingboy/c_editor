import type { Extension } from '@codemirror/state'
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'

/**
 * C 语言语法高亮主题配置
 */
export const cLanguageHighlightStyle = HighlightStyle.define([
  // 关键字 - 蓝色
  { tag: tags.keyword, color: '#569cd6' },
  { tag: tags.controlKeyword, color: '#c586c0' },
  { tag: tags.operatorKeyword, color: '#569cd6' },
  
  // 数据类型 - 青色
  { tag: tags.typeName, color: '#4ec9b0' },
  { tag: tags.standard(tags.typeName), color: '#4ec9b0' },
  
  // 函数名 - 黄色
  { tag: tags.function(tags.variableName), color: '#dcdcaa' },
  { tag: tags.function(tags.propertyName), color: '#dcdcaa' },
  
  // 字符串 - 橘红色
  { tag: tags.string, color: '#ce9178' },
  { tag: tags.character, color: '#ce9178' },
  
  // 数字 - 浅绿色
  { tag: tags.number, color: '#b5cea8' },
  { tag: tags.integer, color: '#b5cea8' },
  { tag: tags.float, color: '#b5cea8' },
  
  // 注释 - 绿色
  { tag: tags.comment, color: '#6a9955', fontStyle: 'italic' },
  { tag: tags.lineComment, color: '#6a9955', fontStyle: 'italic' },
  { tag: tags.blockComment, color: '#6a9955', fontStyle: 'italic' },
  
  // 预处理器 - 紫色
  { tag: tags.meta, color: '#c586c0' },
  { tag: tags.processingInstruction, color: '#c586c0' },
  
  // 操作符 - 白色
  { tag: tags.operator, color: '#d4d4d4' },
  { tag: tags.arithmeticOperator, color: '#d4d4d4' },
  { tag: tags.logicOperator, color: '#d4d4d4' },
  { tag: tags.compareOperator, color: '#d4d4d4' },
  
  // 分隔符 - 灰色
  { tag: tags.bracket, color: '#d4d4d4' },
  { tag: tags.paren, color: '#d4d4d4' },
  { tag: tags.punctuation, color: '#d4d4d4' },
  { tag: tags.separator, color: '#d4d4d4' },
  
  // 变量名 - 浅蓝色
  { tag: tags.variableName, color: '#9cdcfe' },
  { tag: tags.local(tags.variableName), color: '#9cdcfe' },
  
  // 属性名 - 浅蓝色
  { tag: tags.propertyName, color: '#9cdcfe' },
  
  // 宏定义 - 紫色
  { tag: tags.macroName, color: '#c586c0' },
  
  // 错误 - 红色
  { tag: tags.invalid, color: '#f44747', textDecoration: 'underline' },
  
  // 默认文本 - 白色
  { tag: tags.content, color: '#d4d4d4' }
])

/**
 * 创建 C 语言语法高亮扩展
 */
export function createCHighlightExtension(): Extension {
  return syntaxHighlighting(cLanguageHighlightStyle)
}
