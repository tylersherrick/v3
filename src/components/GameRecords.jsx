const GameRecords = ({game}) => {

  let awayOverall = game?.competitions?.[0]?.competitors?.[0]?.records?.[0]?.summary ?? "";
  let homeOverall = game?.competitions?.[0]?.competitors?.[1]?.records?.[0]?.summary ?? "";
  let awayHomeRecord = game?.competitions?.[0]?.competitors?.[0]?.records?.[1]?.summary ?? "";
  let homeHomeRecord = game?.competitions?.[0]?.competitors?.[1]?.records?.[1]?.summary ?? "";
  let awayAwayRecord = game?.competitions?.[0]?.competitors?.[0]?.records?.[2]?.summary ?? "";
  let homeAwayRecord = game?.competitions?.[0]?.competitors?.[1]?.records?.[2]?.summary ?? "";

  return (
    <div className="container">
      <div className="row">
        <h5>Team Records</h5>
      </div>

      <div style={{ marginTop: "45px" }}></div>

      <div className="row justify-content-center text-center">

        <div className="row justify-content-center text-center">
          <div className="col">
            <h7>{awayOverall}</h7>
          </div>
          <div className="col">
            <h7>Overall</h7>
          </div>
          <div className="col">
            <h7>{homeOverall}</h7>
          </div>
        </div>

        <div style={{ marginTop: "50px" }}></div>

        <div className="row justify-content-center text-center">
          <div className="col">
            <h7>{awayHomeRecord}</h7>
          </div>
          <div className="col">
            <h7>Home</h7>
          </div>
          <div className="col">
            <h7>{homeHomeRecord}</h7>
          </div>
        </div>

        <div style={{ marginTop: "50px" }}></div>

        <div className="row justify-content-center text-center">
          <div className="col">
            <h7>{awayAwayRecord}</h7>
          </div>
          <div className="col">
            <h7>Away</h7>
          </div>
          <div className="col">
            <h7>{homeAwayRecord}</h7>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GameRecords;
