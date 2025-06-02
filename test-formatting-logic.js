const { formatCCode } = require('./src/utils/c-formatter.ts');

// 测试代码
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

console.log('原始代码:');
console.log(testCode);
console.log('\n' + '='.repeat(50) + '\n');

try {
    const formatted = formatCCode(testCode);
    console.log('格式化后的代码:');
    console.log(formatted);
} catch (error) {
    console.error('格式化失败:', error);
}
