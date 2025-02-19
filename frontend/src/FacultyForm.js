import './FacultyForm.css';
import React from 'react';

const FacultyForm = ({ facultyName, setFacultyName, facultyLinks, setUniqueLink, handleScrapeData }) => {
  const handleFacultySubmit = (e) => {
    e.preventDefault();
    if (facultyLinks[facultyName]) {
      const generatedLink = facultyLinks[facultyName];
      setUniqueLink(generatedLink);
      handleScrapeData(generatedLink); // Use the function passed from App.js
    } else {
      alert('Please select a faculty name.');
    }
  };

  return (
    <div className="faculty-form">
      <h3>Where Knowledge Meets Collaboration</h3>
      <form onSubmit={handleFacultySubmit}>
        <div className="form-inputs">
          <label>Faculty Name:</label>
          <select
            value={facultyName}
            onChange={(e) => setFacultyName(e.target.value)}
            required
          >
            <option value="">Select a Faculty</option>
            {Object.keys(facultyLinks).map((faculty, index) => (
              <option key={index} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>
        </div>
        <div className="button-group">
          <button type="button" onClick={() => alert('Select All clicked!')}>Select All</button>
          </div>
        <div  className="button-group">
          <button type="submit">Scrape Selected Faculty</button>
        </div>
      </form>
    </div>
  );
};

export default FacultyForm;
