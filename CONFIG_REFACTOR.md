# Monaco Editor C 语言配置重构说明

## 概述

为了提高代码的可维护性和模块化程度，我们将 Monaco Editor 的 C 语言配置从 `MonacoEditor.vue` 组件中抽离出来，分别创建了独立的配置文件。

## 文件结构

```
src/config/
├── index.ts                    # 统一配置入口
├── c-language-syntax.ts        # C 语言语法高亮配置
└── c-language-completion.ts    # C 语言代码补全配置
```

## 主要文件说明

### 1. c-language-syntax.ts
负责 C 语言的语法高亮配置，包括：
- **关键字高亮**：如 `int`, `char`, `if`, `while` 等
- **预处理器指令**：如 `#include`, `#define` 等
- **字符串和字符**：双引号字符串和单引号字符
- **注释**：单行注释 `//` 和多行注释 `/* */`
- **数字**：整数、浮点数、十六进制、八进制
- **操作符**：算术、逻辑、比较等操作符
- **分隔符**：括号、分号、逗号等
- **语言配置**：自动闭合括号、注释格式、代码折叠等

### 2. c-language-completion.ts
负责 C 语言的代码补全配置，包括：
- **基本数据类型**：`int`, `char`, `float`, `double` 等
- **控制结构代码片段**：`if`, `for`, `while`, `switch` 等
- **函数模板**：`main` 函数、通用函数模板等
- **标准库函数**：`printf`, `scanf`, `malloc`, `free` 等
- **头文件**：`stdio.h`, `stdlib.h`, `string.h` 等
- **预处理器指令**：`#define`, `#ifdef` 等

### 3. index.ts
提供统一的配置入口，包括：
- **CLanguageConfig 类**：管理配置的初始化状态
- **initialize 方法**：初始化所有 C 语言配置
- **防重复初始化**：确保配置只被初始化一次
- **错误处理**：提供初始化失败时的错误处理

## 使用方式

在 `MonacoEditor.vue` 组件中，只需要简单调用：

```typescript
import initializeCLanguage from '../config'

// 在 Monaco Editor 初始化时调用
await initializeCLanguage(monacoInstance)
```

## 优势

1. **模块化**：各个配置功能分离，便于维护和扩展
2. **可重用性**：配置可以在其他地方复用
3. **可测试性**：各个模块可以独立测试
4. **清晰的职责分离**：编辑器组件专注于编辑器逻辑，配置独立管理
5. **易于扩展**：添加新的语言支持或功能更加容易

## 扩展说明

如果需要添加其他语言的支持，可以按照相同的模式创建：
- `language-name-syntax.ts`：语法高亮配置
- `language-name-completion.ts`：代码补全配置
- 在 `index.ts` 中添加对应的初始化逻辑

## 代码补全功能特色

- **智能提示**：提供详细的函数说明和参数提示
- **代码片段**：支持复杂的代码模板，如完整的 `if-else` 结构
- **参数占位符**：使用 `${}` 语法提供参数占位符，方便快速编辑
- **分类显示**：不同类型的补全项有不同的图标（关键字、函数、模块等）

这次重构大大提升了代码的组织结构和可维护性，为后续功能扩展奠定了良好的基础。
