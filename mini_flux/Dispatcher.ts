import { Action } from "./Action.ts";

type DispatchToken = string;
const prefix = 'ID_';
class Dispatcher {
    private readonly callbacks: Map<DispatchToken, (action: Action) => void>
    private lastID: number;
    constructor() {
        this.callbacks = new Map();
        this.lastID = 0;
    }

    dispatch(action: Action): void {
        this.callbacks.forEach((callback, dispatchToken) => {
            callback(action);
        })
        // this._emitter.emit('DISPATCH', action);
    }

    register(callback: (action: Action) => void): DispatchToken {
        const dispatchToken = prefix + this.lastID;
        this.lastID += 1;
        this.callbacks.set(dispatchToken, callback);
        return dispatchToken;
    }

    unregister(id: DispatchToken): void {
        this.callbacks.delete(id);
    }
}

// singleton
const dispatcher = new Dispatcher();
export { dispatcher, type Dispatcher}
