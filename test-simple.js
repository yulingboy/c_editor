// 简单的Node.js测试脚本
// 使用ES模块语法测试格式化器

const testCode = `#include <stdio.h>
int main(){
int x=10,y=20;
if(x>y){
printf("x is greater\\n");
}else{
printf("y is greater\\n");
}
return 0;
}`;

// 简化的格式化器
class SimpleFormatter {
    format(code) {
        if (!code || typeof code !== 'string') {
            return '';
        }
        
        if (code.trim() === '') {
            return '';
        }

        try {
            const lines = code.split('\n');
            const formattedLines = [];
            let indentLevel = 0;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                
                if (!line) {
                    formattedLines.push('');
                    continue;
                }

                // 处理预处理器指令
                if (line.startsWith('#')) {
                    formattedLines.push(line);
                    continue;
                }

                // 简化的大括号处理
                const openBraces = (line.match(/\{/g) || []).length;
                const closeBraces = (line.match(/\}/g) || []).length;
                
                // 处理关闭大括号的缩进
                if (closeBraces > 0) {
                    indentLevel = Math.max(0, indentLevel - closeBraces);
                }

                // 应用缩进
                const indent = '    '.repeat(Math.max(0, indentLevel));
                const processedLine = line.replace(/\b(if|while|for|switch|return)\(/g, '$1 (');
                
                formattedLines.push(indent + processedLine);

                // 处理开启大括号的缩进
                if (openBraces > 0) {
                    indentLevel = indentLevel + openBraces;
                }
            }

            return formattedLines.join('\n');
        } catch (error) {
            console.error('格式化过程中出错:', error);
            return code;
        }
    }
}

const formatter = new SimpleFormatter();

console.log('原始代码:');
console.log(testCode);
console.log('\n格式化后:');
console.log(formatter.format(testCode));

// 测试边界情况
console.log('\n测试空字符串:');
console.log('结果:', JSON.stringify(formatter.format('')));

console.log('\n测试纯空白字符:');
console.log('结果:', JSON.stringify(formatter.format('   \n  \n   ')));

console.log('\n格式化器测试完成 ✓');
