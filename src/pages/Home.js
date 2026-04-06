import React, { useState } from "react";
import GameList from "../components/GameList";
import { leagues } from "../config/leagues";
import LeaguePage from "./LeaguePage";
import GameDetail from "../components/GameDetail";

function Home() {
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  if (selectedGame) {
    const league = leagues[selectedLeague];
    return (
      <GameDetail
        game={selectedGame}
        leagueName={league?.name}
        onBackToLeague={() => setSelectedGame(null)}
        onBackToMain={() => {
          setSelectedGame(null);
          setSelectedLeague(null);
        }}
      />
    );
  }

  if (selectedLeague) {
    return (
      <LeaguePage
        leagueKey={selectedLeague}
        onBack={() => setSelectedLeague(null)}
        setSelectedGame={setSelectedGame}
      />
    );
  }

  return (
    <div>
      <h1 className="title-text">Ty's Corner</h1>
        {Object.entries(leagues).map(([key, league]) => (
          <section key={key}>
            <h2 className="league-name" style={{ cursor: "pointer", color: "grey" }} onClick={() => setSelectedLeague(key)}>
              {league.name}
            </h2>
            <GameList leagueKey={key}limit={3} setSelectedGame={(game) => { setSelectedLeague(key); setSelectedGame(game);}}/>
          </section>
        ))}
    </div>
  );
}

export default Home;
