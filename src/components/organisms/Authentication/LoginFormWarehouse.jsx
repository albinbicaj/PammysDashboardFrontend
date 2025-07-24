import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../../context/Auth.context';
import { BrowserQRCodeReader } from '@zxing/library';
import toast from 'react-simple-toasts';
import { PammysLoading } from '../../atoms/PammysLoading/PammysLoading';
import {
  IconAlertTriangle,
  IconBorderCorners,
  IconCircleCheck,
  IconLoader2,
  IconQrcode,
} from '@tabler/icons-react';
import { t } from 'i18next';
import { Link } from 'react-router-dom';

const buttons = [
  { roleId: 6, text: 'Packer' },
  { roleId: 7, text: 'Retoure' },
];

export const LoginFormWarehouse = () => {
  const { login, loginWithQRCode } = useAuthContext();
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState(1);
  const roleIdRef = useRef(null);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null); // Reference to the video element
  const codeReader = useRef(new BrowserQRCodeReader()); // Keep scanner instance persistent
  const lastScanned = useRef(''); // Store last detected QR code
  const lastDetectedTime = useRef(null); // Track last QR code appearance
  const qrStillPresent = useRef(false); // Flag to check if QR is still in the frame

  useEffect(() => {
    let isMounted = true;
    let scanTimeout;

    const startScanner = async () => {
      try {
        const videoInputDevices = await codeReader.current.getVideoInputDevices();
        if (videoInputDevices.length > 0 && videoRef.current) {
          await codeReader.current.decodeFromVideoDevice(
            videoInputDevices[0].deviceId,
            videoRef.current,
            async (result, err) => {
              if (!isMounted) return;

              if (result) {
                const scannedText = result.text;

                // If QR is already scanned, do nothing until it disappears
                if (qrStillPresent.current) return;

                // Store the detected time and mark QR as present
                qrStillPresent.current = true;
                lastDetectedTime.current = Date.now();

                // Process login only if it's a new QR code
                if (scannedText !== lastScanned.current) {
                  lastScanned.current = scannedText;

                  try {
                    const { t } = JSON.parse(scannedText);
                    if (t) {
                      const taskPromise = loginWithQRCode(t, roleIdRef.current);

                      const taskToast = toast(
                        <div>
                          <div
                            className=" flex h-screen w-screen flex-col items-center justify-center  bg-red-300 text-white"
                            style={{ backgroundColor: 'green' }}
                          >
                            <div className="flex flex-row items-center gap-5">
                              <div className="animate-spin">
                                <IconLoader2 />
                              </div>
                              <div>
                                <p className="text-xl font-bold">QR Code Scanned</p>
                                <p>Logging in to system</p>
                              </div>
                            </div>
                          </div>
                        </div>,
                        {
                          duration: Infinity,
                          // loading: taskPromise,
                          clickClosable: false,
                          position: 'center',
                        },
                      );

                      taskPromise
                        .then((message) => {
                          taskToast.update({
                            message: (
                              <div>
                                <div
                                  className=" flex h-screen w-screen flex-col items-center justify-center  bg-red-300 text-white"
                                  style={{ backgroundColor: 'green' }}
                                >
                                  <div className="flex flex-row items-center gap-5">
                                    <div className="">
                                      <IconCircleCheck />
                                    </div>
                                    <div>
                                      <p className="text-xl font-bold">QR Code Scanned</p>
                                      <p>{message}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ),
                            duration: 500,
                            // theme: 'success',
                          });
                        })
                        .catch((error) => {
                          taskToast.update({
                            message: (
                              <div>
                                <div
                                  className=" flex h-screen w-screen flex-col items-center justify-center  bg-red-300 text-white"
                                  style={{ backgroundColor: 'red' }}
                                >
                                  <div className="flex flex-row items-center gap-5">
                                    <div className="">
                                      <IconAlertTriangle />
                                    </div>
                                    <div>
                                      <p className="text-xl font-bold">Something went wrong.</p>
                                      <p>{error || 'Error'}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ),
                            duration: 2000,
                            theme: 'failure',
                          });
                        });
                    }
                  } catch (error) {
                    console.error('Invalid QR code format', error);
                  }
                }

                // Clear previous timeout and restart it to detect disappearance
                clearTimeout(scanTimeout);
                scanTimeout = setTimeout(() => {
                  qrStillPresent.current = false; // Mark QR as gone
                  lastScanned.current = ''; // Reset scanned QR
                }, 2000); // QR must disappear for 2 seconds before scanning again
              }

              if (err) {
                // console.warn('QR scan error:', err);
              }
            },
          );
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      codeReader.current.reset(); // Stop camera feed when component unmounts
      clearTimeout(scanTimeout);
    };
  }, []);

  //
  //

  const handleRoleId = (roleId) => {
    setRoleId(roleId);
    roleIdRef.current = roleId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password, roleId);
    setIsLoading(false);
  };

  return (
    <div className=" flex h-screen items-center">
      <div className="grid w-full md:grid-cols-2">
        <div>
          <p className=" text-center text-2xl font-semibold">Scan your QR code</p>
        </div>
        <div>
          <p className=" text-center text-2xl font-semibold">
            Enter your credentials
            {/* {t('login-to-pummys')} */}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 p-4 ">
          <div>
            <div className=" relative h-14 w-14 ">
              <div className="absolute bottom-0 left-0 right-0 top-0 flex  items-center justify-center">
                <IconBorderCorners stroke={1} size={50} />
              </div>
              <div className="flex h-full w-full items-center justify-center">
                <IconQrcode size={24} />
              </div>
            </div>
          </div>
          <div className="relative flex h-64 w-64 items-center justify-center rounded-3xl bg-gray-300">
            <video ref={videoRef} className="w-ful h-full  -scale-x-100 rounded-3xl object-cover" />
            <div className="just absolute bottom-0 left-0 right-0 top-0 flex">
              <div className="  flex flex-1 animate-grow flex-col justify-between p-5 duration-150">
                <div className=" flex justify-between ">
                  <div className="h-12 w-12 rounded-tl-2xl border-l-2 border-t-2 border-accent "></div>
                  <div className="h-12 w-12 rotate-90 rounded-tl-2xl border-l-2 border-t-2 border-accent "></div>
                </div>
                <div className=" flex justify-between">
                  <div className="h-12 w-12 -rotate-90 rounded-tl-2xl border-l-2 border-t-2 border-accent "></div>
                  <div className="h-12 w-12 rotate-180 rounded-tl-2xl border-l-2 border-t-2 border-accent "></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex flex-col items-center justify-center gap-4 border-t-2 p-4 md:border-l-2 md:border-t-0  ">
          <div className=" flex w-80 flex-col justify-center gap-7">
            <div className="flex justify-center gap-3">
              {buttons.map((item, index) => (
                <button
                  key={`skHfqpIUydfg${index}`}
                  onClick={() => handleRoleId(item.roleId)}
                  className={`${item.roleId == roleId ? 'bg-accent ' : '100 text-gray-400'} rounded-md border px-2 py-1  text-xs font-semibold  duration-150`}
                >
                  {item.text}
                </button>
              ))}
              <div className="transfrom-[1.2] hidden bg-green-100 bg-green-500 bg-red-100 bg-red-500"></div>
            </div>
            <form className="flex  flex-col items-center justify-center gap-5">
              <div className=" flex w-full flex-col gap-3">
                <input
                  required
                  id="input-email"
                  // className="input-email py-7px focus:border-blue-675 box-border border bg-white px-4 focus:border focus:outline-none"
                  className="input-login"
                  autoComplete="email"
                  placeholder="Email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  id="password"
                  type="password"
                  className="input-login"
                  autoComplete="current-password"
                  placeholder="Passwort"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary w-full"
                onClick={handleSubmit}
                disabled={isLoading} // Disable button when loading
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <Link to="/dashboard/login" className="text-center text-sm text-slate-400 underline">
              Login as Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="flex h-screen w-full items-center justify-center bg-gray-100 p-4">
  //     <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-lg md:flex-row">
  //       <div className="flex w-full flex-col items-center justify-center p-8 md:w-1/2">
  //         <div className="mb-4 text-lg font-semibold">Enter your credentials</div>
  //         <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
  //           <input
  //             required
  //             name="email"
  //             className="input-login w-full"
  //             autoComplete="email"
  //             placeholder="Email"
  //             type="email"
  //             onChange={(e) => setEmail(e.target.value)}
  //           />
  //           <input
  //             required
  //             name="password"
  //             className="input-login w-full"
  //             autoComplete="password"
  //             placeholder="Password"
  //             type="password"
  //             onChange={(e) => setPassword(e.target.value)}
  //           />
  //           <button className="btn btn-primary w-full" type="submit" disabled={isLoading}>
  //             {isLoading ? 'Logging in...' : 'Login'}
  //           </button>
  //         </form>
  //       </div>
  //       <div className="hidden w-[1px] bg-gray-300 md:block"></div>
  //       <div className="flex w-full flex-col items-center justify-center p-8 md:w-1/2">
  //         <div className="mb-4 text-lg font-semibold">Scan your QR code</div>
  //         <div className="flex h-64 w-64 items-center justify-center rounded-lg bg-gray-300">
  //           <video ref={videoRef} className="w-ful h-full  -scale-x-100 rounded-lg object-cover" />
  //         </div>
  //       </div>
  //     </div>
  //     <div
  //       className="border-5 fixed bottom-0 left-0 right-0 top-0 hidden h-screen w-screen border bg-red-300"
  //       style={{ backgroundColor: 'red' }}
  //     ></div>
  //     {/* {JSON.stringify(payload)} */}
  //   </div>
  // );
};
