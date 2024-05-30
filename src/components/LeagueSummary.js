import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import { Link, useNavigate } from "react-router-dom";
import { nhlTeams } from "./config";
import "./LeagueSummary.css";
import Alert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


function LeagueSummary() {
  const [teams, setTeams] = useState([]);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [visibleRows, setVisibleRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("points");
  const [teamData, setTeamData] = useState(null);
  const [isError, setError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/teams")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.data)) {
          setTeams(data.data);
        } else {
          console.error("Data is not an array:", data);
        }
      })
      .catch((error) =>
        console.error("There was a problem with the fetch operation:", error)
      );
  }, []);

  useEffect(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, rows.length);
    setVisibleRows(rows.slice(startIndex, endIndex));
  }, [rows, rowsPerPage, page]);

  useEffect(() => {
    const rowsReq = teams.map((x) => ({
      id: x.teamId,
      name: x.teamFullName,
      wins: x.wins,
      loss: x.losses,
      ties: x.ties,
      points: x.points,
      seasonId: x.seasonId,
    }));
    setRows(rowsReq);
  }, [teams]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const groupedRows = React.useMemo(() => {
    const grouped = {};
    rows.forEach((row) => {
      if (!grouped[row.seasonId]) {
        grouped[row.seasonId] = [];
      }
      grouped[row.seasonId].push(row);
    });
    return grouped;
  }, [rows]);

  const newGroupedRows=Object.entries(groupedRows); 
  newGroupedRows.reverse()
  const reversedObject = Object.fromEntries(newGroupedRows); // Step 3

console.log(reversedObject);

  console.log("groupedRows",groupedRows)

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Name",
    },
    {
      id: "wins",
      numeric: true,
      disablePadding: false,
      label: "Wins",
    },
    {
      id: "loss",
      numeric: true,
      disablePadding: false,
      label: "Matches Lost",
    },
    {
      id: "ties",
      numeric: true,
      disablePadding: false,
      label: "Ties",
    },
    {
      id: "points",
      numeric: true,
      disablePadding: false,
      label: "Points",
    },
  ];

  const handleTeamStats = (teamAbbr) => {
    fetch(`/api/teams/${nhlTeams[teamAbbr]}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setTeamData(data);
          setError(false);
          const reqTeamData = teams.filter((x) => x.teamFullName === teamAbbr);
          console.log("req", reqTeamData);
          navigate(`/team/${teamAbbr}`, {
            state: {
              teamsData: reqTeamData,
              teamData: data,
              teamAbbr: nhlTeams[teamAbbr],
              team: teamAbbr,
            },
          });
        } else {
          console.error("Data is not an array:", data);
        }
      })
      .catch((error) => {
        setError(true);
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const handleClose=()=>{
    setError(false)
  }
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f0f0f0", // light gray background
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        League Summary
      </Typography>
      <Modal
      open={isError}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Alert severity="error">Sorry! Data cannot be fetched!</Alert>
      </Box>
    </Modal>
      
      {Object.entries(groupedRows).map(([seasonId, seasonRows]) => (
        <Paper
          className="tableContainer"
          sx={{ width: "100%", maxWidth: "1200px", mb: 2 }}
          key={seasonId}
        >
          <Typography
            variant="h5"
            component="h5"
            sx={{ color: "black", flexGrow: 1 }}
          >
            Season {seasonId.toString().slice(0, 4)}-
            {seasonId.toString().slice(4)}
          </Typography>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  {headCells.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.numeric ? "right" : "left"}
                      padding={headCell.disablePadding ? "none" : "normal"}
                      sortDirection={orderBy === headCell.id ? order : false}
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#1976d2",
                        color: "#fff",
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : "asc"}
                        onClick={createSortHandler(headCell.id)}
                        sx={{ color: "#fff" }}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(seasonRows, getComparator(order, orderBy)).map(
                  (row) => (
                    <TableRow
                      key={`${row.id}-${row.wins}`}
                      className="tableRow"
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "#f9f9f9",
                        },
                        "&:hover": {
                          backgroundColor: "#e0f7fa",
                        },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        className="tableBodyCell"
                      >
                        <Link
                          to="#"
                          onClick={() => handleTeamStats(row.name)}
                          style={{
                            textDecoration: "none",
                            color: "#1976d2",
                            fontWeight: "bold",
                          }}
                        >
                          {row.name}
                        </Link>
                      </TableCell>
                      <TableCell align="right" className="tableBodyCell">
                        {row.wins}
                      </TableCell>
                      <TableCell align="right" className="tableBodyCell">
                        {row.loss}
                      </TableCell>
                      <TableCell align="right" className="tableBodyCell">
                        {row.ties}
                      </TableCell>
                      <TableCell align="right" className="tableBodyCell">
                        {row.points}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={seasonRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ))}
    </Box>
  );
}

export default LeagueSummary;
