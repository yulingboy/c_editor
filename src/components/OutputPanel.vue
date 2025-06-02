<template>
  <div class="output-panel">
    <el-tabs v-model="activeTab" type="card">
      <!-- 编译输出 -->
      <el-tab-pane label="编译输出" name="compile">
        <div class="output-content">
          <pre v-if="compileOutput" :class="{ 'error': hasCompileError }">{{ compileOutput }}</pre>
          <div v-else class="placeholder">编译输出将显示在这里...</div>
        </div>
      </el-tab-pane>

      <!-- 程序输出 -->
      <el-tab-pane label="程序输出" name="output">
        <div class="output-content">
          <pre v-if="programOutput">{{ programOutput }}</pre>
          <div v-else class="placeholder">程序输出将显示在这里...</div>
        </div>
      </el-tab-pane>

      <!-- 输入区域 -->
      <el-tab-pane label="程序输入" name="input">
        <div class="input-area">
          <el-input
            v-model="programInput"
            type="textarea"
            :rows="10"
            placeholder="在这里输入程序需要的数据..."
            resize="none"
          />
          <div class="input-actions">
            <el-button @click="clearInput" size="small">清空</el-button>
            <el-button @click="sendInput" size="small" type="primary">发送输入</el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- 问题面板 -->
      <el-tab-pane label="问题" name="problems">
        <div class="problems-content">
          <div v-if="problems.length === 0" class="placeholder">
            没有发现问题
          </div>
          <div v-else>
            <div
              v-for="(problem, index) in problems"
              :key="index"
              class="problem-item"
              :class="problem.severity"
              @click="goToProblem(problem)"
            >
              <el-icon class="problem-icon">
                <WarningFilled v-if="problem.severity === 'warning'" />
                <CircleCloseFilled v-else />
              </el-icon>
              <div class="problem-content">
                <div class="problem-message">{{ problem.message }}</div>
                <div class="problem-location">
                  第 {{ problem.line }} 行，第 {{ problem.column }} 列
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 操作按钮 -->
    <div class="panel-actions">
      <el-button @click="clearAll" size="small" :icon="Delete">清空所有</el-button>
      <el-button @click="copyOutput" size="small" :icon="CopyDocument">复制输出</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  WarningFilled,
  CircleCloseFilled,
  Delete,
  CopyDocument
} from '@element-plus/icons-vue'

interface Problem {
  severity: 'error' | 'warning'
  message: string
  line: number
  column: number
  file?: string
}

interface Props {
  compileOutput?: string
  programOutput?: string
  problems?: Problem[]
}

const props = withDefaults(defineProps<Props>(), {
  compileOutput: '',
  programOutput: '',
  problems: () => []
})

const emit = defineEmits<{
  sendInput: [input: string]
  goToProblem: [problem: Problem]
}>()

const activeTab = ref('compile')
const programInput = ref('')

// 检查是否有编译错误
const hasCompileError = computed(() => {
  return props.compileOutput.toLowerCase().includes('error') ||
         props.compileOutput.toLowerCase().includes('failed')
})

// 清空输入
const clearInput = () => {
  programInput.value = ''
  ElMessage.success('已清空输入')
}

// 发送输入
const sendInput = () => {
  if (programInput.value.trim()) {
    emit('sendInput', programInput.value)
    ElMessage.success('输入已发送')
  } else {
    ElMessage.warning('请先输入内容')
  }
}

// 跳转到问题位置
const goToProblem = (problem: Problem) => {
  emit('goToProblem', problem)
}

// 清空所有输出
const clearAll = () => {
  // 通过父组件来清空
  ElMessage.success('已清空所有输出')
}

// 复制输出内容
const copyOutput = async () => {
  let textToCopy = ''
  
  switch (activeTab.value) {
    case 'compile':
      textToCopy = props.compileOutput
      break
    case 'output':
      textToCopy = props.programOutput
      break
    case 'input':
      textToCopy = programInput.value
      break
    case 'problems':
      textToCopy = props.problems.map(p => 
        `${p.severity.toUpperCase()}: ${p.message} (第${p.line}行，第${p.column}列)`
      ).join('\n')
      break
  }
  
  if (textToCopy) {
    try {
      await navigator.clipboard.writeText(textToCopy)
      ElMessage.success('已复制到剪贴板')
    } catch (error) {
      ElMessage.error('复制失败')
    }
  } else {
    ElMessage.warning('没有内容可复制')
  }
}
</script>

<style scoped>
.output-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
}

.el-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
}

:deep(.el-tabs__content) {
  flex: 1;
  overflow: hidden;
}

:deep(.el-tab-pane) {
  height: 100%;
  overflow: hidden;
}

.output-content,
.input-area,
.problems-content {
  height: 100%;
  overflow-y: auto;
  padding: 10px;
}

.output-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.4;
  color: var(--el-text-color-primary);
}

.output-content pre.error {
  color: var(--el-color-danger);
}

.placeholder {
  color: var(--el-text-color-placeholder);
  font-style: italic;
  text-align: center;
  padding: 20px;
}

.input-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.problems-content {
  padding: 5px;
}

.problem-item {
  display: flex;
  align-items: flex-start;
  padding: 8px 12px;
  margin-bottom: 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.problem-item:hover {
  background-color: var(--el-fill-color-light);
}

.problem-item.error {
  border-left: 3px solid var(--el-color-danger);
}

.problem-item.warning {
  border-left: 3px solid var(--el-color-warning);
}

.problem-icon {
  margin-right: 8px;
  margin-top: 2px;
}

.problem-item.error .problem-icon {
  color: var(--el-color-danger);
}

.problem-item.warning .problem-icon {
  color: var(--el-color-warning);
}

.problem-content {
  flex: 1;
}

.problem-message {
  font-weight: 500;
  margin-bottom: 2px;
}

.problem-location {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.panel-actions {
  padding: 8px 10px;
  border-top: 1px solid var(--el-border-color-light);
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
