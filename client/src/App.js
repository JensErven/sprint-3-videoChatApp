import "./App.css";
import VideoPlayer from "./components/VideoPlayer";
import Options from "./components/Options";
import Notifications from "./components/Notifications";

function App() {
  return (
    <div className="App bg-slate-950">
      <VideoPlayer />
      <Options>
        <Notifications />
      </Options>
    </div>
  );
}

export default App;
