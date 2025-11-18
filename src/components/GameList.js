import React, { useState, useEffect, useRef } from "react";
import { leagues } from "../config/leagues";

function GameList({ leagueKey, limit, currentWeek, setSelectedGame }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const league = leagues[leagueKey];

  const containerRef = useRef({}); // holds references to each game's DOM

  useEffect(() => {
    const fetchGames = async () => {
      const today = new Date();
      const formatted =
        today.getFullYear().toString() +
        String(today.getMonth() + 1).padStart(2, "0") +
        String(today.getDate()).padStart(2, "0");

      try {
        let url = league.apiUrl;
        if (["NHL", "NBA", "CBB"].includes(league.name)) {
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

        // Initial load: set games
        if (games.length === 0) setGames(sorted);

        // Update inner content only
        sorted.forEach((game) => {
          const comp = game.competitions[0];
          const gameStatus = comp.status.type.name;
          const awayScore = comp.competitors[1].score;
          const homeScore = comp.competitors[0].score;
          const date = comp.date;

          let status = game.status?.type?.shortDetail || "TBD";
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

          if (gameStatus === "STATUS_SCHEDULED") status = gameTimeLocal;
          if (["STATUS_IN_PROGRESS", "STATUS_FINAL", "STATUS_HALFTIME"].includes(gameStatus)) {
            status = `${awayScore} - ${status} - ${homeScore}`;
          }

          const el = containerRef.current[game.id || game.uid];
          if (el) {
            el.querySelector(".game-center").textContent = status;
          }
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
    const interval = setInterval(fetchGames, 1000);
    return () => clearInterval(interval);
  }, [league.apiUrl, league.usesWeeks, currentWeek, games.length]);

  const displayedGames = limit ? games.slice(0, limit) : games;

  if (loading) return <p>Loading games...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {displayedGames.map((game) => {
        const comp = game.competitions[0];
        const away = comp.competitors[1].team.shortDisplayName;
        const home = comp.competitors[0].team.shortDisplayName;
        let shortAway = comp.competitors[1].team.abbreviation;
        let shortHome = comp.competitors[0].team.abbreviation;
        let homeLogo = comp.competitors[0].team.logo;
        let awayLogo = comp.competitors[1].team.logo;

        if (["CFB", "CBB"].includes(league.name)) {
          const awayRank = comp.competitors[1].curatedRank?.current;
          const homeRank = comp.competitors[0].curatedRank?.current;
          shortAway = (awayRank && awayRank <= 25 ? ` ${awayRank}` : "") + " " + shortAway;
          shortHome = shortHome + (homeRank && homeRank <= 25 ? ` ${homeRank}` : "");
        }

        return (
          <div
            key={game.id || game.uid}
            ref={(el) => (containerRef.current[game.id || game.uid] = el)}
            className="short-game"
            style={{ marginBottom: "1rem", cursor: "pointer" }}
            onClick={() => setSelectedGame && setSelectedGame(game)}
          >
            <div className="game-row">
              <div className="team-left">
                <img src={awayLogo} className="team-logo" />
                <span>{shortAway}</span>
              </div>
              <div className="game-center">
                {/* Status will be updated via ref */}
              </div>
              <div className="team-right">
                <span>{shortHome}</span>
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
