// 测试格式化器的改进逻辑
import { formatCCode } from './src/utils/c-formatter.js';

const testCode = `#include <stdio.h>
#include <stdlib.h>

    int main(){
    int x=10,y=20;
        if (x>y){
        printf("x is greater\\n");
            }else{
            printf("y is greater\\n");
        }
            for (int i=0;i<5;i++){
            printf("Count: %d\\n",i);
        }
        return 0;
    }`;

console.log('=== 原始代码 ===');
console.log(testCode);
console.log('\n=== 格式化后的代码 ===');

try {
    const formatted = formatCCode(testCode);
    console.log(formatted);
    
    console.log('\n=== 对比分析 ===');
    const originalLines = testCode.split('\n');
    const formattedLines = formatted.split('\n');
    
    console.log('原始行数:', originalLines.length);
    console.log('格式化后行数:', formattedLines.length);
    
    console.log('\n=== 逐行对比 ===');
    const maxLines = Math.max(originalLines.length, formattedLines.length);
    for (let i = 0; i < maxLines; i++) {
        const orig = originalLines[i] || '';
        const form = formattedLines[i] || '';
        if (orig !== form) {
            console.log(`行 ${i + 1}:`);
            console.log(`  原始: "${orig}"`);
            console.log(`  格式化: "${form}"`);
        }
    }
} catch (error) {
    console.error('格式化失败:', error);
}
