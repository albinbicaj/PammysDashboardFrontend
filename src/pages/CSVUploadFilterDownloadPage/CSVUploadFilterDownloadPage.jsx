import React, { useState } from 'react';
import {
  Button,
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Tooltip,
  Select,
  MenuItem,
} from '@mui/material';
import Papa from 'papaparse';
import { skuRedirectMap } from '../../hooks/skuMappings';
import { BlackCheckbox } from '../../components/UI/BlackCheckbox';

const CSVUploadFilterDownloadPage = () => {
  const [finalData, setFinalData] = useState([]);
  const [applyToAll, setApplyToAll] = useState({
    make_change_on: false,
    action: false,
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (results) => {
        const raw = results.data;
        const headers = raw[0];
        const contentRows = raw.slice(1);

        const normalizedData = contentRows.map((row) => {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });

        const rowsWithMenge = normalizedData.filter((row) => {
          const menge = row['Menge'];
          return (
            menge !== undefined &&
            menge !== null &&
            menge !== '' &&
            menge !== '0' &&
            parseFloat(menge) > 0
          );
        });

        const output = rowsWithMenge.map((srcRow) => {
          let originalSku = srcRow['Artikelnummer']?.trim();
          const mappedSku = skuRedirectMap[originalSku];
          const skuToUse = mappedSku || originalSku;

          return {
            sku: skuToUse,
            storage_location: '',
            physical_stock: parseFloat(String(srcRow['Menge']).replace(/,/g, '').trim()),
            make_change_on: 'db',
            action: 'add',
          };
        });

        setFinalData(output);
      },
    });
  };

  const handleChange = (index, field, value) => {
    const updatedData = [...finalData];

    if (applyToAll[field]) {
      const newData = updatedData.map((row) => ({ ...row, [field]: value }));
      setFinalData(newData);
    } else {
      updatedData[index][field] = value;
      setFinalData(updatedData);
    }
  };

  const handleDownload = () => {
    const csv = Papa.unparse(finalData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transformed_output.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ backgroundColor: '#fff', padding: 4, borderRadius: 0, marginTop: 4 }}
    >
      <Typography variant="h5" gutterBottom>
        Artikel-CSV hochladen → Menge zuweisen & herunterladen
      </Typography>

      <Button
        variant="outlined"
        component="label"
        sx={{
          mb: 2,
          border: '1px solid gray',
          color: 'gray',
          ':hover': { border: '1px solid gray', color: 'gray' },
        }}
      >
        CSV hochladen
        <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
      </Button>

      {finalData.length > 0 ? (
        <>
          <Paper sx={{ mt: 2, mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>sku</TableCell>
                  <TableCell>storage_location</TableCell>
                  <TableCell>physical_stock</TableCell>
                  <Tooltip
                    title='If changes in portal then value must be "db", if changes in Shopify then value must be "shopify"'
                    arrow
                  >
                    <TableCell>make_change_on</TableCell>
                  </Tooltip>
                  <Tooltip
                    title='If we add stock then value is "add", if we update the whole stock then value is "update", if we subtract stock then value is "subtract"'
                    arrow
                  >
                    <TableCell>action</TableCell>
                  </Tooltip>
                </TableRow>
                <TableRow sx={{ '& td': { padding: '4px 8px' } }}>
                  <TableCell colSpan={3} sx={{ padding: '4px 8px' }} />
                  <TableCell sx={{ padding: '4px 8px' }}>
                    <BlackCheckbox
                      checked={applyToAll.make_change_on}
                      onChange={(e) =>
                        setApplyToAll((prev) => ({
                          ...prev,
                          make_change_on: e.target.checked,
                        }))
                      }
                    />
                    <Typography variant="caption">Alle anwenden</Typography>
                  </TableCell>
                  <TableCell sx={{ padding: '4px 8px' }}>
                    <BlackCheckbox
                      checked={applyToAll.action}
                      onChange={(e) =>
                        setApplyToAll((prev) => ({
                          ...prev,
                          action: e.target.checked,
                        }))
                      }
                    />
                    <Typography variant="caption">Alle anwenden</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {finalData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.sku}</TableCell>
                    <TableCell>{row.storage_location}</TableCell>
                    <TableCell>{row.physical_stock}</TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={row.make_change_on}
                        onChange={(e) => handleChange(index, 'make_change_on', e.target.value)}
                      >
                        <MenuItem value="db">db</MenuItem>
                        <MenuItem value="shopify">shopify</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={row.action}
                        onChange={(e) => handleChange(index, 'action', e.target.value)}
                      >
                        <MenuItem value="add">add</MenuItem>
                        <MenuItem value="update">update</MenuItem>
                        <MenuItem value="subtract">subtract</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <button className="btn btn-primary" onClick={handleDownload}>
            Transformierte CSV herunterladen
          </button>
        </>
      ) : (
        <Paper sx={{ mt: 4, p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2, color: '#000' }}>
            Keine gültigen Daten gefunden
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ color: '#000' }}>
            Bitte laden Sie eine CSV mit gültigen Mengenangaben hoch.
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default CSVUploadFilterDownloadPage;
