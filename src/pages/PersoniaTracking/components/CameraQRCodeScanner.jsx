import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';
import { personioApiController } from '../../../api/personio';
import toast from 'react-simple-toasts';
import { IconBorderCorners, IconQrcode } from '@tabler/icons-react';
import PersonioNotifications from './PersonioNotifications';
import QRCodeNotifications from './QRCodeNotifications';
import WentWrongNotification from './WentWrongNotifications';

const buttons = [
  { type: 'startWork', text: 'Start Work', color: '#007AFF' },
  { type: 'startPause', text: 'Start Pause', color: '#FFA500' },
  { type: 'stopPause', text: 'Stop Pause', color: '#34C759' },
  { type: 'stopWork', text: 'Stop Work', color: '#0056A6' },
];

export const CameraQRCodeScanner = () => {
  const [scanType, setScanType] = useState(buttons[0].type || 'startWork');
  const scanTypeRef = useRef(buttons[0].type || 'startWork');

  const videoRef = useRef(null); // Reference to the video element
  const codeReader = useRef(new BrowserQRCodeReader()); // Keep scanner instance persistent
  const lastScanned = useRef(''); // Store last detected QR code
  const lastDetectedTime = useRef(null); // Track last QR code appearance
  const qrStillPresent = useRef(false); // Flag to check if QR is still in the frame
  const isProcessing = useRef(false); // Flag to track if a request is in progress

  const startScanner = useCallback(async () => {
    try {
      const videoInputDevices = await codeReader.current.getVideoInputDevices();
      if (videoInputDevices.length > 0 && videoRef.current) {
        await codeReader.current.decodeFromVideoDevice(
          videoInputDevices[0].deviceId,
          videoRef.current,
          async (result, err) => {
            if (result) {
              const scannedText = result.text;
              if (qrStillPresent.current || isProcessing.current) return; // Skip if QR is still present or a request is in progress
              qrStillPresent.current = true;
              lastDetectedTime.current = Date.now();

              if (scannedText !== lastScanned.current) {
                lastScanned.current = scannedText;
                isProcessing.current = true; // Set processing flag to true

                try {
                  const { t } = JSON.parse(scannedText);
                  if (t) {
                    console.log('requesting with scanType: ', scanTypeRef.current);
                    const taskPromise = personioApiController(scanTypeRef.current, t);
                    const taskToast = toast(<QRCodeNotifications type={scanTypeRef.current} />, {
                      duration: Infinity,
                      position: 'center',
                    });
                    taskPromise
                      .then((response) => {
                        taskToast.update({
                          message: (
                            <PersonioNotifications
                              response={response}
                              type={scanTypeRef.current}
                              taskToast={taskToast}
                            />
                          ),
                          duration: 3000,
                          clickClosable: true,
                        });
                      })
                      .catch((error) => {
                        switch (error) {
                          case 'Work already started':
                            handleScanType('startPause');
                            break;
                          case 'Cannot start a new break, already started.':
                            handleScanType('stopPause');
                            break;
                          case 'Cannot end the break without starting the break.':
                            handleScanType('startPause');
                            break;
                          case 'Cannot end work without starting the work.':
                            handleScanType('startWork');
                            break;
                          default:
                            console.log('skip');
                            break;
                        }
                        taskToast.update({
                          message: <WentWrongNotification error={error} taskToast={taskToast} />,
                          className: 'cursor-pointer',
                          position: 'center',
                          duration: 2000,
                          onClick: () => console.log('click working'), // Manually dismiss the toast on click
                        });
                      })
                      .finally(() => {
                        isProcessing.current = false; // Reset processing flag
                      });
                  }
                } catch (error) {
                  console.error('Invalid QR code format', error);
                  isProcessing.current = false; // Reset processing flag in case of error
                }
              }
              setTimeout(() => {
                qrStillPresent.current = false;
                lastScanned.current = '';
              }, 2000);
            }
          },
        );
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      isProcessing.current = false; // Reset processing flag in case of error
    }
  }, []);

  useEffect(() => {
    startScanner();
    return () => codeReader.current.reset();
  }, [startScanner]);

  // useEffect(() => {
  //   console.log('SCAN TYPE CHANGED: ', scanType);
  //   scanTypeRef.current = scanType;
  // }, [scanType]);

  const handleScanType = (scanType) => {
    // No Need for this comented code, it is an example for safety
    // if (['startWork', 'startPause', 'stopPause', 'stopWork'].includes(scanType)) {
    //   setScanType(scanType);
    //   scanTypeRef.current = scanType;
    // } else {
    //   console.log('Unrecognized scanType: ', scanType);
    // }
    setScanType(scanType);
    scanTypeRef.current = scanType;
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white p-4">
      <div className="fixed left-0 right-0 top-0 flex items-center justify-between px-12 py-8">
        <img className="w-36 bg-cover" src="/images/new/logo-new.svg" alt="Pammy's Logo." />
        <img className="w-24 bg-cover" src="/images/personio_logo.png" alt="Personio's Logo." />
      </div>
      <div className=" rounded-lg   p-4 ">
        <div className="p-4">
          <div className="grid grid-cols-4 gap-5">
            {buttons.map((item, index) => (
              <button
                key={`nndflisokiauwg${index}`}
                onClick={() => handleScanType(item.type)}
                style={item.type == scanType ? { backgroundColor: `${item.color}` } : {}}
                className={`${item.type == scanType ? ' text-white' : '100 text-gray-400'} rounded-md border px-4 py-2  font-bold  duration-150`}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
        <div className="flex  flex-col overflow-hidden   md:flex-row">
          <div className="flex w-full flex-col items-center justify-center gap-4 p-8">
            <div className="text-center text-2xl font-semibold">Scan your QR code</div>
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
              <video
                ref={videoRef}
                className="w-ful h-full  -scale-x-100 rounded-3xl object-cover"
              />
              <div className="just absolute bottom-0 left-0 right-0 top-0 flex">
                <div className=" flex flex-1 animate-grow flex-col justify-between p-5">
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
        </div>
      </div>
      <div>{/* {JSON.stringify(payload)} */}</div>
    </div>
  );
};

// V2, not developed
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { BrowserQRCodeReader } from '@zxing/library';
// import { personioApiController } from '../../../api/personio';
// import toast from 'react-simple-toasts';
// import { IconBorderCorners, IconQrcode } from '@tabler/icons-react';
// import PersonioNotifications from './PersonioNotifications';
// import QRCodeNotifications from './QRCodeNotifications';
// import WentWrongNotification from './WentWrongNotifications';

// const buttons = [
//   { type: 'startWork', text: 'Start Work', color: '#007AFF' },
//   { type: 'startPause', text: 'Start Pause', color: '#FFA500' },
//   { type: 'stopPause', text: 'Stop Pause', color: '#34C759' },
//   { type: 'stopWork', text: 'Stop Work', color: '#0056A6' },
// ];

// export const CameraQRCodeScanner = () => {
//   const [scanType, setScanType] = useState(buttons[0].type || 'startWork');
//   const videoRef = useRef(null); // Reference to the video element
//   const codeReader = useRef(new BrowserQRCodeReader()); // Keep scanner instance persistent
//   const lastScanned = useRef(''); // Store last detected QR code
//   const lastDetectedTime = useRef(null); // Track last QR code appearance
//   const qrStillPresent = useRef(false); // Flag to check if QR is still in the frame

//   const startScanner = useCallback(
//     async (isMounted) => {
//       let scanTimeout;
//       try {
//         const videoInputDevices = await codeReader.current.getVideoInputDevices();
//         if (videoInputDevices.length > 0 && videoRef.current) {
//           await codeReader.current.decodeFromVideoDevice(
//             videoInputDevices[0].deviceId,
//             videoRef.current,
//             async (result, err) => {
//               if (!isMounted) return;
//               if (result) {
//                 const scannedText = result.text;
//                 // If QR is already scanned, do nothing until it disappears
//                 if (qrStillPresent.current) return;
//                 // Store the detected time and mark QR as present
//                 qrStillPresent.current = true;
//                 lastDetectedTime.current = Date.now();
//                 // Process login only if it's a new QR code
//                 if (scannedText !== lastScanned.current) {
//                   lastScanned.current = scannedText;
//                   try {
//                     const { t } = JSON.parse(scannedText);
//                     if (t) {
//                       const taskPromise = personioApiController(scanType, t);
//                       const taskToast = toast(<QRCodeNotifications type={scanType} />, {
//                         duration: Infinity,
//                         position: 'center',
//                       });
//                       taskPromise
//                         .then((response) => {
//                           console.log(response);
//                           taskToast.update({
//                             message: <PersonioNotifications response={response} type={scanType} />,
//                             duration: 3000,
//                             clickClosable: true,
//                           });
//                         })
//                         .catch((error) => {
//                           console.log('something went wrong');
//                           console.log(error);
//                           taskToast.update({
//                             message: <WentWrongNotification error={error} />,
//                             duration: 3000,
//                             clickClosable: true,
//                           });
//                         });
//                     }
//                   } catch (error) {
//                     console.error('Invalid QR code format', error);
//                   }
//                 }
//                 // Clear previous timeout and restart it to detect disappearance
//                 clearTimeout(scanTimeout);
//                 scanTimeout = setTimeout(() => {
//                   qrStillPresent.current = false; // Mark QR as gone
//                   lastScanned.current = ''; // Reset scanned QR
//                 }, 2000); // QR must disappear for 2 seconds before scanning again
//               }
//               if (err) {
//                 console.warn('QR scan error:', err);
//               }
//             },
//           );
//         }
//       } catch (err) {
//         console.error('Error accessing camera:', err);
//       }
//     },
//     [scanType],
//   );

//   useEffect(() => {
//     let isMounted = true;
//     startScanner(isMounted);
//     return () => {
//       isMounted = false;
//       codeReader.current.reset(); // Stop camera feed when component unmounts
//     };
//   }, [scanType, startScanner]);

//   return (
//     <div className="flex h-screen w-full flex-col items-center justify-center bg-white p-4">
//       <div className="fixed left-0 right-0 top-0 flex items-center justify-between px-12 py-8">
//         <img className="w-36 bg-cover" src="/images/new/3.svg" alt="Pummy's Logo." />
//         <img className="w-24 bg-cover" src="/images/personio_logo.png" alt="Personio's Logo." />
//       </div>
//       <div className=" rounded-lg   p-4 ">
//         <div className="p-4">
//           <div className="grid grid-cols-4 gap-5">
//             {buttons.map((item, index) => (
//               <button
//                 key={`nndflisokiauwg${index}`}
//                 onClick={() => setScanType(item.type)}
//                 style={item.type == scanType ? { backgroundColor: `${item.color}` } : {}}
//                 className={`${item.type == scanType ? ' text-white' : '100 text-gray-400'} rounded-md border px-4 py-2  font-bold  duration-150`}
//               >
//                 {item.text}
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="flex  flex-col overflow-hidden   md:flex-row">
//           <div className="flex w-full flex-col items-center justify-center gap-4 p-8">
//             <div className="text-center text-2xl font-semibold">Scan your QR code</div>
//             <div>
//               <div className=" relative h-14 w-14 ">
//                 <div className="absolute bottom-0 left-0 right-0 top-0 flex  items-center justify-center">
//                   <IconBorderCorners stroke={1} size={50} />
//                 </div>
//                 <div className="flex h-full w-full items-center justify-center">
//                   <IconQrcode size={24} />
//                 </div>
//               </div>
//             </div>
//             <div className="relative flex h-64 w-64 items-center justify-center rounded-3xl bg-gray-300">
//               <video
//                 ref={videoRef}
//                 className="w-ful h-full  -scale-x-100 rounded-3xl object-cover"
//               />
//               <div className="just absolute bottom-0 left-0 right-0 top-0 flex">
//                 <div className=" flex flex-1 animate-grow flex-col justify-between p-5">
//                   <div className=" flex justify-between ">
//                     <div className="h-12 w-12 rounded-tl-2xl border-l-2 border-t-2 border-accent "></div>
//                     <div className="h-12 w-12 rotate-90 rounded-tl-2xl border-l-2 border-t-2 border-accent "></div>
//                   </div>
//                   <div className=" flex justify-between">
//                     <div className="h-12 w-12 -rotate-90 rounded-tl-2xl border-l-2 border-t-2 border-accent "></div>
//                     <div className="h-12 w-12 rotate-180 rounded-tl-2xl border-l-2 border-t-2 border-accent "></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* {JSON.stringify(payload)} */}
//     </div>
//   );
// };
