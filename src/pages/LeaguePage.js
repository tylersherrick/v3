import React from "react";
import GameList from "../components/GameList";

function LeaguePage({ leagueKey, currentWeek, onBack, setSelectedGame }) {
  return (
    <div>
      <button onClick={onBack}>All Games</button>
      <h1>{leagueKey.toUpperCase()} Games</h1>
      <GameList
        leagueKey={leagueKey}
        currentWeek={currentWeek}
        setSelectedGame={setSelectedGame}
      />
    </div>
  );
}

export default LeaguePage;
