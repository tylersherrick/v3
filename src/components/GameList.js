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
      const today = new Date();
      const formatted = today.getFullYear().toString() +
        String(today.getMonth() + 1).padStart(2, '0') +
        String(today.getDate()).padStart(2, '0');
      try {
        let url = league.apiUrl;
        if(league.name === "NHL" || league.name === "NBA" || league.name === "CBB") {
          url += `?dates=${formatted}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch games");
        const data = await res.json();
        const sorted = (data.events || []).sort((a, b) => {
          const aFinal = a.competitions[0].status.type.name === "STATUS_FINAL";
          const bFinal = b.competitions[0].status.type.name === "STATUS_FINAL";

          if (aFinal && !bFinal) return 1;
          if (bFinal && !aFinal) return -1;
          return 0;
        });
        setGames(sorted);
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
        let shortAway = game.competitions[0].competitors[1].team.abbreviation;
        let shortHome = game.competitions[0].competitors[0].team.abbreviation;
        let status = game.status?.type?.shortDetail || "TBD";
        let awayScore = game.competitions[0].competitors[1].score;
        let homeScore = game.competitions[0].competitors[0].score;
        const gameStatus = game.competitions[0].status.type.name;
        let homeLogo = game.competitions[0].competitors[0].team.logo;
        let awayLogo = game.competitions[0].competitors[1].team.logo;
        let date = game.competitions[0].date;
        let homeRank = game.competitions[0].competitors[0].curatedRank?.current;
        let awayRank = game.competitions[0].competitors[1].curatedRank?.current;
        const gameTimeLocal = date
          ? new Date(date).toLocaleString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
          : "";
        if(gameStatus != "STATUS_FINAL") {
          awayScore = "";
          homeScore = "";
        }
        if(gameStatus === "STATUS_SCHEDULED") {
          status = gameTimeLocal;
        }
        if (league.name === "CFB" || league.name === "CBB") {
            shortAway = (awayRank && awayRank <= 25 ? ` ${awayRank}` : "") + " " + shortAway;
            shortHome = shortHome + (homeRank && homeRank <= 25 ? ` ${homeRank}` : "");
        }

        return (
          <div
            key={game.id || game.uid}
            className="short-game"
            style={{ marginBottom: "1rem", cursor: "pointer" }}
            onClick={() => setSelectedGame && setSelectedGame(game)}
          >
            <div className="game-row">
              <div className="team-left">
                <img src={awayLogo} className="team-logo" />
                <span>{shortAway} {awayScore}</span>
              </div>
              <div className="game-center">
                {status}
              </div>
              <div className="team-right">
                <span>{homeScore} {shortHome}</span>
                <img src={homeLogo} className="team-logo" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default GameList;
