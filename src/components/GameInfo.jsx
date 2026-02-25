const GameInfo = ({game}) => {

  let gameTime = game.status.type.detail;
  let venue = game.competitions[0].venue.fullName || "";
  let city = game.competitions[0].venue.address.city || "";
  let state = game.competitions[0].venue.address.state || "";
  let coverage = game?.competitions?.[0]?.geoBroadcasts?.[0]?.media?.shortName || "";
  const comp = game?.competitions?.[0];
  const gameTimeLocal = comp?.date
    ? new Date(comp.date).toLocaleString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  if(venue != "") {
    venue = venue + " - ";
  }
  
  return (
    <div className="container">
      <div className="row">
        <h5>Game Information</h5>
      </div>

      <div style={{ marginTop: "15px" }}></div>

      <div className="row">
        <h7>{gameTimeLocal}</h7>
      </div>

      <div className="row">
        <h7>{coverage}</h7>
      </div>

      <div style={{ marginTop: "35px" }}></div>

      <div className="row">
        <h7>{venue} {city + ", " + state}</h7>
      </div>

    </div>
  );
};

export default GameInfo;
