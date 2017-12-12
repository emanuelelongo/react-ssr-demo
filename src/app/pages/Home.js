import React from 'react';

// -------- suppose this to be in another file ---------------
const hoc = loader => Component => {
  return class WrappedComponent extends React.Component {
    
    componentWillMount() {
      // damn... this will not wait to data to be loaded!
      loader(this)
    }

    render() {
      return <Component {...this.state}/>
    }
  }
}
// ------------------------------------------------------------

class Home extends React.Component {

  render() {
    return (
      <div>
        <h2>~ Home Page ~</h2>
        <span>Benvenuto {this.props.name}</span>
      </div>
    );
  }
}

const loader = (component) => {
  return new Promise((resolve) => 
    setTimeout(() => {
      component.setState({name: 'Emanuele'})
      resolve()
    }, 1000)
  )
}

export default hoc(loader)(Home)