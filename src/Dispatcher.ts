type DispatchToken = string;

class Dispatcher<TPayload> {
    // Payload 를 action 이라고 생각하면 됨
    private _callbacks: {[key: DispatchToken]: (payload: TPayload) => void};
    private _isDispatching: boolean;
    private _isHandled: {[key: DispatchToken]: boolean};
    private _isPending: {[key: DispatchToken]: boolean};
    private _lastID: number;
    private _pedningPayload: TPayload;

    constructor() {
        this._callbacks = {};
        this._isDispatching = false;
        this._isHandled = {};
        this._isPending = {};
        this._lastID = 1;
    }

    register(callback: (payload: TPayload) => void): DispatchToken {
        const id = this._lastID++;
        return id;
    }
}

export { DispatchToken }
