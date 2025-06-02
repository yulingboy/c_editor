// C语言格式化器测试用例

import { formatCCode, CFormatter } from './src/utils/c-formatter'

// 测试用例 1: 基本格式化
const testCode1 = `#include <stdio.h>
int main(){
int x=10,y=20;
if(x>y){
printf("x is greater\\n");
}else{
printf("y is greater\\n");
}
return 0;
}`

console.log('原始代码:')
console.log(testCode1)
console.log('\n格式化后:')
console.log(formatCCode(testCode1))

// 测试用例 2: 复杂代码
const testCode2 = `#include<stdio.h>
#include<stdlib.h>
struct Node{
int data;
struct Node*next;
};
int main(){
int arr[]={1,2,3,4,5};
for(int i=0;i<5;i++){
if(arr[i]%2==0){
printf("Even: %d\\n",arr[i]);
}else{
printf("Odd: %d\\n",arr[i]);
}
}
return 0;
}`

console.log('\n\n复杂代码原始:')
console.log(testCode2)
console.log('\n格式化后:')
console.log(formatCCode(testCode2))

// 测试用例 3: 边界情况
const testCode3 = ''
console.log('\n\n空字符串测试:')
console.log('结果:', formatCCode(testCode3))

const testCode4 = '   \n  \n   '
console.log('\n只有空白字符测试:')
console.log('结果:', formatCCode(testCode4))
