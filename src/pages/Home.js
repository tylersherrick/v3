import React, { useState } from "react";
import GameList from "../components/GameList";
import { leagues } from "../config/leagues";
import LeaguePage from "./LeaguePage";

function Home() {
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [currentWeeks, setCurrentWeeks] = useState({
    nfl: 1,
    cfb: 1,
  });

  if (selectedLeague) {
    return (
      <LeaguePage
        leagueKey={selectedLeague}
        currentWeek={currentWeeks[selectedLeague]}
        onBack={() => setSelectedLeague(null)}
      />
    );
  }

  return (
    <div>
      <h1>Sports Tracker v3</h1>
      {Object.entries(leagues).map(([key, league]) => (
        <section key={key}>
          <h2
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => setSelectedLeague(key)}
          >
            {league.name}
          </h2>
          <GameList
            leagueKey={key}
            limit={3}
            currentWeek={currentWeeks[key] || 1}
          />
        </section>
      ))}
    </div>
  );
}

export default Home;
