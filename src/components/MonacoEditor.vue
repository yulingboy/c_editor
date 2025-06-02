<template>
  <div ref="editorContainer" class="monaco-editor-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, nextTick, shallowRef, toRaw } from 'vue'
import * as monaco from 'monaco-editor'
import loader from '@monaco-editor/loader'
import initializeCLanguage from '../config'
import { formatCCode } from '../utils/c-formatter'

interface Props {
  value?: string
  language?: string
  theme?: string
  options?: monaco.editor.IStandaloneEditorConstructionOptions
  width?: string | number
  height?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  language: 'c',
  theme: 'vs-dark',
  width: '100%',
  height: '100%',
  options: () => ({
    automaticLayout: true,
    fontSize: 14,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    tabSize: 4,
    insertSpaces: true,
    renderWhitespace: 'selection',
    lineNumbers: 'on',
    glyphMargin: true,
    folding: true,
    lineDecorationsWidth: 20,
    lineNumbersMinChars: 3,
    renderLineHighlight: 'all',
  })
})

const emit = defineEmits<{
  change: [value: string]
  editorMounted: [editor: monaco.editor.IStandaloneCodeEditor]
}>()

const editorContainer = shallowRef<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null

// 配置 Monaco Editor
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs'
  }
})

onMounted(async () => {
  if (!editorContainer.value) return
  try {
    // 等待 Monaco Editor 加载
    const monacoInstance = await loader.init()
    
    // 初始化 C 语言配置
    await initializeCLanguage(monacoInstance)

    // 创建编辑器实例
    editor = monacoInstance.editor.create(editorContainer.value, {
      value: props.value,
      language: props.language,
      theme: props.theme,
      ...props.options
    })    // 监听内容变化
    if (editor) {
      editor.onDidChangeModelContent(() => {
        if (editor) {
          const model = editor.getModel()
          if (model) {
            const rawModel = toRaw(model)
            emit('change', rawModel.getValue())
          }
        }
      })
      
      // 监听模型变化以获取错误信息
      const model = editor.getModel()
      if (model) {
        // 监听标记变化
        monacoInstance.editor.onDidChangeMarkers((uris: any[]) => {
          uris.forEach((uri: any) => {
            if (model.uri.toString() === uri.toString()) {
              const markers = monacoInstance.editor.getModelMarkers({ resource: uri })
              const errorCount = markers.filter((m: any) => m.severity === monacoInstance.MarkerSeverity.Error).length
              const warningCount = markers.filter((m: any) => m.severity === monacoInstance.MarkerSeverity.Warning).length
              if (errorCount > 0 || warningCount > 0) {
                console.log(`语法校验: ${errorCount} 个错误, ${warningCount} 个警告`)
              }
            }
          })
        })
      }
    }// 添加自定义快捷键
    if (editor) {
      // 复制快捷键
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyC, () => {
        if (editor) {
          const selection = editor.getSelection()
          let textToCopy = ''
            if (selection && !selection.isEmpty()) {
            textToCopy = editor.getModel()?.getValueInRange(selection) || ''          } else {
            const model = editor.getModel()
            if (model) {
              const rawModel = toRaw(model)
              textToCopy = rawModel.getValue()
            }
          }
          
          navigator.clipboard.writeText(textToCopy).then(() => {
            // 成功复制
          }).catch(() => {
            // 错误处理
          })
        }
      })      // 格式化快捷键
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
        const currentEditor = editor
        if (currentEditor) {
          try {
            console.log('开始格式化...')
            const selection = currentEditor.getSelection()
            
            // 使用 setTimeout 避免阻塞 UI
            setTimeout(() => {
              try {
                if (selection && !selection.isEmpty()) {
                  // 格式化选中的文本
                  console.log('格式化选中文本')
                  const selectedText = currentEditor.getModel()?.getValueInRange(selection) || ''
                  console.log('选中文本长度:', selectedText.length)
                  
                  const formattedText = formatCCode(selectedText)
                  console.log('格式化完成，长度:', formattedText.length)
                  
                  currentEditor.executeEdits('format', [{
                    range: selection,
                    text: formattedText
                  }])
                } else {
                  // 格式化全部代码 - 避免直接调用 getValue()                  console.log('格式化全部代码')
                  const model = currentEditor.getModel()
                  if (model) {
                    const rawModel = toRaw(model)
                    const currentCode = rawModel.getValue()
                    console.log('当前代码长度:', currentCode.length)
                    
                    const formattedCode = formatCCode(currentCode)
                    console.log('格式化完成，长度:', formattedCode.length)
                    
                    if (formattedCode !== currentCode) {
                      rawModel.setValue(formattedCode)
                      console.log('代码已更新')
                    } else {
                      console.log('代码无需更改')
                    }
                  }
                }
              } catch (error) {
                console.error('快捷键格式化失败:', error)
              }
            }, 50) // 增加延迟时间
          } catch (error) {
            console.error('格式化失败:', error)
          }
        }
      })
    }// 设置编辑器尺寸
    updateEditorLayout()

    if (editor) {
      emit('editorMounted', editor)
    }
  } catch (error) {
    console.error('Monaco Editor 初始化失败:', error)
  }
})

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
    editor = null
  }
})

// 监听 value 变化
watch(() => props.value, (newValue) => {
  if (editor) {
    const model = editor.getModel()
    if (model) {
      const rawModel = toRaw(model)
      if (rawModel.getValue() !== newValue) {
        editor.setValue(newValue || '')
      }
    }
  }
})

// 监听主题变化
watch(() => props.theme, (newTheme) => {
  if (editor) {
    monaco.editor.setTheme(newTheme)
  }
})

// 更新编辑器布局
const updateEditorLayout = () => {
  nextTick(() => {
    if (editor) {
      editor.layout()
    }
  })
}

// 暴露方法给父组件
defineExpose({
  getEditor: () => editor,
  getValue: () => {
    const model = editor?.getModel()
    if (model) {
      const rawModel = toRaw(model)
      return rawModel.getValue()
    }
    return ''
  },
  setValue: (value: string) => editor?.setValue(value),
  focus: () => editor?.focus(),
  layout: updateEditorLayout,
  // 语法校验相关方法
  getMarkers: () => {
    const model = editor?.getModel()
    if (model && monaco) {
      return monaco.editor.getModelMarkers({ resource: model.uri })
    }
    return []
  },
  clearMarkers: () => {
    const model = editor?.getModel()
    if (model && monaco) {
      monaco.editor.setModelMarkers(model, 'c-language', [])
    }
  },
  getErrorCount: () => {
    const model = editor?.getModel()
    if (model && monaco) {
      const markers = monaco.editor.getModelMarkers({ resource: model.uri })
      return markers.filter((m: any) => m.severity === monaco.MarkerSeverity.Error).length
    }
    return 0
  },
  getWarningCount: () => {
    const model = editor?.getModel()
    if (model && monaco) {
      const markers = monaco.editor.getModelMarkers({ resource: model.uri })
      return markers.filter((m: any) => m.severity === monaco.MarkerSeverity.Warning).length
    }
    return 0
  }
})
</script>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: 100%;
}
</style>
