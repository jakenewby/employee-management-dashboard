import * as React from 'react';
import './App.css';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import UserDataJson from './UserDataJson.json';

const columns: GridColDef[] = [
  {
    field: 'firstName',
    headerName: 'First Name',
    editable: true,
    width: 150,
  },
  {
    field: 'lastName',
    headerName: 'Last Name',
    editable: true,
    width: 150,
  },
  {
    field: 'jobTitle',
    headerName: 'Job Title',
    editable: true,
    width: 200,
  },
  {
    field: 'departmentId',
    headerName: 'Department',
    width: 200,
    editable: false,
    valueGetter: (params) =>
      UserDataJson.departments.find((d) => d.id === params.row.departmentId),
    // valueSetter: () => {}
  },
  {
    field: 'managerId',
    headerName: 'Manager',
    editable: false,
    valueGetter: (params) => {
      const manager = UserDataJson.people.find(
        (p) => p.id === params.row.managerId
      );
      return manager && `${manager?.lastName}, ${manager.firstName}`;
    },
  },
];

function App() {
  return (
    <div className="App">
      <Box sx={{ height: 600, width: '75vw' }}>
        <DataGrid
          rows={UserDataJson.people}
          columns={columns}
          checkboxSelection
          aria-label="employees"
        ></DataGrid>
      </Box>
    </div>
  );
}

export default App;
