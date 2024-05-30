import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LeagueSummary from "./components/LeagueSummary";
import TeamStats from "./components/TeamStats";
import SeasonStats from "./components/SeasonStats"; // Import SeasonStats component
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LeagueSummary />} />
          <Route path="/team/:abbr" element={<TeamStats />} />
          <Route path="/team/:abbr/:seasonId" element={<SeasonStats />} /> // Add route for SeasonStats component
        </Routes>
      </div>
    </Router>
  );
}

export default App;
