import { Chip } from '@mui/material';
import React, { useState } from 'react';
import { Img } from 'react-image';
import { PammysLoading } from '../../atoms/PammysLoading/PammysLoading';
import PermissionCheck from '../PermissionCheck/PermissionCheck';
import { RoleEnum } from '../../../enums/Role.enum';

export const DispatchCenterCustomTableV2 = ({
  data = {},
  handleBarcodeScan = () => {},
  loadingTable = false,
  handleBarcodeUnscan = () => {},
  loadingFullTable = false,
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

  // rgnpcrz
  //
  // Filter items that still need to be scanned
  const waitingToBeScanned = data?.order_line_items?.filter(
    (item) => item?.scanned_quantity < item?.quantity,
  );

  // Filter items that have been fully scanned
  const scannedItems = data?.order_line_items?.filter((item) => item?.scanned_quantity > 0);
  //

  return (
    <>
      <div className=" pb-12">
        <p className="border-2 border-b-0 bg-white p-4 text-xl font-bold">Warten auf Erfüllung</p>
        <div className=" relative ">
          {loadingTable ? (
            <div className=" absolute bottom-0 left-0 right-0 top-16 flex items-center justify-center bg-white/80">
              <PammysLoading />
            </div>
          ) : null}
          <table className="w-full border-collapse border-2 bg-white  text-sm">
            <thead className="border-r text-left">
              <tr className="h-16 bg-white ">
                <th className="w-[140px] border-2 px-4 ">Bild</th>
                <th className="border-2 px-4 ">Produkt</th>
                <th className="border-2 px-4 ">Barcode</th>
                <th className="border-2 px-4 text-center ">Warten</th>
                <th className="border-2 px-4 text-center ">Menge</th>
                <th className="border-2 px-4 text-center">Status</th>
                <PermissionCheck
                  roles={[RoleEnum.ADMIN, RoleEnum.PICK, RoleEnum.WAREHOUSE_EMPLOYEE]}
                >
                  <th className="border-2 px-4  text-right">Aktion</th>
                </PermissionCheck>
              </tr>
            </thead>
            <tbody>
              {waitingToBeScanned?.length === 0 ? (
                <tr className="border-b-2" key={`0ZalOR8fas`}>
                  <td colSpan={7} className="dc-td h-[80px] text-center text-xl">
                    Alle Artikel wurden dem Paket hinzugefügt
                  </td>
                </tr>
              ) : null}
              {waitingToBeScanned?.map((item, index) => {
                return (
                  <tr className="border-b-2" key={`0ZalOR8fas-${index}`}>
                    <td className="dc-td px-0">
                      {item?.image ? (
                        <div
                          className="cursor-pointer"
                          onClick={() => handleImageClick(item?.image)}
                        >
                          <img className="h-[90px] w-[140px] object-cover" src={item?.image}></img>
                        </div>
                      ) : (
                        <div className="flex h-[90px] w-[140px] items-center justify-center">
                          <p>Kein Bild gefunden</p>
                        </div>
                      )}
                    </td>
                    <td className="dc-td text-xl">{item?.item}</td>
                    <td className="dc-td text-xl">{item?.barcode}</td>
                    <td className="dc-td text-center text-xl font-semibold">
                      <span className="text-red-500">{item?.remained_quantity}</span>
                    </td>
                    <td className="dc-td text-center text-xl">{item?.quantity}</td>
                    <td className="dc-td text-center ">
                      <Chip
                        label={item?.is_scanned === 0 ? 'Nicht gescannt' : 'Gescannt'}
                        color={item?.is_scanned === 0 ? 'error' : 'success'}
                      />
                    </td>
                    <PermissionCheck
                      roles={[RoleEnum.ADMIN, RoleEnum.PICK, RoleEnum.WAREHOUSE_EMPLOYEE]}
                    >
                      <td className="dc-td text-right">
                        <button
                          className="cursor-pointer bg-button p-2 text-black"
                          onClick={() => handleBarcodeScan({ barcode: item?.barcode })}
                        >
                          Verpackt
                        </button>
                      </td>
                    </PermissionCheck>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <p className="border-2 border-b-0 bg-white p-4 text-xl font-bold">Erfüllt</p>
        <div className=" relative">
          {loadingTable ? (
            <div className=" absolute bottom-0 left-0 right-0 top-16 flex items-center justify-center bg-white/80">
              <PammysLoading />
            </div>
          ) : null}
          <table className="w-full border-collapse  border-2 bg-white  text-sm">
            <thead className="border-r  text-left">
              <tr className="h-16  ">
                <th className="w-[140px] border-2 px-4 ">Bild</th>
                <th className="border-2 px-4 ">Produkt</th>
                <th className="border-2 px-4 ">Barcode</th>
                <th className="border-2 px-4 text-center ">Gescannt</th>
                <th className="border-2 px-4 text-center ">Menge</th>
                <th className="border-2 px-4 text-center">Status</th>

                <th className="border-2 px-4  text-right">Aktion</th>
              </tr>
            </thead>

            <tbody>
              {scannedItems?.length === 0 ? (
                <tr className="border-b-2" key={`0ZalOR8fas`}>
                  <td colSpan={7} className="dc-td h-[80px] text-center text-xl">
                    Kein gescanntes Produkt
                  </td>
                </tr>
              ) : null}
              {scannedItems?.map((item, index) => {
                return (
                  <tr className="border-b-2" key={`6ef4w8fas-${index}`}>
                    <td className="dc-td px-0">
                      {item?.image ? (
                        <div
                          className="cursor-pointer"
                          onClick={() => handleImageClick(item?.image)}
                        >
                          <img className="h-[90px] w-[140px] object-cover" src={item?.image}></img>
                        </div>
                      ) : (
                        <div className="flex h-[90px] w-[140px] items-center justify-center">
                          <p>Kein Bild gefunden</p>
                        </div>
                      )}
                    </td>
                    <td className="dc-td min-w-[100px] max-w-[350px] text-xl">{item?.item}</td>
                    <td className="dc-td  text-xl">{item?.barcode}</td>
                    <td className="dc-td text-center text-xl font-semibold">
                      <span
                        className={`${item?.scanned_quantity === item?.quantity ? 'text-green-500' : 'text-blue-600'}`}
                      >
                        {item?.scanned_quantity}
                      </span>
                    </td>
                    <td className="dc-td text-center text-xl">{item?.quantity}</td>
                    <td className="dc-td text-center ">
                      <Chip
                        label={item?.scanned_quantity < item?.quantity ? 'In Arbeit' : 'Gescannt'}
                        color={item?.scanned_quantity < item?.quantity ? 'info' : 'success'}
                      />
                    </td>

                    <td className="dc-td text-right ">
                      <button
                        className="cursor-pointer bg-button p-2 text-black"
                        onClick={() => handleBarcodeUnscan(item?.barcode)}
                      >
                        Auspacken
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* <>
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

      
      </> */}
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
  );
};
