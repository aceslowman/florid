/* global ReactDOM, React */

const App = () => {
  return React.createElement(
    'div', 
    null,
    'hello world'
    )
}

const domContainer = document.getElementById('APP');
ReactDOM.render(React.createElement(App), domContainer);