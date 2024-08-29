import { dispatcher } from './Dispatcher';
import Store from './Store';
import { type Action } from './Action';

type Card = {
    title: string;
    text: string;
};

class MyStore extends Store<Card> {
    constructor(state: Card) {
        super(state);
        super.dispatcherRegister();
    }

    reduce(action: Action): void {
        switch (action.type) {
            case 'test': {
                console.log('myStore: test', action.payload);
                super.setState(action.payload);
                break;
            }

            default:
                console.log('default');
        }
    }
}

const myStore = new MyStore({
    title: 'title',
    text: 'text',
});

const testSample = {
    type: 'test',
    payload: {
        title: 'titititle',
    },
};

const [view1, view2] = [3, 5];
function render() {
    console.log('render', view1, view2);
}

myStore.registerEvent(render);

dispatcher.newEvent(testSample);
