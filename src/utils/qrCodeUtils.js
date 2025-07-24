import QRCode from 'qrcode';
import axiosInstance from './axios';
import showToast from '../hooks/useToast';

export const generateQRCode = async (data, firstName, lastName) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data);

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const textHeight = 50;
        canvas.width = img.width;
        canvas.height = img.height + textHeight;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0);

        ctx.font = '16px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';

        ctx.fillText(`${firstName} ${lastName}`, canvas.width / 2, img.height + textHeight / 2 + 5);

        resolve(canvas.toDataURL());
      };

      img.src = qrCodeDataUrl;
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return null;
  }
};

export const downloadQRCode = (qrCodeDataUrl, filename = 'qrcode.png') => {
  if (!qrCodeDataUrl) {
    console.error('No QR code data available for download.');
    return;
  }
  const link = document.createElement('a');
  link.href = qrCodeDataUrl;
  link.download = filename;
  link.click();
};

export const handleGenerateQRCode = async (
  userId,
  filename = 'qrcode.png',
  firstName,
  lastName,
) => {
  try {
    showToast('Requesting QR code', 'success');

    const response = await axiosInstance.get(`/qr-code/${userId}`);
    if (response.status === 200) {
      showToast('QR code generated successfully', 'success');

      const dataToEncode = JSON.stringify(response.data);
      const qrCodeDataUrl = await generateQRCode(dataToEncode, firstName, lastName);

      downloadQRCode(qrCodeDataUrl, filename);
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    showToast('An error occurred while generating the QR code', 'failure');
  }
};
