import EventEmitter from 'node:events';
import { dispatcher } from './Dispatcher';
import { type Action } from './Action';

export default abstract class Store<TState> extends EventEmitter {
    private readonly dispatcher = dispatcher;

    protected state: TState;

    protected constructor(state: TState) {
        super();
        this.state = state;
        // this.setState(state);
    }

    setState(newState: Partial<TState>) {
        console.log('setState', newState);
        this.state = { ...this.state, ...newState };
        this.emitChange();
    }

    getState() {
        return this.state;
    }

    dispatcherRegister() {
        this.dispatcher.register((action: Action) => {
            this.reduce(action);
        });
    }

    registerEvent(callback: (action: Action) => void) {
        this.addListener('change', callback);
    }

    emitChange() {
        this.emit('change');
    }

    // stateChanged() {}

    abstract reduce(action: Action): void;
}

// export default { Store };
