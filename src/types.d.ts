/// <reference types="vite/client" />

// Monaco Editor类型声明
declare module 'monaco-editor' {
  export * from 'monaco-editor/esm/vs/editor/editor.api'
}

declare module '@monaco-editor/loader' {
  const loader: {
    init: () => Promise<any>
    config: (options: any) => void
  }
  export default loader
}
