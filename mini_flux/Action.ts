import { dispatcher } from "./Dispatcher";

interface Action {
    type: string,
    payload: any
}

const ActionTypes = {
    ADD_TODO: 'ADD_TODO',
    DELETE_COMPLETED_TODOS: 'DELETE_COMPLETED_TODOS',
    DELETE_TODO: 'DELETE_TODO',
    EDIT_TODO: 'EDIT_TODO',
    START_EDITING_TODO: 'START_EDITING_TODO',
    STOP_EDITING_TODO: 'STOP_EDITING_TODO',
    TOGGLE_ALL_TODOS: 'TOGGLE_ALL_TODOS',
    TOGGLE_TODO: 'TOGGLE_TODO',
    UPDATE_DRAFT: 'UPDATE_DRAFT',
};

const actions = {
    addTodo(text: string){
        dispatcher.dispatch({
            type: ActionTypes.ADD_TODO,
            payload: text,
        })
    }
}

export { Action, ActionTypes, actions }
