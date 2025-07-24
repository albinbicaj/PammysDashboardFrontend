import Avatar from '@mui/material/Avatar';
import ClearIcon from '@mui/icons-material/Clear';
import { grey } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
export const Comment = ({
  author,
  comment,
  createdAt,
  setShowModal,
  setCommentToDelete,
  fileURL,
}) => {
  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleDelete = () => {
    setCommentToDelete(comment);
    handleShowModal();
  };

  const greyColor = grey[500];
  return (
    <div className="flex gap-5 pl-4">
      <div className="">
        <Avatar style={{ width: 40, height: 40, fontSize: '16px', backgroundColor: '#ffcc66' }}>
          {author?.charAt(0) || 'A'}
        </Avatar>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-start gap-5">
          <span className="font-bold">{author || 'NULL'}</span>
          <span className="">{createdAt}</span>
        </div>
        <div>{comment}</div>
        {fileURL && (
          <div>
            <a
              className="flex items-center text-blue-500"
              // to={'https://pw-backend.diesea.de/warehouse-images/' + fileURL}
              href={fileURL}
              target="_blank"
            >
              Shipping Label:
              <InsertDriveFileIcon
                sx={{
                  marginLeft: '5px',
                  fontSize: '18px',
                }}
              />
            </a>
            {/* <Link
              className="flex items-center text-blue-500"
              // to={'https://pw-backend.diesea.de/warehouse-images/' + fileURL}
              to={fileURL}
              target="_blank"
            >
              Shipping Label:
              <InsertDriveFileIcon
                sx={{
                  marginLeft: '5px',
                  fontSize: '18px',
                }}
              />
            </Link> */}
            <div className="text-xs text-gray-300">{fileURL}</div>
          </div>
        )}
      </div>
      <div className="">
        <ClearIcon style={{ color: greyColor }} onClick={handleDelete} />
      </div>
    </div>
  );
};
