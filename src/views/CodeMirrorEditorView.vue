<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy, MagicStick, SwitchButton } from '@element-plus/icons-vue'
import CodeMirrorEditor from '../codemirror-components/CodeMirrorEditor.vue'
import { formatCCode } from '../utils/c-formatter'
import { defaultCCode } from '../codemirror-config'
import { useRouter } from 'vue-router'

const router = useRouter()

// 从 localStorage 获取代码或使用默认代码
const getInitialCode = (): string => {
  const savedCode = localStorage.getItem('editorCode')
  return savedCode || defaultCCode
}

const code = ref(getInitialCode())
const editorRef = ref()

const handleCodeChange = (newCode: string) => {
  code.value = newCode
  // 实时保存到 localStorage
  localStorage.setItem('editorCode', newCode)
}

const handleEditorMounted = (editorView: any) => {
  console.log('CodeMirror 编辑器已挂载')
}

// 切换到 Monaco 编辑器
const switchToMonaco = () => {
  // 保存当前代码到 localStorage
  localStorage.setItem('editorCode', code.value)
  router.push('/monaco')
}

// 复制代码功能
const copyCode = async () => {
  try {
    if (editorRef.value) {
      const selectedText = editorRef.value.getSelection()
      let textToCopy = ''
      
      if (selectedText && selectedText.trim()) {
        // 如果有选中的文本，复制选中内容
        textToCopy = selectedText
        ElMessage.success('已复制选中代码到剪贴板')
      } else {
        // 否则复制全部代码
        textToCopy = editorRef.value.getValue()
        ElMessage.success('已复制全部代码到剪贴板')
      }
      
      await navigator.clipboard.writeText(textToCopy)
    }
  } catch (error) {
    ElMessage.error('复制失败，请检查浏览器权限')
    console.error('复制失败:', error)
  }
}

// 格式化代码功能
const formatCode = () => {
  try {
    if (editorRef.value) {
      ElMessage.info('正在格式化代码...')
      
      // 使用 setTimeout 避免阻塞 UI
      setTimeout(() => {
        try {
          // 使用 CodeMirror 编辑器的 formatCode 方法
          editorRef.value.formatCode(formatCCode)
          ElMessage.success('代码格式化完成')
        } catch (error) {
          ElMessage.error('格式化失败，请检查代码语法')
          console.error('格式化失败:', error)
        }
      }, 50)
    }
  } catch (error) {
    ElMessage.error('格式化操作失败')
    console.error('格式化操作失败:', error)
  }
}

// 键盘快捷键
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.altKey) {
    if (event.key === 'c' || event.key === 'C') {
      event.preventDefault()
      copyCode()
    } else if (event.key === 'f' || event.key === 'F') {
      event.preventDefault()
      formatCode()
    }
  }
}

onMounted(() => {
  // 监听键盘事件
  document.addEventListener('keydown', handleKeyDown)
  
  // 从 localStorage 加载保存的代码
  const savedCode = localStorage.getItem('editorCode')
  if (savedCode && savedCode !== code.value) {
    code.value = savedCode
  }
})

// 清理事件监听器
const cleanup = () => {
  document.removeEventListener('keydown', handleKeyDown)
}

// 在组件卸载时清理
import { onBeforeUnmount } from 'vue'
onBeforeUnmount(cleanup)
</script>

<template>
  <div class="editor-view">
    <div class="editor-header">
      <h1>C 语言编辑器 - CodeMirror</h1>
      <div class="header-actions">
        <div class="shortcut-tip">
          <span style="font-size: 12px; color: #888;">
            Ctrl+Alt+C 复制 | Ctrl+Alt+F 格式化
          </span>
        </div>
        <el-button 
          @click="switchToMonaco" 
          size="small" 
          type="warning" 
          :icon="SwitchButton"
          plain
        >
          切换到 Monaco
        </el-button>
        <el-button 
          @click="copyCode" 
          size="small" 
          type="primary" 
          :icon="DocumentCopy"
          plain
        >
          复制代码
        </el-button>
        <el-button 
          @click="formatCode" 
          size="small" 
          type="success" 
          :icon="MagicStick"
          plain
        >
          格式化
        </el-button>
        <div class="editor-info">
          <span>基于 CodeMirror</span>
        </div>
      </div>
    </div>
      <div class="editor-container">
      <CodeMirrorEditor
        ref="editorRef"
        :value="code"
        @change="handleCodeChange"
        @editor-mounted="handleEditorMounted"
      />
    </div>
  </div>
</template>

<style scoped>
.editor-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #1e1e1e;
  color: #ffffff;
}

.editor-header {
  background-color: #2d2d30;
  padding: 12px 20px;
  border-bottom: 1px solid #3e3e42;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.editor-header h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.editor-info {
  font-size: 14px;
  color: #cccccc;
}

.editor-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}
</style>
