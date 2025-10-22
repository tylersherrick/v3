import React from "react";
import GameList from "../components/GameList";

function LeaguePage({ leagueKey, currentWeek, onBack }) {
  return (
    <div>
      <button onClick={onBack}>← Back</button>
      <h1>{leagueKey.toUpperCase()} Games</h1>
      <GameList leagueKey={leagueKey} currentWeek={currentWeek} />
    </div>
  );
}

export default LeaguePage;
