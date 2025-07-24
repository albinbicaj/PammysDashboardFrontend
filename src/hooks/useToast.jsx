import toast from 'react-simple-toasts';
import DoneIcon from '@mui/icons-material/Done';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const showToast = (message, type = 'success', duration = 3700, maxVisibleToasts = 1) => {
  const toastClasses = {
    success: 'bg-[rgb(237,247,237)] text-[rgb(30,70,32)]',
    failure: 'bg-[rgb(253,237,237)] text-[#5f2120]',
    error: 'bg-[rgb(253,237,237)] text-[#5f2120]',
  };

  const ToastContent = (
    <div
      className={`${toastClasses[type]} relative bottom-6 flex min-h-[50px] items-center gap-1 rounded-md px-4 py-1 text-center text-base font-medium`}
    >
      {type !== 'success' ? (
        <ErrorOutlineIcon className="text-[#d74343]" />
      ) : (
        <DoneIcon className="text-[#418944]" />
      )}
      <span className="flex-1">{message}</span>
    </div>
  );

  toast(ToastContent, {
    position: 'top-center',
    duration,
    maxVisibleToasts,
    style: {
      background: 'none',
      boxShadow: 'none',
    },
  });
};

export default showToast;
