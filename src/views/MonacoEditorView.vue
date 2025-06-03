<script setup lang="ts">
import { ref, toRaw } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy, MagicStick, SwitchButton } from '@element-plus/icons-vue'
import MonacoEditor from '../components/MonacoEditor.vue'
import { formatCCode } from '../utils/c-formatter'
import { useRouter } from 'vue-router'

const router = useRouter()

const code = ref(`#include <stdio.h>
#include <stdlib.h>

int main(){
int x=10,y=20;
if(x>y){
printf("x is greater\\n");
}else{
printf("y is greater\\n");
}
for(int i=0;i<5;i++){
printf("Count: %d\\n",i);
}
return 0;
}`)

const editorRef = ref()

const handleCodeChange = (newCode: string) => {
  code.value = newCode
}

const handleEditorMounted = (editor: any) => {
  editorRef.value = editor
}

// 切换到 CodeMirror 编辑器
const switchToCodeMirror = () => {
  // 保存当前代码到 localStorage
  localStorage.setItem('editorCode', code.value)
  router.push('/codemirror')
}

// 复制代码功能
const copyCode = async () => {
  try {
    if (editorRef.value) {
      const selection = editorRef.value.getSelection()
      let textToCopy = ''
      
      if (selection && !selection.isEmpty()) {
        // 如果有选中的文本，复制选中内容
        const model = editorRef.value.getModel()
        if (model) {
          const rawModel = toRaw(model)
          textToCopy = rawModel.getValueInRange(selection)
        }
        ElMessage.success('已复制选中代码到剪贴板')
      } else {
        // 否则复制全部代码
        textToCopy = code.value
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
      
      setTimeout(() => {
        try {
          const selection = editorRef.value.getSelection()
          
          if (selection && !selection.isEmpty()) {
            console.log('格式化选中内容')
            const model = editorRef.value.getModel()
            if (model) {
              const rawModel = toRaw(model)
              const selectedText = rawModel.getValueInRange(selection)
              const formattedText = formatCCode(selectedText)
              
              editorRef.value.executeEdits('format', [{
                range: selection,
                text: formattedText
              }])
              
              ElMessage.success('已格式化选中代码')
            }
          } else {
            console.log('格式化全部代码')
            const model = editorRef.value.getModel()
            if (model) {
              const rawModel = toRaw(model)
              const currentCode = rawModel.getValue()
              console.log('获取到代码，长度:', currentCode.length)
              
              const formattedCode = formatCCode(currentCode)
              console.log('格式化完成，长度:', formattedCode.length)
              
              if (formattedCode !== currentCode && formattedCode.trim() !== '') {
                code.value = formattedCode
                rawModel.setValue(formattedCode)
                ElMessage.success('已格式化全部代码')
              } else if (formattedCode.trim() === '') {
                ElMessage.warning('格式化结果为空，未应用更改')
              } else {
                ElMessage.info('代码已经是最佳格式')
              }
            } else {
              ElMessage.error('无法获取编辑器模型')
            }
          }
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
</script>

<template>
  <div class="editor-view">
    <div class="editor-header">
      <h1>C 语言编辑器 - Monaco Editor</h1>
      <div class="header-actions">
        <div class="shortcut-tip">
          <span style="font-size: 12px; color: #888;">
            Ctrl+Alt+C 复制 | Ctrl+Alt+F 格式化
          </span>
        </div>
        <el-button 
          @click="switchToCodeMirror" 
          size="small" 
          type="warning" 
          :icon="SwitchButton"
          plain
        >
          切换到 CodeMirror
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
          <span>基于 Monaco Editor</span>
        </div>
      </div>
    </div>
    
    <div class="editor-container">
      <MonacoEditor
        :value="code"
        language="c"
        theme="vs-dark"
        @change="handleCodeChange"
        @editor-mounted="handleEditorMounted"
        :options="{
          fontSize: 16,
          minimap: { enabled: false },
          wordWrap: 'on',
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          renderWhitespace: 'selection',
          folding: true,
          bracketPairColorization: { enabled: true },
          cursorBlinking: 'blink',
          renderLineHighlight: 'all'
        }"
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
