import * as monaco from 'monaco-editor'
import { registerCLanguageSyntax } from './c-language-syntax'
import { registerCLanguageCompletion } from './c-language-completion'
import { registerCLanguageValidation } from './c-language-validation'

/**
 * Monaco Editor C 语言配置
 */
export class CLanguageConfig {
  private static initialized = false

  /**
   * 初始化 C 语言支持
   */
  static async initialize(monacoInstance: typeof monaco) {
    if (this.initialized) {
      return
    }    try {
      // 注册语法高亮
      registerCLanguageSyntax(monacoInstance)
      
      // 注册代码补全
      registerCLanguageCompletion(monacoInstance)
      
      // 注册语法校验
      registerCLanguageValidation(monacoInstance)
      
      this.initialized = true
      console.log('C 语言配置初始化完成')
    } catch (error) {
      console.error('C 语言配置初始化失败:', error)
      throw error
    }
  }

  /**
   * 检查是否已初始化
   */
  static isInitialized(): boolean {
    return this.initialized
  }

  /**
   * 重置初始化状态（仅用于测试）
   */
  static reset() {
    this.initialized = false
  }
}

/**
 * 默认导出初始化函数
 */
export default function initializeCLanguage(monacoInstance: typeof monaco) {
  return CLanguageConfig.initialize(monacoInstance)
}
