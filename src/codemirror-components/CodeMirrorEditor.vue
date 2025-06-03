<template>
  <div ref="editorContainer" class="codemirror-editor-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, shallowRef } from 'vue'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { createCEditorExtensions } from '../codemirror-config'

interface Props {
  value?: string
  width?: string | number
  height?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  width: '100%',
  height: '100%'
})

const emit = defineEmits<{
  change: [value: string]
  editorMounted: [editor: EditorView]
}>()

const editorContainer = shallowRef<HTMLElement>()
let editorView: EditorView | null = null

// 初始化编辑器
const initEditor = () => {
  if (!editorContainer.value) return

  try {
    const state = EditorState.create({
      doc: props.value,
      extensions: [
        ...createCEditorExtensions(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString()
            emit('change', newValue)
          }
        })
      ]
    })

    editorView = new EditorView({
      state,
      parent: editorContainer.value
    })

    // 触发编辑器挂载事件
    emit('editorMounted', editorView)
    
    console.log('CodeMirror 编辑器初始化完成')
  } catch (error) {
    console.error('CodeMirror 编辑器初始化失败:', error)
  }
}

// 销毁编辑器
const destroyEditor = () => {
  if (editorView) {
    editorView.destroy()
    editorView = null
  }
}

// 监听内容变化
watch(() => props.value, (newValue) => {
  if (editorView && newValue !== editorView.state.doc.toString()) {
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: newValue
      }
    })
  }
}, { immediate: false })

// 获取编辑器内容
const getValue = (): string => {
  return editorView?.state.doc.toString() || ''
}

// 设置编辑器内容
const setValue = (value: string) => {
  if (editorView) {
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: value
      }
    })
  }
}

// 获取选中文本
const getSelection = (): string => {
  if (!editorView) return ''
  
  const selection = editorView.state.selection.main
  if (selection.empty) return ''
  
  return editorView.state.doc.sliceString(selection.from, selection.to)
}

// 聚焦编辑器
const focus = () => {
  editorView?.focus()
}

// 格式化选中文本或全部文本
const formatCode = (formatter: (code: string) => string) => {
  if (!editorView) return

  const selection = editorView.state.selection.main
  
  if (selection.empty) {
    // 格式化全部代码
    const currentCode = editorView.state.doc.toString()
    const formattedCode = formatter(currentCode)
    
    if (formattedCode !== currentCode) {
      setValue(formattedCode)
    }
  } else {
    // 格式化选中代码
    const selectedText = editorView.state.doc.sliceString(selection.from, selection.to)
    const formattedText = formatter(selectedText)
    
    if (formattedText !== selectedText) {
      editorView.dispatch({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: formattedText
        }
      })
    }
  }
}

// 暴露方法给父组件
defineExpose({
  getValue,
  setValue,
  getSelection,
  focus,
  formatCode
})

onMounted(() => {
  initEditor()
})

onBeforeUnmount(() => {
  destroyEditor()
})
</script>

<style scoped>
.codemirror-editor-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.codemirror-editor-container :deep(.cm-editor) {
  height: 100%;
}

.codemirror-editor-container :deep(.cm-scroller) {
  height: 100%;
}
</style>
