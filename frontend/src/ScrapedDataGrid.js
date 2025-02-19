import React, { useEffect, useRef, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import './ScrapedDataGrid.css'; // Import your custom CSS

const ScrapedDataGrid = ({ data, loading, error }) => {
  const gridRef = useRef(null); // Create a ref for the DataGrid
  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.api?.showFilter();
    }
  }, []);

  const rows = data.map((item) => ({
    id: item.id,
    sNo: item["0"],
    year: item["1"],
    authorTitle: item["2"],
    journalName: item["3"],
    link: item["4"].link,
  }));

  const columns = [
    { field: 'sNo', headerName: 'S.No', width: 100, filterable: true },
    { field: 'year', headerName: 'Year', width: 120, filterable: true },
    {
      field: 'authorTitle',
      headerName: 'Author + Title',
      flex: 2,
      renderCell: (params) => <span>{params.value}</span>,
      filterable: true,
    },
    { field: 'journalName', headerName: 'Name of Journal', flex: 1, filterable: true },
    {
      field: 'link',
      headerName: 'Link',
      width: 150,
      renderCell: (params) => (
        <a
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'blue' }}
        >
          {params.value ? 'View Paper' : 'No Link Available'}
        </a>
      ),
      filterable: false,
    },
  ];

  const handleFilterModelChange = (newFilterModel) => {
    setFilterModel(newFilterModel);
  };

  return (
    <div>
      <h1>Scraped Data</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {rows.length > 0 && !loading && (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            ref={gridRef}
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row.id}
            filterModel={filterModel}
            onFilterModelChange={handleFilterModelChange}
            disableColumnMenu={false}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'row-even' : 'row-odd'
            } // Apply alternating row styles
          />
        </div>
      )}
    </div>
  );
};

export default ScrapedDataGrid;
