import useDocumentTitle from '../../components/useDocumentTitle';
import { CameraQRCodeScanner } from './components/CameraQRCodeScanner';

const PersonioTracking = () => {
  useDocumentTitle('Personia QR Code Scanner');
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <CameraQRCodeScanner />
    </div>
  );
};

export default PersonioTracking;
