// 템플릿 문자열이 없을 때 사용하던건가..?
function invariant(condition: boolean, message: string, ...args: string[]){
    const errorMessage = args.reduce((acc, curr) => acc.replace('%s', curr), message);
    if(!condition) throw new Error(errorMessage);
}

// invariant(false, 'hello %s my name is %s', 'world', 'hoeh');

export { invariant };

