import React, { useState, useEffect } from 'react'
import './App.css'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
} from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import UserDataJson from './UserDataJson.json'
import IconButton from '@mui/material/IconButton'
import { v4 as uuid } from 'uuid'

type Department = {
  id: string
  name: string
}

type Person = {
  id: string
  firstName: string
  lastName: string
  jobTitle: string
  departmentId: string
}

function buildColumns(
  people: Person[],
  departments: Department[],
  removePerson: (personId: string) => void
): GridColDef[] {
  return [
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
      valueGetter(params) {
        return departments.find((d) => d.id === params.row.departmentId)?.name
      },
    },
    {
      field: 'managerId',
      headerName: 'Manager',
      editable: false,
      valueGetter: (params) => {
        const manager = people.find((p) => p.id === params.row.managerId)
        return manager && `${manager?.lastName}, ${manager.firstName}`
      },
    },
    {
      field: 'deleteRow',
      headerName: '',
      renderCell(params: GridRenderCellParams<Person>) {
        return (
          <IconButton
            className='delete-person'
            aria-label="Delete Row"
            onClick={(e) => {
              e.stopPropagation()
              const shouldContinue = window.confirm('Remove this employee?')
              if (!shouldContinue) return
              removePerson(params.row.id)
            }}
          >
            🗑
          </IconButton>
        )
      },
    },
  ]
}

function getPersistPeople() {
  let persistedPeopleStr = localStorage.getItem('people')

  // load people into localStorage if not already present
  if (!persistedPeopleStr) {
    const basePeople = JSON.stringify({ people: UserDataJson.people })
    localStorage.setItem('people', basePeople)
    return basePeople
  }

  return persistedPeopleStr
}

function App() {
  const persistedPeopleStr = getPersistPeople()
  // TODO: parse typed people and handle errors. need to avoid type assertion
  const parsedPersistedPeopleObj = JSON.parse(persistedPeopleStr) as {
    people: Person[]
  }

  const [people, setPeople] = useState(parsedPersistedPeopleObj.people)
  const departments = UserDataJson.departments
  const addPerson = () =>
    setPeople(
      [
        {
          id: uuid(),
          firstName: '',
          lastName: '',
          jobTitle: '',
          departmentId: '',
        },
      ].concat(people)
    )
  const removePerson = (personId: string) =>
    setPeople(people.filter((p) => p.id !== personId))
  const updatePerson = (person: Person) => {
    setPeople(
      people.map((p) => {
        if (p.id === person.id) return person
        return p
      })
    )
  }

  // update localStorage every time a person is added or removed
  useEffect(() => {
    return localStorage.setItem('people', JSON.stringify({ people }))
  }, [people])

  const Toolbar = () => (
    <GridToolbarContainer>
      <IconButton
        className='new-person'
        onClick={() => {
          addPerson()
        }}
        aria-label="Add New Person"
      >
        + New Person
      </IconButton>
    </GridToolbarContainer>
  )

  return (
    <div className="App">
      <Box sx={{ height: 600, width: '75vw' }}>
        <DataGrid
          className='data-grid'
          rows={people}
          columns={buildColumns(people, departments, removePerson)}
          processRowUpdate={(newRow) => {
            updatePerson(newRow)
            return newRow
          }}
          checkboxSelection
          slots={{ toolbar: Toolbar }}
          aria-label="employees"
        ></DataGrid>
      </Box>
    </div>
  )
}

export default App
