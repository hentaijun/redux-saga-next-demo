const reducer = (state = { lastUpdate: 0, light: false, text:"" }, action) => {
  // console.log(action.type)
  switch (action.type) {
    case 'TICK': 
      return { ...state,lastUpdate: action.ts }
    case 'TURN_OFF':return {...state,light:false}
    case 'TURN_ON':return {...state,light:true}
    case 'WAIT_CHANGE':return {...state,text:"请稍后"}
    case 'FINISH_CHANGE':return {...state,text:"已完成"}
    case 'CANCEL_LIGHT':return {...state,text:"已取消"}
    default: return state
  }
}

export default reducer;