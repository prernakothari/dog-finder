import './App.css';
import Viewer from "./viewer"
import ViewControl from "./viewControl"

function App() {
  let imageData;
  return (
    <div className="App">
      <header className="App-header">
        <ViewControl/>
        <Viewer /> 
      </header>
    </div>
  );
}

export default App;
