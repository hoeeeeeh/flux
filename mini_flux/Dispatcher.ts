import {invariant} from "./utils/invariant.ts";
import EventEmitter from "events";

class Dispatcher<Taction> {
    // Payload 를 action 이라고 생각하면 됨
    private readonly _emitter = new EventEmitter();
    constructor() {
    }

    dispatch(payload: Taction): void {
        this._emitter.emit('DISPATCH', payload);
    }

    register(callback: (payload: Taction) => void): () => void {
        this._emitter.on('DISPATCH', callback);
        return () => this.unregister(callback);
    }

    unregister(callback: (payload: Taction) => void): void {
        this._emitter.removeListener('DISPATCH', callback);
    }

    get emitter(): EventEmitter{
        return this._emitter;
    }
}

// singleton
const dispatcher = new Dispatcher();
export { dispatcher, type Dispatcher}
