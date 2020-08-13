import React,{Component} from 'react'

// import logoImg from './job.png'
import './logo.css'

class Logo extends Component {
  render() {
    return (
      <div className="log-container">
        <img src={require('./job.png')} alt=""/>
      </div>
    )
  }
}

export default Logo