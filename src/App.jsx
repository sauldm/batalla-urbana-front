import { BrowserRouter, Route, Routes } from "react-router-dom";
import Game from "./containers/Game";
import Home from "./containers/Home";
import Lobby from "./containers/Lobby";
import { LobbyProvider } from "./providers/LobbyProvider";
import { GameProvider } from "./providers/GameProvider";
import EndGameTable from "./containers/EndGameTable";
import Tutorial from "./containers/Tutorial";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <LobbyProvider>
              <Home />
            </LobbyProvider>
          }
        />

        <Route
          path="/lobby/:id"
          element={
            <LobbyProvider>
              <Lobby />
            </LobbyProvider>
          }
        />

        <Route
          path="/game/:id"
          element={
            <GameProvider>
              <Game />
            </GameProvider>
          }
        />

        <Route path="/ranking" element={<EndGameTable />} />
        <Route path="/tutorial" element={<Tutorial />} />

      </Routes>
    </BrowserRouter>
  );
}
