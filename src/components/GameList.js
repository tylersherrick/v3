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
        const shortAway = game.competitions[0].competitors[1].team.abbreviation;
        const shortHome = game.competitions[0].competitors[0].team.abbreviation;
        let status = game.status?.type?.shortDetail || "TBD";
        let awayScore = game.competitions[0].competitors[1].score;
        let homeScore = game.competitions[0].competitors[0].score;
        const gameStatus = game.competitions[0].status.type.name;
        let homeLogo = game.competitions[0].competitors[0].team.logo;
        let awayLogo = game.competitions[0].competitors[1].team.logo
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
            <span> <img src={awayLogo} className="team-logo"/> {shortAway} {awayScore} - {status} {homeScore} - {shortHome}  <img src={homeLogo} className="team-logo"/> </span>
          </div>
        );
      })}
    </div>
  );
}

export default GameList;
