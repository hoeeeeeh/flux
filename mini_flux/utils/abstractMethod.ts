import { invariant } from "./invariant.ts";

function abstractMethod<T>(className: string, methodName: string): T {
    invariant(
        false,
        '%s 의 메소드, %s 를 implement 해주세요',
        className,
        methodName
    )
    return undefined as T;
}

