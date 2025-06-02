<template>
  <div class="toolbar">
    <el-row :gutter="10" align="middle">      <!-- 文件操作 -->
      <el-col :span="8">
        <el-button-group>
          <el-button @click="newFile" size="small" :icon="DocumentAdd">
            新建
          </el-button>
          <el-button @click="openFile" size="small" :icon="FolderOpened">
            打开
          </el-button>
          <el-button @click="saveFile" size="small" :icon="Download">
            保存
          </el-button>
          <el-button @click="copyCode" size="small" :icon="DocumentCopy">
            复制
          </el-button>
        </el-button-group>
      </el-col>

      <!-- 编译运行 -->
      <el-col :span="8">
        <el-button-group>
          <el-button 
            @click="compile" 
            size="small" 
            type="primary" 
            :icon="Tools"
            :loading="compiling"
          >
            编译
          </el-button>
          <el-button 
            @click="run" 
            size="small" 
            type="success" 
            :icon="VideoPlay"
            :loading="running"
          >
            运行
          </el-button>
          <el-button 
            @click="compileAndRun" 
            size="small" 
            type="warning" 
            :icon="Setting"
            :loading="compiling || running"
          >
            编译并运行
          </el-button>
        </el-button-group>
      </el-col>

      <!-- 其他操作 -->
      <el-col :span="8">
        <el-button-group>
          <el-button @click="formatCode" size="small" :icon="MagicStick">
            格式化
          </el-button>
          <el-button @click="toggleTheme" size="small" :icon="Moon">
            {{ isDark ? '浅色' : '深色' }}
          </el-button>
          <el-button @click="showSettings" size="small" :icon="Setting">
            设置
          </el-button>
        </el-button-group>
      </el-col>
    </el-row>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept=".c,.h,.cpp,.hpp"
      style="display: none"
      @change="handleFileOpen"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  DocumentAdd,
  FolderOpened,
  Download,
  DocumentCopy,
  Tools,
  VideoPlay,
  Setting,
  MagicStick,
  Moon
} from '@element-plus/icons-vue'

interface Props {
  isDark?: boolean
  compiling?: boolean
  running?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDark: true,
  compiling: false,
  running: false
})

const emit = defineEmits<{
  newFile: []
  openFile: [content: string, filename: string]
  saveFile: []
  copyCode: []
  compile: []
  run: []
  compileAndRun: []
  formatCode: []
  toggleTheme: []
  showSettings: []
}>()

const fileInput = ref<HTMLInputElement>()

// 新建文件
const newFile = () => {
  ElMessageBox.confirm(
    '创建新文件将清空当前编辑器内容，是否继续？',
    '确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    emit('newFile')
    ElMessage.success('已创建新文件')
  }).catch(() => {
    // 用户取消
  })
}

// 打开文件
const openFile = () => {
  fileInput.value?.click()
}

// 处理文件打开
const handleFileOpen = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      emit('openFile', content, file.name)
      ElMessage.success(`已打开文件: ${file.name}`)
    }
    reader.readAsText(file)
  }
  
  // 清空 input 值，允许重复选择同一文件
  if (target) {
    target.value = ''
  }
}

// 保存文件
const saveFile = () => {
  emit('saveFile')
}

// 复制代码
const copyCode = () => {
  emit('copyCode')
}

// 编译
const compile = () => {
  emit('compile')
}

// 运行
const run = () => {
  emit('run')
}

// 编译并运行
const compileAndRun = () => {
  emit('compileAndRun')
}

// 格式化代码
const formatCode = () => {
  emit('formatCode')
  ElMessage.success('代码已格式化')
}

// 切换主题
const toggleTheme = () => {
  emit('toggleTheme')
}

// 显示设置
const showSettings = () => {
  emit('showSettings')
}
</script>

<style scoped>
.toolbar {
  padding: 10px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
}

.el-button-group {
  margin-right: 10px;
}
</style>
