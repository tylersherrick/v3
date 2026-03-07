const GameStats = ({game, leagueName}) => {

  let shortAway = game.competitions[0].competitors[1].team.abbreviation;
  let shortHome = game.competitions[0].competitors[0].team.abbreviation;
  let awayLeaders = {
  goalLeader: game.competitions?.[0]?.competitors?.[1]?.leaders?.[0]?.leaders?.[0]?.athlete?.shortName ?? "",
  goals: `(${game.competitions?.[0]?.competitors?.[1]?.leaders?.[0]?.leaders?.[0]?.value ?? ""})`,
  assistLeader: game.competitions?.[0]?.competitors?.[1]?.leaders?.[1]?.leaders?.[0]?.athlete?.shortName ?? "", 
  assists: `(${game.competitions?.[0]?.competitors?.[1]?.leaders?.[1]?.leaders?.[0]?.value ?? ""})`,
  pointsLeader: game.competitions?.[0]?.competitors?.[1]?.leaders?.[2]?.leaders?.[0]?.athlete?.shortName ?? "",
  points: `(${game.competitions?.[0]?.competitors?.[1]?.leaders?.[2]?.leaders?.[0]?.value ?? ""})`
}

let homeLeaders = {
  goalLeader: game.competitions?.[0]?.competitors?.[0]?.leaders?.[0]?.leaders?.[0]?.athlete?.shortName ?? "",
  goals: `(${game.competitions?.[0]?.competitors?.[0]?.leaders?.[0]?.leaders?.[0]?.value ?? ""})`,
  assistLeader: game.competitions?.[0]?.competitors?.[0]?.leaders?.[1]?.leaders?.[0]?.athlete?.shortName ?? "",
  assists: `(${game.competitions?.[0]?.competitors?.[0]?.leaders?.[1]?.leaders?.[0]?.value ?? ""})`,
  pointsLeader: game.competitions?.[0]?.competitors?.[0]?.leaders?.[2]?.leaders?.[0]?.athlete?.shortName ?? "",
  points: `(${game.competitions?.[0]?.competitors?.[0]?.leaders?.[2]?.leaders?.[0]?.value ?? ""})`
}

  let goals = "Goals";
  let assists = "Assists";
  let points = "Points";
  let statData = "";

  if (!awayLeaders.goalLeader) {
    awayLeaders.goalLeader = "No goals yet";
    awayLeaders.goals = "";
    awayLeaders.assists = "";
    awayLeaders.points = "";
  }

  if (!homeLeaders.goalLeader) {
    homeLeaders.goalLeader = "No goals yet";
    homeLeaders.goals = "";
    homeLeaders.assists = "";
    homeLeaders.points = "";
  }

  if(["NHL"].includes(leagueName)) {
    statData = <>
      <div className="row justify-content-center text-center">
        <div className="col-5">
          <h7>{awayLeaders.goalLeader} {awayLeaders.goals}</h7>
        </div>
        <div className="col-2">
          <h7>{goals}</h7>
        </div>
        <div className="col-5">
          <h7>{homeLeaders.goalLeader} {homeLeaders.goals}</h7>
        </div>
      </div>

      <div style={{ marginTop: "50px" }}></div>

      <div className="row justify-content-center text-center">
        <div className="col-5">
          <h7>{awayLeaders.assistLeader} {awayLeaders.assists}</h7>
        </div>
        <div className="col-2">
          <h7>{assists}</h7>
        </div>
        <div className="col-5">
          <h7>{homeLeaders.assistLeader} {homeLeaders.assists}</h7>
        </div>
      </div>

      <div style={{ marginTop: "50px" }}></div>

      <div className="row justify-content-center text-center">
        <div className="col-5">
          <h7>{awayLeaders.pointsLeader} {awayLeaders.points}</h7>
        </div>
        <div className="col-2">
          <h7>{points}</h7>
        </div>
        <div className="col-5">
          <h7>{homeLeaders.pointsLeader} {homeLeaders.points}</h7>
        </div>
      </div>
    </>
  }

  if(["NBA", "CBB"].includes(leagueName)) {
    statData = <h5>Stats coming soon</h5>
  }

  return (
    <div className="container">
      <div className="row">
        <h5>Team Stats</h5>
      </div>

      <div style={{ marginTop: "15px" }}></div>

      <div style={{ marginTop: "30px" }}></div>

      <div className="stats-data">{statData}</div>
  
    </div>
  );
};

export default GameStats;
