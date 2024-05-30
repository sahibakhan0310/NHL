import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { teamColors } from "./config";

const TeamStats = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { teamsData = [], teamAbbr, team, teamData } = location.state || {};
  const backgroundColor = teamColors[teamAbbr] || "#003876";

  console.log("teams", teamData);
  const handleCardClick = (seasonData) => {
    navigate(`/team/${teamAbbr}/${seasonData.seasonId}`, {
      state: { seasonData, teamAbbr, team },
    });
  };
  const goHome = () => {
    navigate("/");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="start"
      p={2}
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: backgroundColor,
        overflowY: "auto",
      }}
    >
      <Box
        className="header-box"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="97%"
        p={1}
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          mb: 4,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{ color: "white", flexGrow: 1 }}
        >
          {team}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={goHome}
          sx={{ ml: 2 }}
        >
          Home
        </Button>
      </Box>

      <Grid container spacing={2} justifyContent="center">
        {teamsData.map((seasonData, index) => {
          // Find the relevant season object based on seasonId
          const season = teamData.find(
            (season) => season.season === seasonData.seasonId
          );
          if (!season) return null; // If no matching season is found, skip rendering

          return (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{ cursor: "pointer", backgroundColor: "#f0f0f0" }}
                onClick={() => handleCardClick(seasonData)}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    Season {seasonData.seasonId.toString().slice(0, 4)}-
                    {seasonData.seasonId.toString().slice(4)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Games Played: {seasonData.gamesPlayed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Wins: {seasonData.wins}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Losses: {seasonData.losses}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Game Types: {season.gameTypes.join(", ")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default TeamStats;
