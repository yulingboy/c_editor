import type { Extension } from '@codemirror/state'
import { cpp } from '@codemirror/lang-cpp'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, keymap, highlightActiveLine, lineNumbers } from '@codemirror/view'
import { foldGutter } from '@codemirror/language'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
import { autocompletion, completionKeymap, closeBrackets } from '@codemirror/autocomplete'
import { lintKeymap, lintGutter } from '@codemirror/lint'
import { indentOnInput, bracketMatching, foldKeymap } from '@codemirror/language'

import { createCHighlightExtension } from './c-syntax-highlight'
import { createCCompletionExtension } from './c-completion'
import { createCLintExtension } from './c-linter'

/**
 * 创建 CodeMirror C 语言编辑器配置
 */
export function createCEditorExtensions(): Extension[] {
  return [
    // 基础扩展
    lineNumbers(),
    foldGutter(),
    history(),
    
    // 语言支持
    cpp(),
    
    // 缩进和括号
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    
    // 搜索
    highlightSelectionMatches(),
    
    // 自动补全
    autocompletion(),
    createCCompletionExtension(),
    
    // 语法校验
    lintGutter(),
    createCLintExtension(),
    
    // 语法高亮
    createCHighlightExtension(),
    
    // 主题
    oneDark,
    
    // 行高亮
    highlightActiveLine(),
    
    // 键盘映射
    keymap.of([
      ...defaultKeymap,
      ...historyKeymap,
      ...searchKeymap,
      ...completionKeymap,
      ...lintKeymap,
      ...foldKeymap
    ]),
    
    // 编辑器视图配置
    EditorView.theme({
      '&': {
        fontSize: '16px',
        fontFamily: 'Consolas, "Courier New", monospace'
      },
      '.cm-content': {
        padding: '16px',
        minHeight: '100%'
      },
      '.cm-focused': {
        outline: 'none'
      },
      '.cm-editor': {
        height: '100%'
      },
      '.cm-scroller': {
        height: '100%'
      }
    }),
    
    // 编辑器行为配置
    EditorView.lineWrapping
  ]
}

/**
 * 默认的 C 语言代码模板
 */
export const defaultCCode = `#include <stdio.h>
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
}`
