import React, { useState } from "react";
import GameList from "../components/GameList";
import { leagues } from "../config/leagues";
import LeaguePage from "./LeaguePage";

function Home() {
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [currentWeeks, setCurrentWeeks] = useState({
    nfl: 8,
    cfb: 9,
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
      <h1 className="title-text">Ty's Corner</h1>
      {Object.entries(leagues).map(([key, league]) => (
        <section key={key}>
          <h2
            style={{ cursor: "pointer", color: "grey" }}
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
