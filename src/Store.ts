import {type Dispatcher, dispatcher} from "./Dispatcher.ts";

import EventEmitter from 'events';
import {invariant} from "./utils/invariant.ts";

class Store{
    private _dispatchToken: string;
    protected __changed: boolean;
    protected __changeEvent: string;
    protected __className: string;
    protected __dispatcher: Dispatcher<any>;
    protected __emitter: EventEmitter;

    constructor(dispatcher: Dispatcher<any>) {
        this.__className = this.constructor.name;

        this.__changed = false;
        this.__changeEvent = 'change';
        this.__dispatcher = dispatcher;
        this.__emitter = new EventEmitter();
        this._dispatchToken = dispatcher.register((payload) => {
            //this.__invokeOnDispatch(payload);
        })
    }

    addListener(callback: (eventType?: string) => void): { remove: () => void }{
        this.__emitter.addListener(this.__changeEvent, callback);
        return { remove: this.removeListener(callback) };
    }

    removeListener(callback: (eventType?: string) => void): ()=>void {
        const changeEvent = this.__changeEvent;
        return ()=> {
            this.__emitter.removeListener(changeEvent, callback);
        }
    }

    getDispatcher(): Dispatcher<any> {
        return this.__dispatcher;
    }

    getDispatchToken(): string {
        return this._dispatchToken;
    }

    hasChanged(): boolean {
        invariant(
            this.__dispatcher.isDispatching(),
            '%s.hasChanged(): Must be invoked while dispatching.',
            this.__className,
        );
        return this.__changed;
    }

    __emitChange(): void {
        invariant(
            this.__dispatcher.isDispatching(),
            '%s.__emitChange(): Must be invoked while dispatching.',
            this.__className,
        );
        this.__changed = true;
    }

    __invokeOnDispatch(payload: Object): void {
        this.__changed = false;
        this.__onDispatch(payload);
        if (this.__changed) {
            this.__emitter.emit(this.__changeEvent);
        }
    }

    __onDispatch(payload: Object): void {
        invariant(
            false,
            '%s has not overridden FluxStore.__onDispatch(), which is required',
            this.__className,
        );
    }

    eventNames(){
        return this.__emitter.eventNames();
    }

}

const test = new Store(dispatcher);
const [event1, event2] = ['abcd', 'efg']
const remove1 = test.addListener((event1)=>{
    console.log(event1);
})

const remove2 = test.addListener((event2)=>{
    console.log(event2)
})
console.log(test.eventNames());
console.log(remove1);
remove1['remove']()
console.log(test.eventNames());
remove2['remove']()
console.log(test.eventNames());
