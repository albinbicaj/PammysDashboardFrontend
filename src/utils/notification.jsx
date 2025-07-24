import toast from 'react-simple-toasts';
import 'react-simple-toasts/dist/theme/dark.css';

export const notification = (message = '', isSuccess = true) => {
  // Determine icon and additional text based on isSuccess flag
  const additionalText = isSuccess ? 'Erfolgreich!' : 'Etwas ist schief gelaufen!';

  toast(
    <div className="flex gap-4">
      {isSuccess ? (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            color="#ffffff"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-rosette-discount-check"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" />
            <path d="M9 12l2 2l4 -4" />
          </svg>
        </div>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          color="#fff"
          strokeLinejoin="round"
          className={`icon icon-tabler icons-tabler-outline`}
        >
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          <path d="M12 9v4" />
          <path d="M12 16v.01" />
        </svg>
      )}

      <div>
        <p className={`relative top-[-6px] text-lg text-white`}>{additionalText}</p>
        {message && <h2 className={`text-sm text-white `}>{message}</h2>}
      </div>
    </div>,
    {
      duration: isSuccess ? 4000 : 8000,
      maxVisibleToasts: 1,
      className: `${isSuccess ? 'bg-green-400' : 'bg-red-500'} px-8 py-6 rounded font-semibold text-xl`,
      position: 'top-center',
    },
  );
};
