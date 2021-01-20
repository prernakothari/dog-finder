import './App.css';
import Viewer from "./viewer"
import ViewControl from "./viewControl"

function App() {
  let imageData;
  return (
    <div className="App">
      <header className="App-header">
        <ViewControl/>
        <Viewer desiredWidth={window.innerWidth*0.95} /> 
      </header>
    </div>
  );
}

export default App;
