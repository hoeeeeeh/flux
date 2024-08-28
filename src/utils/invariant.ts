function invariant(condition: boolean, message: string, ...args: string[]){
    const errorMessage = args.reduce((acc, curr) => acc.replace('%s', curr), message);
    if(!condition) throw new Error(errorMessage);
}

// invariant(false, 'hello %s my name is %s', 'world', 'hoeh');

export { invariant };

