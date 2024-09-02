import { dispatcher } from './Dispatcher.js';
import { type Action } from '../action/Action.js';

export default abstract class Store<TState> extends EventTarget {
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
    this.addEventListener('change', callback);
  }

  emitChange() {
    this.dispatchEvent(new Event('change'));
  }

  // stateChanged() {}

  abstract reduce(action: Action): void;
}

// export default { Store };
