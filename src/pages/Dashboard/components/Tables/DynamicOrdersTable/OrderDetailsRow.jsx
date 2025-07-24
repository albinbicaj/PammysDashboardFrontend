import { Collapse, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import { SingleOrderPicklistButton } from '../../../../../components/atoms/SingleOrderPicklistButton/SingleOrderPicklistButton';
import dayjs from 'dayjs';

export const OrderDetailsRow = ({ row = {}, showRow = false }) => {
  return (
    <Collapse in={showRow} timeout="auto" unmountOnExit>
      <div className="flex flex-col gap-4 border-b-4 p-4">
        <div className="">
          <div className="flex w-full justify-between">
            <div>
              <p className="font-bold">Informationen für Kunden</p>
              <p>
                <span className="font-bold">Kunde:</span>
                {row?.costumer}
              </p>
              <p>
                <span className="font-bold">Adresse:</span>
                {row?.shipping_address_address1 && row?.shipping_address_address1}
                {row?.shipping_address_address2 && `, ${row?.shipping_address_address2}`}
                {row?.shipping_address_zip && `, ${row?.shipping_address_zip}`}
                {row?.shipping_address_city && ` ${row?.shipping_address_city}`}
                {row?.shipping_address_country && `, ${row?.shipping_address_country}`}{' '}
              </p>
              {row?.tracking_number && (
                <p>
                  <span className="font-bold">Versandetikett:</span>
                  <Tooltip
                    title={
                      !row?.shipping_label_download_url
                        ? 'Das Versandetikett fehlt'
                        : 'Download Versandetikett'
                    }
                    placement="top"
                    arrow
                  >
                    <span
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => {
                        handlePDFDownload(row?.shipping_label_download_url);
                      }}
                    >
                      {row?.tracking_number}
                    </span>{' '}
                  </Tooltip>
                </p>
              )}
            </div>
            <div>
              <SingleOrderPicklistButton orderNumber={row?.order_name} />
              {/* <button className="btn btn-secondary">
            Generate Singe Order Picklist {row?.order_name}
          </button> */}
            </div>
          </div>
        </div>
        {row?.order_line_items && row?.order_line_items.length > 0 && (
          <>
            <p className="font-bold">Produkt</p>
            <table className="border bg-white text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="border p-1">Artikel</th>
                  <th className="border p-1">Barcode Nummer</th>
                  <th className="border p-1">Gewicht</th>
                  <th className="border p-1">Menge</th>
                  <th className="border p-1">Vorräte auf Lager</th>
                  <th className="border p-1">Kommissionierliste Bestand</th>
                </tr>
              </thead>
              <tbody>
                {row?.order_line_items?.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-1">{item?.item}</td>
                    <td className="p-1">{item?.barcode}</td>
                    <td className="p-1">{item?.gewitch}</td>
                    <td className="p-1">{item?.quantity}</td>
                    <td className="p-1">{item.product_variant?.physical_stock || 0}</td>
                    <td className="p-1">{item.product_variant?.picklist_stock || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Picker */}
        {row?.picked_by_user && (
          <>
            <p className="font-bold">Picker</p>
            <table className="border bg-white text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="w-1/3 border p-1">Datum</th>
                  <th className="w-1/3 border p-1">Name</th>
                  <th className="w-1/3 border p-1">Nachname</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-1">{dayjs(row?.picked_on).format('DD.MM.YYYY [um] HH:mm')}</td>
                  <td className="p-1">{row?.picked_by_user?.first_name}</td>
                  <td className="p-1">{row?.picked_by_user?.last_name}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
        {/* Packer */}
        {row?.packed_by_user && (
          <>
            <p className="font-bold">Packer</p>
            <table className="border bg-white text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="w-1/4 border p-1">Datum</th>
                  <th className="w-1/4 border p-1">Name</th>
                  <th className="w-1/4 border p-1">Nachname</th>
                  <th className="w-1/4 border p-1">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-1">{dayjs(row?.packed_on).format('DD.MM.YYYY [um] HH:mm')}</td>
                  <td className="p-1">{row?.packed_by_user?.first_name}</td>
                  <td className="p-1">{row?.packed_by_user?.last_name}</td>
                  <td className="p-1">
                    {row?.packed_by_user?.deleted_at ? (
                      <span className="text-red-500">
                        Worker deleted at{' '}
                        {dayjs(row?.packed_by_user?.deleted_at).format('DD.MM.YYYY')}
                      </span>
                    ) : (
                      <span className="text-green-500">Active worker</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
        {/* Teilweise ausgewählt (Partially Picked) */}
        {row?.partially_picked_by_user && (
          <>
            <p className="font-bold">Teilweise vom Benutzer ausgewählt</p>
            <table className="border bg-white text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="w-1/3 border p-1">Datum</th>
                  <th className="w-1/3 border p-1">Name</th>
                  <th className="w-1/3 border p-1">Nachname</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-1">
                    {dayjs(row?.partially_picked_on).format('DD.MM.YYYY [um] HH:mm')}
                  </td>
                  <td className="p-1">{row?.partially_picked_by_user?.first_name}</td>
                  <td className="p-1">{row?.partially_picked_by_user?.last_name}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
        {/* Teilweise verpackt (Partially Packed) */}
        {row?.partially_packed_by_user && (
          <>
            <p className="font-bold">Teilweise vom Benutzer verpackt</p>
            <table className="border bg-white text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="w-1/3 border p-1">Datum</th>
                  <th className="w-1/3 border p-1">Name</th>
                  <th className="w-1/3 border p-1">Nachname</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-1">
                    {dayjs(row?.partially_packed_on).format('DD.MM.YYYY [um] HH:mm')}
                  </td>
                  <td className="p-1">{row?.partially_packed_by_user?.first_name}</td>
                  <td className="p-1">{row?.partially_packed_by_user?.last_name}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
        {/* {row?.picked_by_user && row?.picked_by_user.length != 0 && (
          <div className="p-1">
            <p className="font-bold">Picker</p>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <p width="33%">Datum</p>
                  <p width="33%">Name</p>
                  <p width="33%">Nachname</p>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell width="33%">
                    {dayjs(row?.picked_on).format('DD.MM.YYYY [um] HH:mm')}
                  </TableCell>
                  <TableCell width="33%">{row?.picked_by_user?.first_name}</TableCell>
                  <TableCell width="33%">{row?.picked_by_user?.last_name}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        {row?.packed_by_user && row?.packed_by_user.length != 0 && (
          <div className="p-1">
            <p className="font-bold">Packer</p>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <p width="25%">Datum</p>
                  <p width="25%">Name</p>
                  <p width="25%">Nachname</p>
                  <p width="25%">Status</p>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell width="25%">
                    {dayjs(row?.packed_on).format('DD.MM.YYYY [um] HH:mm')}
                  </TableCell>
                  <TableCell width="25%">{row?.packed_by_user?.first_name}</TableCell>
                  <TableCell width="25%">{row?.packed_by_user?.last_name}</TableCell>
                  <TableCell width="25%">
                    {row?.packed_by_user?.deleted_at ? (
                      <span className="text-red-500">
                        Worker deleted at{' '}
                        {dayjs(row?.packed_by_user?.deleted_at).format('DD.MM.YYYY')}
                      </span>
                    ) : (
                      <span className="text-green-500">Active worker</span>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        {row?.partially_picked_by_user && row?.partially_picked_by_user.length != 0 && (
          <div className="p-1">
            <p className="font-bold">Teilweise vom Benutzer ausgewählt</p>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <p width="33%">Datum</p>
                  <p width="33%">Name</p>
                  <p width="33%">Nachname</p>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell width="33%">
                    {dayjs(row?.partially_picked_on).format('DD.MM.YYYY [um] HH:mm')}
                  </TableCell>
                  <TableCell width="33%">{row?.partially_picked_by_user?.first_name}</TableCell>
                  <TableCell width="33%">{row?.partially_picked_by_user?.last_name}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        {row?.partially_packed_by_user && row?.partially_packed_by_user.length != 0 && (
          <div className="p-1">
            <p className="font-bold">Teilweise vom Benutzer verpackt</p>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <p width="33%">Datum</p>
                  <p width="33%">Name</p>
                  <p width="33%">Nachname</p>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell width="33%">
                    {dayjs(row?.partially_packed_on).format('DD.MM.YYYY [um] HH:mm')}
                  </TableCell>
                  <TableCell width="33%">{row?.partially_picked_by_user?.first_name}</TableCell>
                  <TableCell width="33%">{row?.partially_picked_by_user?.last_name}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )} */}
      </div>
    </Collapse>
  );
};
