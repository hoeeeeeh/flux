import {invariant} from "./utils/invariant.ts";

type DispatchToken = string;

// ID prefix
const _prefix = 'ID_';

class Dispatcher<TPayload> {
    // Payload 를 action 이라고 생각하면 됨
    private _callbacks: Map<DispatchToken, (payload: TPayload) => void>;
    private _isHandled: Map<DispatchToken, boolean>;
    private _isPending: Map<DispatchToken, boolean>;
    private _isDispatching: boolean;
    private _lastID: number;
    private _pendingPayload?: TPayload;

    constructor() {
        this._callbacks = new Map();
        this._isHandled = new Map();
        this._isPending = new Map();
        this._isDispatching = false;
        this._lastID = 1;
        this._pendingPayload = undefined;

    }

    /**
     * payload 가 dispatched 될 때 호출할 callback 을 등록합니다.
     * id 는 waitFor 메소드를 실행하기 위해서 반환됩니다.
     */
    register(callback: (payload: TPayload) => void): DispatchToken {
        const id: DispatchToken = _prefix + this._lastID++;
        this._callbacks.set(id, callback);
        return id;
    }

    /**
     * register 로 등록된 callback 을 제거 합니다.
     * @param id
     */
    unregister(id: DispatchToken): void {
        this._invariantIDExist(id);
        this._callbacks.delete(id);
    }
    waitFor(ids: Array<DispatchToken>): void {
        invariant(
            this._isDispatching,
            'Dispatcher.waitFor : 디스패치중에는 waitFor 을 할 수 없습니다.'
        )
        // 이미 pending 되어 있는 callback 을 다시 pending 상태로 만들면 안된다.
        ids.forEach(id => {
            if(this._isPending.get(id)){
                invariant(
                    this._isHandled.hasOwnProperty(id),
                    'Dispatcher.waitFor(...): Circular dependency detected while ' +
                    'waiting for `%s`.',
                    id,
                );
            }else{
                this._invariantIDExist(id);
                this._invokeCallback(id);
            }
        });
    }
    // 등록된 콜백들에게 payload 를 전달(dispatch) 합니다.
    dispatch(payload: TPayload): void {
        invariant(
            !this._isDispatching,
            'Dispatch.dispatch: 이미 디스패치 중입니다.',
        );
        this._startDispatching(payload);
        try {
            for (const id in this._callbacks) {
                if (this._isPending.get(id)) {
                    continue;
                }
                this._invokeCallback(id);
            }
        } finally {
            this._stopDispatching();
        }
    }

    private _invariantIDExist(id: DispatchToken): void{
        invariant(
            this._callbacks.hasOwnProperty(id),
            'Dispatcher.unregister : %s 는 등록되지 않는 콜백입니다.',
        )
    }

    isDispatching(): boolean{
        return this._isDispatching;
    }

    /**
     * 실제 콜백함수를 실행하는 과정입니다. 콜백함수를 실행하면서 pending 과 handled 를 true 로 바꿈으로써 현재 콜백을 처리중이라고 bookkeeping 합니다.
     * @param id
     * @private
     */
    private _invokeCallback(id: DispatchToken){
        this._isPending.set(id, true)
        invariant(this._pendingPayload !== undefined, 'Dispatcher.invokeCallback: 현재 pending 된 Payload 가 없습니다.');
        this._invariantIDExist(id);
        // @ts-ignore
        this._callbacks.get(id)(this._pendingPayload as TPayload);
        this._isHandled.set(id, true);
    }

    /**
     * isPending 과 isHandled 를 false 로 초기화하고 pendingPayload 를 주어진 Payload 로 올려놓습니다.
     * @param payload
     * @private
     */
    private _startDispatching(payload: TPayload): void {
        for (const id of this._callbacks.keys()){
            this._isPending.set(id, false);
            this._isHandled.set(id, false);
        }
        this._pendingPayload = payload;
        this._isDispatching = true;
    }

    private _stopDispatching(): void {
        this._pendingPayload = undefined;
        this._isDispatching = false;
    }
}

// singleton
const dispatcher = new Dispatcher();
export { DispatchToken, dispatcher, type Dispatcher}
