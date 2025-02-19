import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function FacultySelect({ department, facultyLinks, setData, setLoading, setError }) {
  const [selectedFaculty, setSelectedFaculty] = React.useState([]);  // Removed the TypeScript annotation

  // Handle changes when a faculty member is selected or deselected
  const handleChange = (event) => {
    const { target: { value } } = event;
    setSelectedFaculty(typeof value === 'string' ? value.split(',') : value);
  };

  // Handle select all faculty members
  const handleSelectAll = () => {
    const allFaculty = Object.keys(facultyLinks[department]);
    setSelectedFaculty(allFaculty);
  };

  // Make API call to scrape data for a faculty member
  const handleScrapeData = async (facultyLink) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/scrape', { url: facultyLink });
      if (response.data.success) {
        const dataWithId = response.data.data.map((row, index) => ({ id: index + 1, ...row }));
        setData((prevData) => [...prevData, ...dataWithId]);
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Scrape data for all selected faculty members
  const handleScrapeSelected = () => {
    if (selectedFaculty.length === 0) {
      alert('Please select at least one faculty member.');
      return;
    }

    setData([]); // Clear previous data
    setLoading(true);
    setError(null);

    // Loop over selected faculty members and scrape data for each one
    selectedFaculty.forEach(async (facultyName) => {
      const facultyLink = facultyLinks[department][facultyName];
      if (facultyLink) {
        await handleScrapeData(facultyLink);
      }
    });
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Faculty</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedFaculty}
          onChange={handleChange}
          input={<OutlinedInput label="Faculty" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {Object.keys(facultyLinks[department] || {}).map((facultyName) => (
            <MenuItem key={facultyName} value={facultyName}>
              <Checkbox checked={selectedFaculty.includes(facultyName)} />
              <ListItemText primary={facultyName} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Option to select all faculty members */}
      <button onClick={handleSelectAll}>Select All</button>
      
      {/* Button to scrape data for selected faculty */}
      <button onClick={handleScrapeSelected}>Scrape Selected Faculty</button>
    </div>
  );
}
