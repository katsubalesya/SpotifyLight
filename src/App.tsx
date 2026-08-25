import { Router } from "./app/router/router";
import { PlayerProvider } from "./widgets/Player/playerContext";

function App() {
  return (
    <PlayerProvider>
      <Router />
    </PlayerProvider>
  );
}

export default App;
