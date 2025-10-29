import React, { useState, useEffect } from "react";
import { leagues } from "../config/leagues";

function GameList({ leagueKey, limit, currentWeek, setSelectedGame }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const league = leagues[leagueKey];

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        let url = league.apiUrl;

        if (league.usesWeeks) {
          url += `?week=${currentWeek}`;
        } else {
          const now = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });
          const today = new Date(now);
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, "0");
          const day = String(today.getDate()).padStart(2, "0");
          url += `?dates=${year}${month}${day}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch games");
        const data = await res.json();

        setGames(data.events || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [league.apiUrl, league.usesWeeks, currentWeek]);
  console.log(games);
  const displayedGames = limit ? games.slice(0, limit) : games;

  if (loading) return <p>Loading games...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {displayedGames.map((game) => {
        const comp = game.competitions[0];
        const away = comp.competitors[1].team.shortDisplayName;
        const home = comp.competitors[0].team.shortDisplayName;
        const status = game.status?.type?.shortDetail || "TBD";
        let awayScore = game.competitions[0].competitors[1].score;
        let homeScore = game.competitions[0].competitors[0].score;
        const gameStatus = game.competitions[0].status.type.name;
        if(gameStatus != "STATUS_FINAL") {
          awayScore = "";
          homeScore = "";
        }

        return (
          <div
            key={game.id || game.uid}
            className="short-game"
            style={{ marginBottom: "1rem", cursor: "pointer" }}
            onClick={() => setSelectedGame && setSelectedGame(game)}
          >
            <span>
              {status} - {away} {awayScore} - {homeScore} {home} 
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default GameList;
