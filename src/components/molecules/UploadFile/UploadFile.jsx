import { useDropzone } from 'react-dropzone';
import { convertFileToBase64 } from '../../../utils';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';

export const UploadFile = ({ file, setFile }) => {
  const handleDelete = () => {
    setFile('');
  };
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFile) => {
      const base64Data = await convertFileToBase64(acceptedFile[0]);
      setFile(base64Data);
    },
    disabled: !!file,
    accept: '.pdf',
  });

  return (
    <div
      {...getRootProps({
        className: 'dropzone  flex justify-center items-center disabled',
      })}
    >
      <input {...getInputProps()} accept=".pdf" />
      {!file ? (
        <div className="mr-2 flex flex-col items-center ">
          <FileUploadIcon className="cursor-pointer" />
        </div>
      ) : (
        <div className="uploaded-file flex items-center ">
          <div className="file-name">{acceptedFiles[0].name}</div>
          <DeleteIcon className="file-icon cursor-pointer" onClick={handleDelete} />
        </div>
      )}
    </div>
  );
};
