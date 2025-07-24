import dayjs from 'dayjs';

export const downloadBase64PDF = (pdf, filename = 'document') => {
  try {
    if (!pdf) throw new Error('Invalid PDF data');

    // Extract Base64 content if prefixed
    const base64String = pdf.startsWith('data:application/pdf;base64,') ? pdf.split(',')[1] : pdf;

    // Convert Base64 to a Blob
    const byteArray = Uint8Array.from(atob(base64String), (char) => char.charCodeAt(0));
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Generate timestamp
    const timestamp = dayjs().format('YYYY-MM-DD_HH-mm');

    // Construct filename with timestamp
    const finalFilename = `${filename}_${timestamp}.pdf`;

    // Create a hidden download link
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
  }
};
