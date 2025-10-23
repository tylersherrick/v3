import React, { useState, useEffect } from "react";
import { leagues } from "../config/leagues";

function GameList({ leagueKey, limit, currentWeek }) {
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
          // NFL / CFB
          url += `?week=${currentWeek}`;
        } else {
          // MLB / NBA / NHL
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

  const displayedGames = limit ? games.slice(0, limit) : games;
  console.log(games);
  if (loading) return <p>Loading games...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {displayedGames.map((game) => (
        <div className="short-game" key={game.id || game.uid} style={{ marginBottom: "1rem" }}>
          <span>{game.competitions[0].competitors[0].team.shortDisplayName} at {game.competitions[0].competitors[1].team.shortDisplayName} - {game.status.type.shortDetail}</span>
        </div>
      ))}
    </div>
  );
}

export default GameList;
