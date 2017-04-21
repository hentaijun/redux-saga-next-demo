import { fork, take, call, put, cancel, select, cancelled } from 'redux-saga/effects';
// import {takeEvery} from 'redux-saga';

export const delay = ms => new Promise(resolve => setTimeout(() => resolve('timed out'), ms));
// const forLoop = (ms) => new Promise(resolve => setTimeout(() => { console.log(123);return resolve(forLoop)},ms));
export function* turnOffLight() {
    while (true) {
        const action = yield take('TURN_OFF_LIGHT')
        yield put({ type: 'WAIT_CHANGE' });
        yield call(delay, 1000);
        yield put({ type: 'TURN_OFF' });
        yield put({ type: 'FINISH_CHANGE' });
    }
}

export function* turnOffLightSync() {
    yield put({ type: 'WAIT_CHANGE' });
    yield call(delay, 1000);
    yield put({ type: 'TURN_OFF' });
    yield put({ type: 'FINISH_CHANGE' });
}

export function* turnOnLight() {
    yield put({ type: 'WAIT_CHANGE' });
    yield call(delay, 2000);
    yield put({ type: 'TURN_ON' });
    yield put({ type: 'FINISH_CHANGE' });
}

export function* watchAction() {
    while (true) {
        const action = yield take('*');
        // console.log(action);
    }
}

export function getLight(state) {
    return state.light
}

export function* toggleLight(light) {
    try {
        if (light) {
            yield call(turnOffLightSync);
        } else {
            yield call(turnOnLight);
        }
    } finally {
        if (yield cancelled()) {
            yield put({ type: "CANCEL_LIGHT" });
        }
    }
}

export function* turnToggle() {
    while (true) {
        yield take('TURN_TOGGLE');
        const light = yield select(getLight);
        const toggleTask = yield fork(toggleLight, light);
        yield fork(cancelTask, toggleTask);
    }
}

export function* cancelTask(task) {
    yield take('CANCEL')
    yield cancel(task);
}

export function* tickSaga() {
    const { light } = yield take('START_TICK')
    while (true) {
        yield call(delay, 800);
        yield put({ type: 'TICK', ts: Date.now() });
    }
}
export default function* mainSaga() {
    yield [
        fork(tickSaga),
        fork(turnOffLight),
        fork(turnToggle),
        // fork(watchAction),
        fork(turnOnLight),
    ]
}