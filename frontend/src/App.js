// import React, { useState } from 'react';
// import FacultyForm from './FacultyForm';
// import ScrapedDataGrid from './ScrapedDataGrid';
// import logo from './logo.png';
// import axios from 'axios';

// const App = () => {
//   const [facultyName, setFacultyName] = useState('');
//   const [uniqueLink, setUniqueLink] = useState('');
//   const [data, setData] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [department, setDepartment] = useState('');
//   const [selectAll, setSelectAll] = useState(false);  // Track if "Select All" is chosen

//   // Faculty links grouped by department
//   const facultyLinks = {
//     CSE: {
//       'Dr Nagendra Pratap Singh': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430447338bff038a7808e10',
//       'Dr Ajay Kr Sharma': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430447338bff038a7808e10',
//       'Dr A L Sangal': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430445438bff038a78055b4',
//       'Dr Harsh K Verma': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430445438bff038a7805712',
//       // Add more CSE faculty...
//     },
//     // Add other departments here (e.g., ECE, Mechanical, etc.)
    // ECE: {
    //   'Dr Rakesh Kumar': 'https://departments.nitj.ac.in/dept/ece/Faculty/12345',
    //   'Dr Meera Reddy': 'https://departments.nitj.ac.in/dept/ece/Faculty/67890',
    // }
//   };

//   // Function to scrape data for a single faculty member
//   const handleScrapeData = async (facultyLink) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post('http://localhost:5000/scrape', { url: facultyLink });
//       if (response.data.success) {
//         const dataWithId = response.data.data.map((row, index) => ({ id: index + 1, ...row }));
//         setData(dataWithId);
//       } else {
//         setError('Failed to fetch data');
//       }
//     } catch (err) {
//       setError('Failed to fetch data');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to scrape data for all faculty members in the selected department
//   const handleScrapeAllFaculty = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const departmentFacultyLinks = facultyLinks[department];
//       const facultyDataPromises = Object.values(departmentFacultyLinks).map(facultyLink =>
//         axios.post('http://localhost:5000/scrape', { url: facultyLink })
//       );

//       const responses = await Promise.all(facultyDataPromises);
//       const allData = responses.reduce((acc, response) => {
//         if (response.data.success) {
//           const dataWithId = response.data.data.map((row, index) => ({ id: index + 1, ...row }));
//           return [...acc, ...dataWithId];
//         }
//         return acc;
//       }, []);

//       setData(allData);
//     } catch (err) {
//       setError('Failed to fetch data');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter faculty based on selected department
//   const departmentFacultyLinks = department ? facultyLinks[department] : {};

//   return (
//     <div className="App">
//       <div className="logo-container">
//         <img src={logo} alt="Logo" className="logo" />
//       </div>

//       <div className="department-select">
//         <label>Department:</label>
//         <select
//           value={department}
//           onChange={(e) => setDepartment(e.target.value)}
//         >
//           <option value="">Select a Department</option>
//           {Object.keys(facultyLinks).map((dept, index) => (
//             <option key={index} value={dept}>
//               {dept}
//             </option>
//           ))}
//         </select>
//       </div>

//       {department && (
//         <div className="faculty-select">
//           <label>Faculty:</label>
//           <select
//             value={facultyName}
//             onChange={(e) => setFacultyName(e.target.value)}
//           >
//             <option value="">Select a Faculty</option>
//             {Object.keys(departmentFacultyLinks).map((faculty, index) => (
//               <option key={index} value={faculty}>
//                 {faculty}
//               </option>
//             ))}
//             <option value="all">Select All Faculty</option>
//           </select>
//         </div>
//       )}

//       {/* If 'Select All Faculty' is chosen, scrape data for all faculty */}
//       {facultyName === 'all' && (
//         <button onClick={handleScrapeAllFaculty} disabled={loading}>
//           {loading ? 'Scraping...' : 'Scrape All Faculty Data'}
//         </button>
//       )}

//       {/* Pass selected faculty (or "all" if selected) to FacultyForm */}
//       {facultyName !== 'all' && (
//         <FacultyForm
//           facultyName={facultyName}
//           setFacultyName={setFacultyName}
//           facultyLinks={departmentFacultyLinks}
//           setUniqueLink={setUniqueLink}
//           handleScrapeData={handleScrapeData}
//         />
//       )}

