import { dispatcher } from "./Dispatcher";
import { Action } from "./Action.ts";

abstract class Store<TState> {
    private readonly dispatcher = dispatcher;
    private state: TState;

    constructor(state: TState) {
        this.state = state;
        this.dispatcher.register((action: Action) => {
            this.reduce(action);
        });
    }

    setState(newState: Partial<TState>){
        this.state = {...this.state, newState};
    }

    abstract reduce(action: object): void
}

export { Store };
