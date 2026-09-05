// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { CanvasContainer } from '../components/CanvasContainer';
import NxWelcome from './nx-welcome';
import { boxScene } from "../lib/games/scenes/boxScene";
import { emptyScene } from "../lib/games/scenes/emptyScene";
import { GameScene } from "../lib/games/types/scene";

const gameLevelsManifest: GameScene[] = [
  boxScene, 
  emptyScene
]

export function App() {
  return (
    <div>
      <NxWelcome title="@org/frontend" />
      <CanvasContainer scenes={gameLevelsManifest}/>
    </div>
  );
}

export default App;
