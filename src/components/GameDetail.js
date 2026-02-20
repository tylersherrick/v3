/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import { leagues } from "../config/leagues";
import GameTabs from "./GameTabs";
import GameInfo from "./GameInfo";
import GameRecords from "./GameRecords";
import GameStats from "./GameStats";


function GameDetail({ game, leagueName, onBackToLeague, onBackToMain }) {
  const [gameDetails, setGameDetails] = useState(game);
  const leagueKey = Object.keys(leagues).find(
    (key) => leagues[key].name === leagueName
  );
  const league = leagues[leagueKey];

  const [activeTab, setActiveTab] = useState("info");

  const tabs = {
    info: <GameInfo game={game} />,
    records: <GameRecords game={game} />,
    stats: <GameStats game={game} />,
  };

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
  let shortAway = comp.competitors[1].team.abbreviation;
  let shortHome = comp.competitors[0].team.abbreviation;
  const status = comp?.status?.type?.shortDetail || "TBD";
  let longerStatus = comp.status.type.detail;
  let awayScore = comp.competitors[1].score;
  let homeScore = comp.competitors[0].score;
  let gameStatus = comp.status.type.name;
  let scoreBlock = "";

  if (["CFB", "CBB", "CH"].includes(league.name)) {
    const awayRank = comp.competitors[1].curatedRank?.current;
    const homeRank = comp.competitors[0].curatedRank?.current;
    away = (awayRank && awayRank <= 25 ? ` ${awayRank}` : "") + " " + away;
    home = (homeRank && homeRank <= 25 ? ` ${homeRank}` : "") + " " + home;
  }

  // Convert game start time to user's local timezone
  const gameTimeLocal = comp?.date
    ? new Date(comp.date).toLocaleString(undefined, {
        
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  if (gameStatus != "STATUS_SCHEDULED") {
      scoreBlock = 
        <div style={{ marginTop: "20px" }}>
          <div className="row justify-content-center text-center">
            <div className="col">
              
            </div>
            <div className="col">
              <h5>{awayScore} - {homeScore}</h5>
            </div>
            <div className="col">
              
            </div>
          </div>
        <div style={{ marginTop: "20px" }}>
          <div className="row justify-content-center text-center">
            <h6>{status}</h6>
          </div>
        </div>
      </div>
  
  } else {
    scoreBlock = 
      <div style={{ marginTop: "20px" }}>
        <div className="row justify-content-center text-center">
          <h6>{gameTimeLocal}</h6>
        </div>
      </div>
    ;
  }


  return (
      <div className="container">

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

        <div style={{ marginTop: "25px" }}>
          <div className="row justify-content-center text-center ">
            <div className="col-4">
                <img className="img-fluid" src={game.competitions[0].competitors[1].team.logo} />
            </div>
            <div className="col-4">
                
            </div>
            <div className="col-4">
                <img className="img-fluid" src={game.competitions[0].competitors[0].team.logo} />
            </div>
          </div>
        </div>

        <div className="row justify-content-center text-center">
          <div className="col-4 team-names">
              <h4>{away}</h4>
          </div>
          <div className="col-4 team-names">
              <h4>at</h4>
          </div>
          <div className="col-4 team-names">
              <h4>{home}</h4>
          </div>
        </div>

        <div>{scoreBlock}</div>

        <div style={{ marginTop: "35px" }}>
          <span className="horizontal-border"></span>
          <div className="row justify-content-center text-center">
            <div
              className="col stat-tab"
              onClick={() => setActiveTab("info")}
            >
              <h5>Info</h5>
            </div>
            <div
              className="col with-border stat-tab"
              onClick={() => setActiveTab("records")}
            >
              <h5>Records</h5>
            </div>
            <div
              className="col with-border stat-tab"
              onClick={() => setActiveTab("stats")}
            >
              <h5>Stats</h5>
            </div>
          </div>
        </div>

        <span className="horizontal-border"></span>

        <div>
          <GameTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Show the currently active tab */}
          {tabs[activeTab]}
        </div>


      </div>
  );

}

export default GameDetail;
