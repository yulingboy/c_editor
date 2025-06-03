import { createRouter, createWebHistory } from 'vue-router'
import MonacoEditor from '../views/MonacoEditorView.vue'
import CodeMirrorEditor from '../views/CodeMirrorEditorView.vue'

const routes = [
  {
    path: '/',
    redirect: '/monaco'
  },
  {
    path: '/monaco',
    name: 'Monaco',
    component: MonacoEditor,
    meta: {
      title: 'Monaco Editor'
    }
  },
  {
    path: '/codemirror',
    name: 'CodeMirror',
    component: CodeMirrorEditor,
    meta: {
      title: 'CodeMirror Editor'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} - C 语言编辑器`
  }
  next()
})

export default router