//       {uniqueLink && (
//         <div className="generated-link">
//           <p>
//             Unique Link: <a href={uniqueLink} target="_blank" rel="noopener noreferrer">{uniqueLink}</a>
//           </p>
//         </div>
//       )}

//       <ScrapedDataGrid data={data} loading={loading} error={error} />
//     </div>
//   );
// };

// export default App;

import './App.css';
import React, { useState } from 'react';
import FacultySelect from './FacultySelect';
import ScrapedDataGrid from './ScrapedDataGrid';
import axios from 'axios';

const App = () => {
  const [department, setDepartment] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const facultyLinks = {
    CSE: {
    'Dr Nagendra Pratap Singh': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430447338bff038a7808e10',
    'Dr Ajay Kr Sharma': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430447338bff038a7808e10',
    'Dr A L Sangal': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430445438bff038a78055b4',
    'Dr Harsh K Verma': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430445438bff038a7805712',
    'Dr Renu Dhir': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430445438bff038a78057a2',
    'Mr D K Gupta': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430447538bff038a780903f',
    'Dr Geeta Sikka': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430445438bff038a7805647',
    'Dr Rajneesh Rani': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430445538bff038a78057f8',
    'Dr Amritpal Singh': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430446d38bff038a78088fb',
    'Dr Aruna Malik': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430446c38bff038a780874c',
    'Dr K P Sharma': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430446838bff038a7807d43',
    'Dr Samayveer Singh': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430446b38bff038a78085b7',
    'Dr Urvashi': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430446c38bff038a780870c',
    'Dr Avtar Singh': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430446338bff038a7807694',
    'Dr Prashant Kumar': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430446d38bff038a78088bb',
    'Dr Banalaxmi Brahma': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430447438bff038a7808f65',
    'Mr Rahul Aggarwal': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430445438bff038a78057f4',
    'Dr Jagdeep Kaur': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430446d38bff038a78088a2',
    'Dr Kunwar Pal': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430446e38bff038a7808a14',
    'Dr Lalatendu Behera': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430446e38bff038a7808a31',
    'Dr Madhurima Buragohian': 'https://departments.nitj.ac.in/dept/cse/Faculty/66ed50e15beeaa89d07faca8',
    'Dr Naina Yadav': 'https://departments.nitj.ac.in/dept/cse/Faculty/66ed51145beeaa89d07fbcb0',
    'Dr Shefali Arora': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430447138bff038a7808ce8',
    'Dr Shweta Mahajan': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430447038bff038a7808ccb',
    'Dr Somesula Manoj Kumar': 'https://departments.nitj.ac.in/dept/cse/Faculty/6430447538bff038a7808fad',
    'Dr Sumit Kumar': 'https://departments.nitj.ac.in/dept/cse/Faculty/66ed514d5beeaa89d07fd562',
    'Dr Swarnima Singh Gautam': 'https://departments.nitj.ac.in/dept/cse/Faculty/652795ccb8c492ab73d26ad2',
    'Dr Tanmay Kumar Behera': 'https://departments.nitj.ac.in/dept/cse/Faculty/66ed51815beeaa89d07fdf96',
    },
    ECE: {
      'Dr Rakesh Kumar': 'https://departments.nitj.ac.in/dept/ece/Faculty/12345',
      'Dr Meera Reddy': 'https://departments.nitj.ac.in/dept/ece/Faculty/67890',
    }
    // Add other departments...
  };

  return (
    <div className="App">
      {/* Select Department */}
      <div>
        <label>Department:</label>
        <select onChange={(e) => setDepartment(e.target.value)} value={department}>
          <option value="">Select a Department</option>
          {Object.keys(facultyLinks).map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {department && (
        <FacultySelect
          department={department}
          facultyLinks={facultyLinks}
          setData={setData}
          setLoading={setLoading}
          setError={setError}
        />
      )}

      {/* Display data in a table */}
      <ScrapedDataGrid data={data} loading={loading} error={error} />
    </div>
  );
};

export default App;
