import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PermissionCheck from '../../../components/molecules/PermissionCheck/PermissionCheck';
import { RoleEnum } from '../../../enums/Role.enum';
import { PammysLoading } from '../../../components/atoms/PammysLoading/PammysLoading';

export const OrderInformation = ({
  order = [],
  setShowModal,
  getNextOrder,
  id,
  showRequestButton,
  handleResolveProblem,
  resolveProblemLoading,
}) => {
  const navigate = useNavigate();
  console.log(order?.order, 'order');
  const handlePDFDownload2 = async (pdf, redirect = false) => {
    // Opens the PDF in a new browser tab or window using window.open().
    // This relies on the browser's built-in PDF viewer and does not involve DOM manipulation for embedding.
    try {
      const base64String = pdf;
      const base64StringSplit = base64String?.split(',')[1];

      const byteCharacters = atob(base64StringSplit);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.onload = () => {
          newWindow.focus();
        };

        newWindow.onunload = () => {
          URL.revokeObjectURL(url);
          if (redirect) {
            const nextOrder = getNextOrder(parseInt(id));
            if (nextOrder) {
              navigate(`/dashboard/dispatch-center/${nextOrder.order_no}`);
            } else {
              navigate('/dashboard/dispatch-center');
            }
          }
        };
      } else {
        throw new Error('Failed to open new window');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <>
      <div>
        <div className="flex gap-2 pb-2">
          <h1 className="text-4xl font-bold">Kiste:</h1>
          <strong className="text-4xl font-bold">{order?.dispatch_center?.kiste_number}</strong>
        </div>
      </div>
      <div className="mb-7 flex justify-between gap-3">
        <div className="flex">
          <button
            onClick={() => {
              navigate('/dashboard/dispatch-center/');
            }}
            className="focus:border-blue-625 focus:shadow-btn_blue focus:border-blue-625 mr-3 box-border border-2 border-gray-300 bg-gray-200 px-4 py-2 text-xs font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none"
          >
            Zurück
          </button>
        </div>
        <div className="flex flex-1 justify-between border-2 bg-white p-4">
          <div className="flex w-full flex-wrap items-start gap-12">
            <p variant="p" component="p">
              Bestellung:{' '}
              <Link
                className="font-bold"
                target="_blank"
                to={`https://admin.shopify.com/store/pummmys/orders/${order?.order?.shopify_order_id}`}
              >
                {order?.order?.order_name}
              </Link>
            </p>
            <p variant="p" component="p">
              Kunde: <span className="font-bold">{order?.order?.costumer}</span>
            </p>
            <p variant="p" component="p">
              Adresse:{' '}
              <span className="font-bold">
                {`${order?.order?.shipping_address_address1} ${order?.order?.shipping_address_address2}, ${order?.order?.shipping_address_zip} ${order?.order?.shipping_address_city}, ${order?.order?.shipping_address_country}`}
              </span>
            </p>
            {order?.order?.tracking_number && order?.order?.status == 'completed' && (
              <p variant="p" component="div">
                Versandetikett:{' '}
                <span
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => {
                    if (order?.order?.shipping_label_download_url) {
                      handlePDFDownload2(order?.order?.shipping_label_download_url, false);
                    }
                  }}
                >
                  {order?.order?.tracking_number}
                </span>
              </p>
            )}
            {order?.order?.pdf_customs_url && (
              <p variant="p" component="div">
                Zoll:{' '}
                <span
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => {
                    if (order?.order?.pdf_customs_url) {
                      handlePDFDownload2(order?.order?.pdf_customs_url, false);
                    }
                  }}
                >
                  Customs PDF
                </span>
              </p>
            )}
          </div>
        </div>
        {order?.dispatch_center?.report_problem === null && (
          <div className="flex ">
            <button
              className="bg-accent px-4 py-2 text-sm font-semibold"
              onClick={() => setShowModal(true)}
            >
              Report Problem
            </button>
          </div>
        )}
        {order?.dispatch_center?.report_problem !== null && !showRequestButton && (
          <div className="focus:border-blue-625 focus:shadow-btn_blue  focus:border-blue-625 mr-3 box-border   border-2 border-gray-300 bg-gray-200 px-4 py-2  text-xs font-semibold leading-5 text-gray-900 hover:border-gray-400 focus:outline-none">
            <div className="font-bold">Reported problem:</div>
            <div className="flex ">{order?.dispatch_center?.report_problem}</div>
            <PermissionCheck roles={[RoleEnum.ADMIN, RoleEnum.WAREHOUSE_EMPLOYEE]}>
              <button
                className="mt-2 bg-accent px-4 py-2 text-sm font-semibold"
                onClick={() => handleResolveProblem(order?.order?.id)} // Call the function here
              >
                {resolveProblemLoading ? <PammysLoading height={5} width={5} /> : 'Resolve Problem'}
              </button>
            </PermissionCheck>
          </div>
        )}
      </div>
      {order?.order?.status == 'completed' && order?.order?.tracking_number ? (
        <div className="mb-7 flex gap-3 bg-[#2e7d32] p-3 text-[#fff]">
          <svg
            className="h-[24px] w-[24px]"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 50 50"
          >
            <path
              d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"
              fill="white"
            ></path>
          </svg>{' '}
          Dieser Auftrag ist bereits erfüllt
        </div>
      ) : null}
    </>
  );
};
