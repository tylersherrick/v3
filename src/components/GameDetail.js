/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import { leagues } from "../config/leagues";

function GameDetail({ game, leagueName, onBackToLeague, onBackToMain }) {
  const [gameDetails, setGameDetails] = useState(game);
  const leagueKey = Object.keys(leagues).find(
    (key) => leagues[key].name === leagueName
  );
  const league = leagues[leagueKey];

  const fetchGameDetails = async () => {
    try {
      let url = league.apiUrl;
      if (league.usesWeeks) {
        // NFL / CFB: find week from game date
        const gameDate = new Date(game.date);
        const seasonStart = new Date("2025-09-04T00:00:00Z"); // adjust per league
        const diff = Math.floor(
          (gameDate - seasonStart) / (7 * 24 * 60 * 60 * 1000)
        );
        const week = diff + 2;
        url += `?week=${week}`;
      } else {
        // MLB / NBA / NHL: date format YYYYMMDD
        const gameDate = new Date(game.date);
        const year = gameDate.getFullYear();
        const month = String(gameDate.getMonth() + 1).padStart(2, "0");
        const day = String(gameDate.getDate()).padStart(2, "0");
        url += `?dates=${year}${month}${day}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch game details");
      const data = await res.json();
      const updatedGame = data.events.find((g) => g.id === game.id);
      if (updatedGame) setGameDetails(updatedGame);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGameDetails(); // initial fetch
    const interval = setInterval(fetchGameDetails, 1000); // refresh every 1s
    return () => clearInterval(interval);
  }, [game.id, league.apiUrl]);

  const comp = gameDetails?.competitions?.[0];
  let away = comp?.competitors?.[1]?.team?.shortDisplayName || "Away";
  let home = comp?.competitors?.[0]?.team?.shortDisplayName || "Home";
  const status = comp?.status?.type?.shortDetail || "TBD";

  if (["CFB", "CBB", "CH"].includes(league.name)) {
    const awayRank = comp.competitors[1].curatedRank?.current;
    const homeRank = comp.competitors[0].curatedRank?.current;
    away = (awayRank && awayRank <= 25 ? ` ${awayRank}` : "") + " " + away;
    home = (homeRank && homeRank <= 25 ? ` ${homeRank}` : "") + " " + home;
  }

  // Convert game start time to user's local timezone
  const gameTimeLocal = comp?.date
    ? new Date(comp.date).toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";


  return (
    <div>
      <button className="btn btn-secondary" onClick={onBackToLeague}>
        {leagueName} Games
      </button>

      <button
        className="btn btn-secondary"
        onClick={onBackToMain}
        style={{ marginLeft: "10px" }}
      >
        All Games
      </button>

      <div className="container">

        <div className="row justify-content-center text-center">
          <div className="col-4">
              <img className="img-fluid" src={game.competitions[0].competitors[1].team.logo} />
          </div>
          <div className="col-4">
              
          </div>
          <div className="col-4">
              <img className="img-fluid" src={game.competitions[0].competitors[0].team.logo} />
          </div>
        </div>

        <div className="row justify-content-center text-center">
          <div className="col-4">
              <h4>{away}</h4>
          </div>
          <div className="col-4">
              <h4>at</h4>
          </div>
          <div className="col-4">
              <h4>{home}</h4>
          </div>
        </div>

      </div>
    </div>
  );

}

export default GameDetail;
