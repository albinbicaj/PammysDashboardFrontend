import { UploadFile } from '../../molecules';

export const AddComment = ({ comment, setComment, submitComment, file, setFile }) => {
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  const handleClick = () => {
    submitComment();
  };
  const handleFileChange = (file) => {
    setFile(file);
  };
  return (
    <div className="mb-12  flex items-center justify-between border-2 p-2">
      <input
        type="text"
        value={comment}
        className="add-comment-input h-10"
        placeholder="Kommentar hinterlassen..."
        onChange={handleCommentChange}
      />
      <div className="flex items-center">
        <UploadFile file={file} setFile={handleFileChange} />
        <button
          className={`ml-4 bg-accent px-4 py-2 ${comment.length < 0 ? 'disabled' : ''}`}
          onClick={handleClick}
          disabled={comment.length == 0}
        >
          Posten
        </button>
      </div>
    </div>
  );
};
