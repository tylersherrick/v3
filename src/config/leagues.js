export const leagues = {
  nhl: {
    name: "NHL",
    apiUrl: "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard",
    usesWeeks: false,
    logoPath: (abbr) => `https://a.espncdn.com/i/teamlogos/nhl/500/${abbr}.png`,
  },
  nfl: {
    name: "NFL",
    apiUrl: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
    usesWeeks: true,
    logoPath: (abbr) => `https://a.espncdn.com/i/teamlogos/nfl/500/${abbr}.png`,
  },
  cfb: {
    name: "CFB",
    apiUrl: "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard",
    usesWeeks: true,
    logoPath: (abbr) => `https://a.espncdn.com/i/teamlogos/ncaa/500/${abbr}.png`,
  },
  mlb: {
    name: "MLB",
    apiUrl: "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard",
    usesWeeks: false,
    logoPath: (abbr) => `https://a.espncdn.com/i/teamlogos/mlb/500/${abbr}.png`,
  },
  nba: {
    name: "NBA",
    apiUrl: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
    usesWeeks: false,
    logoPath: (abbr) => `https://a.espncdn.com/i/teamlogos/nba/500/${abbr}.png`,
  },
};
