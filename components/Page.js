import React,{Component} from 'react';
import Link from 'next/link'
import { connect } from 'react-redux'
import Clock from './Clock'
import {turnOffLight,turnToggle} from '../model/action';

class Page extends Component {
  constructor(props){
    super(props);
  }
  turnOffLight(){
     this.props.dispatch(turnOffLight)
  }
  turnToggleFun(){
    this.props.dispatch(turnToggle)
  }
  cancalToggleFun(){
    this.props.dispatch({type:'CANCEL'});
  }
  render(){
      return (
        <div>
          <h1>{this.props.title}</h1>
          <Clock lastUpdate={this.props.lastUpdate} light={this.props.light} />
          <nav>
            <Link href={this.props.linkTo}><a>Navigate</a></Link>
          </nav>
          <h2>状态:{this.props.text}</h2>
          <button onClick={this.turnOffLight.bind(this)}>TurnOff</button>
          <button onClick={this.turnToggleFun.bind(this)}>Toggle</button>
          <button onClick={this.cancalToggleFun.bind(this)}>Cancel Toggle</button>
        </div>
      )
  }
}
export default connect(state=>{
  return {
    lastUpdate:state.lastUpdate,
    light:state.light,
    text:state.text
  }
})(Page);