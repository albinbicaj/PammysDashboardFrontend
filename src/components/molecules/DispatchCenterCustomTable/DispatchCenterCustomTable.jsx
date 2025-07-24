import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from '@mui/material';
import React, { useState } from 'react';
import { Img } from 'react-image';
import { PammysLoading } from '../../atoms/PammysLoading/PammysLoading';
import PermissionCheck from '../PermissionCheck/PermissionCheck';
import { RoleEnum } from '../../../enums/Role.enum';

export const DispatchCenterCustomTable = ({
  data,
  handleBarcodeScan,
  loadingTable,
  handleBarcodeUnscan,
  loadingFullTable,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');

  const handleImageClick = async (img) => {
    try {
      if (img) {
        setModalImageSrc(img);
        setModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#f3f4f6',
      color: theme.palette.common.black,
      paddingTop: '0',
      paddingBottom: '0',
      textAlign: 'left',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const hasUnscannedItems = data?.order_line_items?.some((item) => item.is_scanned === 0);
  const hasUnscannedItems1 = data?.order_line_items?.some((item) => item.is_scanned === 1);

  // rgnpcrz
  //
  // Filter items that still need to be scanned
  const waitingToBeScanned = data?.order_line_items?.filter(
    (item) => item?.scanned_quantity < item?.quantity,
  );

  // Filter items that have been fully scanned
  const scannedItems = data?.order_line_items?.filter((item) => item?.scanned_quantity > 0);
  //

  // Check if there are items
  const hasItems = data?.order_line_items?.length > 0;
  const hasItems1 = data?.order_line_items?.length > 0;

  return (
    <>
      <>
        {hasItems && hasUnscannedItems && (
          <TableContainer component={Paper} className="mt-0">
            <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
              <TableHead>
                <TableRow sx={{ height: '70px' }}>
                  <StyledTableCell className="custom-header">
                    <div className="flex flex-col">
                      <span className="text-xs12 font-bold text-black">Bild</span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell className="custom-header">
                    <div className="flex flex-col">
                      <span className="text-xs12 font-bold text-black">Produkt</span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell className="custom-header">
                    <div className="flex flex-col">
                      <span className="text-xs12 font-bold text-black">Barcode</span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell className="custom-header">
                    <div className="flex flex-col">
                      <span className="text-xs12 font-bold text-black">Menge</span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell className="custom-header">
                    <div className="flex flex-col">
                      <span className="text-xs12 font-bold text-black">Status</span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: '80px' }} className="custom-header">
                    <div className="flex flex-col">
                      <span className="text-xs12 font-bold text-black">Aktion</span>
                    </div>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingTable ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div
                        className={`${loadingFullTable && 'absolute bottom-0 left-0 right-0 top-0 z-[1] h-full bg-white bg-opacity-50'}  flex h-16 items-center justify-center`}
                      >
                        {' '}
                        <PammysLoading />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {data?.order_line_items?.map((item) => {
                      {
                        return (
                          item.is_scanned == 0 && (
                            <TableRow key={item?.id}>
                              <TableCell>
                                {item?.image ? (
                                  <Img
                                    width="80px"
                                    src={item?.image}
                                    onClick={() => handleImageClick(item?.image)}
                                    style={{ cursor: 'pointer' }}
                                  />
                                ) : (
                                  <Typography variant="p" component="p">
                                    Kein Bild gefunden
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <Typography variant="p" component="p">
                                  {item?.item}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="p" component="p">
                                  {item?.barcode}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="span">{item?.quantity}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="span">
                                  <Chip
                                    label={item?.is_scanned === 0 ? 'Nicht gescannt' : 'Gescannt'}
                                    color={item?.is_scanned === 0 ? 'error' : 'success'}
                                  />
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <PermissionCheck
                                  roles={[
                                    RoleEnum.ADMIN,
                                    RoleEnum.PICK,
                                    RoleEnum.WAREHOUSE_EMPLOYEE,
                                  ]}
                                >
                                  {item?.is_scanned === 0 && (
                                    <button
                                      className="cursor-pointer bg-button p-2 text-black"
                                      onClick={() => handleBarcodeScan(item?.barcode)}
                                    >
                                      <Typography
                                        variant="span"
                                        style={{
                                          color: item?.is_scanned === 0 ? 'black' : 'black',
                                        }}
                                      >
                                        Verpackt
                                      </Typography>
                                    </button>
                                  )}
                                  {item?.is_scanned === 1 && (
                                    <button
                                      className="cursor-pointer bg-button p-2 text-black"
                                      onClick={() => handleBarcodeUnscan(item?.barcode)}
                                    >
                                      <Typography
                                        variant="span"
                                        style={{
                                          color: item?.is_scanned === 1 ? 'black' : 'black',
                                        }}
                                      >
                                        Auspacken
                                      </Typography>
                                    </button>
                                  )}
                                </PermissionCheck>
                              </TableCell>
                            </TableRow>
                          )
                        );
                      }
                    })}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {hasUnscannedItems && hasUnscannedItems1 && (
          <div style={{ marginTop: '100px' }}>
            <Typography variant="p" component="p" fontWeight="bold" sx={{ marginBottom: '10px' }}>
              Erfüllt
            </Typography>
          </div>
        )}

        {hasItems1 && hasUnscannedItems1 && (
          <TableContainer component={Paper} className="mt-0">
            <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
              <TableHead>
                <TableRow sx={{ height: '70px' }}>
                  <StyledTableCell className="custom-header">
                    <div className="flex flex-col">
                      <span className="text-xs12 font-bold text-black">Bild</span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell className="custom-header">
                    <div className="flex flex-col">
                      <span className="text-xs12 font-bold text-black">Produkt</span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell className="custom-header">
                    <div className="flex flex-col">
                      <span className="text-xs12 font-bold text-black">Barcode</span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell className="custom-header">
                    <div className="flex flex-col">
                      <span className="text-xs12 font-bold text-black">Menge</span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell className="custom-header">
                    <div className="flex flex-col">
                      <span className="text-xs12 font-bold text-black">Status</span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: '80px' }} className="custom-header">
                    <div className="flex flex-col">
                      <span className="text-xs12 font-bold text-black">Aktion</span>
                    </div>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingTable ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div
                        className={`${loadingFullTable && 'absolute bottom-0 left-0 right-0 top-0 z-[1] h-full bg-white bg-opacity-50'}  flex h-16 items-center justify-center`}
                      >
                        {' '}
                        <PammysLoading />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {data?.order_line_items?.map((item) => {
                      {
                        return (
                          item.is_scanned == 1 && (
                            <TableRow key={item?.id}>
                              <TableCell>
                                {item?.image ? (
                                  <Img
                                    width="80px"
                                    src={item?.image}
                                    onClick={() => handleImageClick(item?.image)}
                                    style={{ cursor: 'pointer' }}
                                  />
                                ) : (
                                  <Typography variant="p" component="p">
                                    Kein Bild gefunden
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <Typography variant="p" component="p">
                                  {item?.item}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="p" component="p">
                                  {item?.barcode}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="span">{item?.quantity}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="span">
                                  <Chip
                                    label={item?.is_scanned === 0 ? 'Nicht gescannt' : 'Gescannt'}
                                    color={item?.is_scanned === 0 ? 'error' : 'success'}
                                  />
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {' '}
                                <PermissionCheck
                                  roles={[
                                    RoleEnum.ADMIN,
                                    RoleEnum.PICK,
                                    RoleEnum.WAREHOUSE_EMPLOYEE,
                                  ]}
                                >
                                  {item?.is_scanned === 0 && (
                                    <button
                                      className="cursor-pointer bg-button p-2 text-black"
                                      onClick={() => handleBarcodeScan(item?.barcode)}
                                    >
                                      <Typography
                                        variant="span"
                                        style={{
                                          color: item?.is_scanned === 0 ? 'black' : 'black',
                                        }}
                                      >
                                        Verpackt
                                      </Typography>
                                    </button>
                                  )}
                                  {item?.is_scanned === 1 && (
                                    <button
                                      className="cursor-pointer bg-button p-2 text-black"
                                      onClick={() => handleBarcodeUnscan(item?.barcode)}
                                    >
                                      <Typography
                                        variant="span"
                                        style={{
                                          color: item?.is_scanned === 1 ? 'black' : 'black',
                                        }}
                                      >
                                        Auspacken
                                      </Typography>
                                    </button>
                                  )}
                                </PermissionCheck>
                              </TableCell>
                            </TableRow>
                          )
                        );
                      }
                    })}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {(!hasItems || !hasItems1) && (
          <TableContainer component={Paper} className="mt-0">
            <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
              <TableRow className="">
                <TableCell colSpan={6}>
                  <div className="flex h-16 items-center justify-center">
                    <Typography variant="body2" align="center" padding={2}>
                      Keine Daten verfügbar
                    </Typography>
                  </div>
                </TableCell>
              </TableRow>
            </Table>
          </TableContainer>
        )}

        {modalOpen && (
          <div
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: '9999',
            }}
            onClick={() => setModalOpen(false)}
          >
            <Img
              src={modalImageSrc}
              alt="Modales Bild"
              style={{
                maxWidth: '80%',
                maxHeight: '80%',
              }}
            />
          </div>
        )}
      </>
    </>
  );
};
