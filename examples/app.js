import React from 'react';
import ReactDOM from 'react-dom';
import Demo from 'demo';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }

  _onTextChange(e) {
    this.setState({text: e.target.value});
  }

  render() {
    return (
      <div>
        <Demo elementHeight={50}>
          <div>21312</div>
          <div>21312</div>
          <div>21312</div>
          <div>21312</div>
          <div>21312</div>
        </Demo>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
