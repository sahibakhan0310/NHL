
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { teamColors } from './config';

const SeasonStats = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { seasonData, teamAbbr, team } = location.state || {};
  const backgroundColor = teamColors[teamAbbr] || "#003876";

  const goBack = () => {
    navigate(-1);
  };

  // Data for goals for vs goals against chart
  const goalsData = [
    { name: 'Goals For', value: seasonData.goalsFor },
    { name: 'Goals Against', value: seasonData.goalsAgainst },
  ];

  // Data for average goals per game
  const goalsPerGameData = [
    { name: 'Goals For/Game', value: seasonData.goalsForPerGame },
    { name: 'Goals Against/Game', value: seasonData.goalsAgainstPerGame },
  ];

  // Data for special teams performance
  const specialTeamsData = [
    { name: 'Power Play %', value: seasonData.powerPlayPct * 100 },
    { name: 'Penalty Kill %', value: seasonData.penaltyKillPct * 100 },
  ];

  // Data for win distribution
  const winData = [
    { name: 'Wins', value: seasonData.wins },
    { name: 'Losses', value: seasonData.losses },
    { name: 'Ties', value: seasonData.ties || 0 },
  ];

  // Data for shooting stats
  const shootingData = [
    { name: 'Shots For/Game', value: seasonData.shotsForPerGame },
    { name: 'Shots Against/Game', value: seasonData.shotsAgainstPerGame },
  ];

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: backgroundColor,
        overflowY: 'auto',
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
        <Typography variant="h3" component="h1" sx={{ mb: 2, color: 'white' }}>
          {team} - {seasonData.seasonId.toString().slice(0, 4)}-{seasonData.seasonId.toString().slice(4)}
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
        <Grid item xs={12} md={6}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Goals For vs. Goals Against
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={goalsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Special Teams Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={specialTeamsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Shooting Stats
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={shootingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Average Goals Per Game
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={goalsPerGameData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Win Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={winData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                    {winData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Points Percentage
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={[{ name: 'Point %', value: seasonData.pointPct * 100 }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#82ca9d" label>
                    <Cell key={`cell-0`} fill="#82ca9d" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" onClick={goBack} sx={{ mb: 2 }}>
        Back
      </Button>
    </Box>
  );
};

export default SeasonStats;
