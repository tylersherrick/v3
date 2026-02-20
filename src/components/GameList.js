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
          let comp = game.competitions[0];
          let gameStatus = comp.status.type.name;
          let awayScore = comp.competitors[1].score;
          let homeScore = comp.competitors[0].score;
          let date = comp.date;

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

          if (gameStatus === "STATUS_SCHEDULED") {
            status = gameTimeLocal;
            awayScore = "";
            homeScore = "";
          } 
          if (["STATUS_IN_PROGRESS", "STATUS_FINAL", "STATUS_HALFTIME", "STATUS_END_PERIOD"].includes(gameStatus)) {
            status = `${status}`;
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
        let away = comp.competitors[1].team.shortDisplayName;
        let home = comp.competitors[0].team.shortDisplayName;
        let shortAway = comp.competitors[1].team.abbreviation;
        let shortHome = comp.competitors[0].team.abbreviation;
        let homeLogo = comp.competitors[0].team.logo;
        let awayLogo = comp.competitors[1].team.logo;
        let awayScore = ` - ` + comp.competitors[1].score;
        let homeScore = ` - ` + comp.competitors[0].score;
        let gameStatus = comp.status.type.name;

        if (["CFB", "CBB", "CH"].includes(league.name)) {
          const awayRank = comp.competitors[1].curatedRank?.current;
          const homeRank = comp.competitors[0].curatedRank?.current;
          away = (awayRank && awayRank <= 25 ? ` ${awayRank}` : "") + " " + away;
          home = (homeRank && homeRank <= 25 ? ` ${homeRank}` : "") + " " + home;
        }
        if (gameStatus === "STATUS_SCHEDULED") {
            awayScore = "";
            homeScore = "";
        } 
        if(gameStatus === "STATUS_FINAL" && Number(homeScore.slice(3)) > Number(awayScore.slice(3))) {
            homeScore += ` ◀`;
        }
        if(gameStatus === "STATUS_FINAL" && Number(awayScore.slice(3)) > Number(homeScore.slice(3))) {
            awayScore += ` ◀`;
        }

        return (
          <div
            key={game.id || game.uid}
            ref={(el) => (containerRef.current[game.id || game.uid] = el)}
            className="short-game"
            style={{ marginBottom: "1rem", cursor: "pointer" }}
            onClick={() => setSelectedGame && setSelectedGame(game)}
          >
            <div>
                <div className="detail-game-row">
                  <img src={awayLogo} className="team-logo" />
                  <span>{away}{awayScore}</span>
                  <div className="game-center">
                    {/* Status will be updated via ref */}
                  </div>  
                </div>
                <div className="game-row">
                  <img src={homeLogo} className="team-logo" />
                  <span>{home}{homeScore}</span>
                </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default GameList;
