import {dispatcher} from "./Dispatcher.ts";

abstract class Store<TState> {
    private readonly _dispatcher = dispatcher;
    private _state: TState;
    constructor(state: TState) {
        this._state = state;
        this._dispatcher.register((action: any) => {
            this.reduce(action);
        });
    }

    abstract reduce(action: object): void
}
