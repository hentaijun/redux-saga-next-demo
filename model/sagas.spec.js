import test from 'tape';
import { fork, take, call, put, cancel,select,cancelled } from 'redux-saga/effects';
import {delay,turnOnLight,turnOffLight, turnToggle,getLight,turnOffLightSync,toggleLight,cancelTask} from './sagas';
import { createMockTask } from 'redux-saga/lib/utils'
// let light = true;
// const state = { light }
// const getLight = () => state.light;
test('turnOnLight Test',(t)=>{
    const generator = turnOnLight();

    t.deepEqual(
        generator.next().value,
        put({type:'WAIT_CHANGE'}),
        '分派WAIT_CHANGE的action，显示请稍后'
    );

    t.deepEqual(
        generator.next().value,
        call(delay,2000),
        '应该等待2秒'
    );

    t.deepEqual(
        generator.next().value,
        put({type:'TURN_ON'}),
        '触发TURN_ON的action'
    );

    t.deepEqual(
        generator.next().value,
        put({type:'FINISH_CHANGE'}),
        '分派FINISH_CHANGE的action，显示已完成'
    );
    
    t.deepEqual(
        generator.next(),
        { done: true, value: undefined },
        'TurnOnLight saga should be done'
    );
    
    t.end();
});

test('turnOffLight Test',(t)=>{
    const generator = turnOffLight();

    

    t.deepEqual(
        generator.next().value,
        take('TURN_OFF_LIGHT'),
        '接受TURN_OFF_LIGHT的action'
    );

    t.deepEqual(
        generator.next().value,
        put({type:'WAIT_CHANGE'}),
        '分派WAIT_CHANGE的action，显示请稍后'
    );

    t.deepEqual(
        generator.next().value,
        call(delay,1000),
        'wait 1s'
    );

    t.deepEqual(
        generator.next().value,
        put({type:'TURN_OFF'}),
        'dispatch TURN_OFF action'
    );

    t.deepEqual(
        generator.next().value,
        put({type:'FINISH_CHANGE'}),
        '分派FINISH_CHANGE的action，显示已完成'
    );

    t.end();
});

test('turnToggle Test', (t)=>{
    const generator = turnToggle();
    t.deepEqual(
        generator.next().value,
        take('TURN_TOGGLE'),
        '接受 TURN_TOGGLE 的action'
    );

    t.deepEqual(
        generator.next().value,
        select(getLight),
        '获取light的值'
    );

    let light;
    t.deepEqual(
        generator.next().value,
        fork(toggleLight,light),
        '调用toggleLight方法'
    )

    let mockTask;
    t.deepEqual(
        generator.next().value,
        fork(cancelTask,mockTask),
        '无阻塞调用CancelTask'
    )

    t.end();
});

test('toggleLight',(t)=>{
    let light = true
    let generator = toggleLight(light);
    // let step1 = (bool)=> generator.next(bool).value
    t.deepEqual(
        generator.next().value,
        call(turnOffLightSync),
        '关灯'
    );
    t.deepEqual(
        generator.next().value,
        cancelled(),
        '判断取消'
    )
    t.deepEqual(
        generator.next(true).value,
        put({ type: "CANCEL_LIGHT" }),
        '触发CANCEL_LIGHT的action'
    )
    // t.throws(
    //     generator.throw(SagaCancellationException).value,
    //     put({ type: "CANCEL_LIGHT" }),
    //     '抛出异常触发CANCEL_LIGHT的action'
    // );
    light = false
    generator = toggleLight(light);
    t.deepEqual(
        generator.next().value,
        call(turnOnLight),
        '开灯'
    )
    t.end();

});

test('cancelTask',(t)=>{
    const mockTask = createMockTask();
    let generator = cancelTask(mockTask)
    
    t.deepEqual(
        generator.next().value,
        take('CANCEL'),
        '等待CANCEL的action'
    );

    t.deepEqual(
        generator.next().value,
        cancel(mockTask),
        '取消task'
    )
    t.end();
})