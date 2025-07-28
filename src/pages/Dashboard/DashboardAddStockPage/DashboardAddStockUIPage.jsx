import { useEffect, useRef } from 'react';
import {
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepButton,
  Backdrop,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { TabPanel } from '../../../components/atoms';
import { AddScanning, CountScanning } from '../../../components/organisms';
import { PammysLoading } from '../../../components/atoms/PammysLoading/PammysLoading';

const ScannerListener = ({ handleScan }) => {
  const barcodeScanRef = useRef('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      if (key === 'Shift' || key === 'Tab' || key === 'Alt' || key === 'Control') return;
      if (key === 'Enter') {
        if (barcodeScanRef.current.length > 3) {
          handleScan(barcodeScanRef.current);
        }
        barcodeScanRef.current = '';
        return;
      }
      barcodeScanRef.current += key;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        barcodeScanRef.current = '';
      }, 500);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleScan]);

  return null;
};

const DashboardAddStockUIPage = ({
  handleBarcodeScan,
  activeStep,
  activeTab,
  handleChange,
  logs,
  steps,
  cartonSize,
  setCartonSize,
  isEditable,
  setIsEditable,
  googleSheetName,
  setGoogleSheetName,
  isLoading,
  aggregatedLogs,
  totalQuantity,
  totalCartonSize,
  handleBack,
  handleSubmitLoading,
  handleSubmit,
  isScanComplete,
  handleNext,
  completed,
  handleRemoveLog,
  subActiveTab,
  setSubActiveTab,
  subAddActiveTab,
  setAddSubActiveTab,
}) => {
  return (
    <div className="returns-container p-4">
      <ScannerListener handleScan={handleBarcodeScan} />
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={handleSubmitLoading}
      >
        <PammysLoading />
      </Backdrop>
      {activeStep === 0 && (
        <div className="border-l-8 border-gray-400 ps-2">
          <Tabs
            className="flex w-full items-center border bg-white shadow"
            value={activeTab}
            onChange={handleChange}
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#4b5563' },
              '& .Mui-selected': { color: '#4b5563 !important' },
            }}
          >
            <Tab
              className="mr-10 w-max text-sm font-medium leading-5 focus:outline-none"
              label="Hinzufügen mit Scannen"
              value="add_scanning"
              sx={{ textTransform: 'none' }}
              disabled={logs.length > 0 && activeTab !== 'add_scanning'}
            />
            <Tab
              className="mr-10 w-max text-sm font-medium leading-5 focus:outline-none"
              label="Aktualisieren mit Scannen"
              value="count_scanning"
              sx={{ textTransform: 'none' }}
              disabled={logs.length > 0 && activeTab !== 'count_scanning'}
            />
          </Tabs>
        </div>
      )}
      <Box sx={{ width: '100%', marginTop: '20px' }}>
        <Paper
          elevation={3}
          sx={{ padding: 2, borderRadius: '0px', boxShadow: 'none', border: '1px solid #e5e7eb' }}
        >
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton color="inherit">{label}</StepButton>
              </Step>
            ))}
          </Stepper>
        </Paper>
      </Box>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeStep === 0 && (
            <>
              <TabPanel value={activeTab} index="add_scanning">
                <AddScanning
                  cartonSize={cartonSize}
                  setCartonSize={setCartonSize}
                  isEditable={isEditable}
                  setIsEditable={setIsEditable}
                  googleSheetName={googleSheetName}
                  setGoogleSheetName={setGoogleSheetName}
                  subAddActiveTab={subAddActiveTab}
                  setSubAddActiveTab={setAddSubActiveTab}
                  logs={logs}
                />
              </TabPanel>
              <TabPanel value={activeTab} index="count_scanning">
                <CountScanning
                  cartonSize={cartonSize}
                  setCartonSize={setCartonSize}
                  isEditable={isEditable}
                  setIsEditable={setIsEditable}
                  googleSheetName={googleSheetName}
                  setGoogleSheetName={setGoogleSheetName}
                  subActiveTab={subActiveTab}
                  setSubActiveTab={setSubActiveTab}
                  logs={logs}
                />
              </TabPanel>
            </>
          )}
        </motion.div>
      </AnimatePresence>
      {isLoading ? (
        <PammysLoading />
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TableContainer
              component={Paper}
              sx={{ borderRadius: '0px', boxShadow: 'none', border: '1px solid #e5e7eb' }}
            >
              <h2 className="mb-4 pl-4 pt-4 text-lg font-semibold">Logs</h2>
              <Table size="small">
                <TableHead>
                  <TableRow className="bg-gray-100">
                    <TableCell className="px-2 py-1 text-sm font-bold">Variantenname</TableCell>
                    <TableCell className="px-2 py-1 text-sm font-bold">SKU</TableCell>
                    <TableCell className="px-2 py-1 text-sm font-bold">Barcode-Nummer</TableCell>
                    <TableCell className="px-2 py-1 text-sm font-bold">Menge</TableCell>
                    <TableCell className="px-2 py-1 text-sm font-bold">Anpassungstyp</TableCell>
                    <TableCell className="px-2 py-1 text-sm font-bold">Kartoninhalt</TableCell>
                    <TableCell className="px-2 py-1 text-sm font-bold"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(activeStep === 0 ? logs : aggregatedLogs).map((item) => (
                    <motion.tr
                      key={activeStep === 0 ? `${item.id}-${item.created_at}` : item.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm hover:bg-gray-50"
                    >
                      <TableCell sx={{ py: 1, px: 2 }}>{item.variant_name}</TableCell>
                      <TableCell sx={{ py: 1, px: 2 }}>{item.sku}</TableCell>
                      <TableCell sx={{ py: 1, px: 2 }}>{item.barcode_number}</TableCell>
                      <TableCell sx={{ py: 1, px: 2 }}>{item.quantity}</TableCell>
                      <TableCell sx={{ py: 1, px: 2 }}>{item.adjustment_type}</TableCell>
                      <TableCell sx={{ py: 1, px: 2 }}>{item.carton_size}</TableCell>
                      {activeStep === 0 && (
                        <TableCell sx={{ py: 1, px: 2 }}>
                          <Button
                            variant="text"
                            color="error"
                            onClick={() => handleRemoveLog(item.id, item.created_at)}
                          >
                            X
                          </Button>
                        </TableCell>
                      )}
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </motion.div>
        </AnimatePresence>
      )}
      <AnimatePresence>
        {activeStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 2,
                backgroundColor: 'white',
                borderRadius: '0px',
                boxShadow: 'none',
                border: '1px solid #e5e7eb',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  borderBottom: '2px solid #e0e0e0',
                  pb: 1,
                  color: 'text.primary',
                }}
              >
                Zusammenfassung
              </Typography>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      Anzahl der Boxen
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>{totalQuantity}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      Anzahl der Artikel pro Karton
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>{totalCartonSize}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      Google-Tabellenname
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary', wordBreak: 'break-word' }}>
                      {googleSheetName || '-'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-end gap-2 border bg-white p-4">
        {activeStep > 0 && (
          <Button size="small" onClick={handleBack} disabled={handleSubmitLoading}>
            Zurück
          </Button>
        )}
        {activeStep === steps.length - 1 ? (
          <Button
            size="small"
            onClick={handleSubmit}
            disabled={!isScanComplete || !googleSheetName}
          >
            Abschicken
          </Button>
        ) : (
          <Button size="small" onClick={handleNext} disabled={!isScanComplete || !googleSheetName}>
            Weiter
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardAddStockUIPage;
