export const startClock = () => dispatch => {
  return dispatch({ type: 'START_TICK', light: true})
}
export const turnOffLight = {
    type:'TURN_OFF_LIGHT'
}
export const turnToggle = {
    type:'TURN_TOGGLE'
}