/* global ReactDOM, React */

const App = () => {
  return (
    <div>
      <Settings />
      <MusicStaff />
    </div>
  )
}

const domContainer = document.getElementById('APP');
ReactDOM.render(React.createElement(App), domContainer);