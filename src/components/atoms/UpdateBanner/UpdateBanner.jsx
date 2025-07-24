import { useVersionChecker } from '../../../hooks/useVersionChecker';

export function UpdateBanner() {
  const { updateAvailable, triggerUpdate } = useVersionChecker();

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 rounded-xl bg-zinc-800 px-4 py-3 text-white shadow-lg">
      <span>New version available</span>
      <button
        onClick={triggerUpdate}
        className="rounded-md bg-green-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-green-600"
      >
        Update
      </button>
    </div>
  );
}

// export function UpdateBanner({ onUpdate }) {
//   return (
//     <div
//       style={{
//         position: 'fixed',
//         bottom: '20px',
//         right: '20px',
//         background: '#333',
//         color: '#fff',
//         padding: '12px 16px',
//         borderRadius: '8px',
//         zIndex: 99999999,
//         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
//       }}
//     >
//       <span style={{ marginRight: '10px' }}>New version available</span>
//       <button
//         onClick={onUpdate}
//         style={{
//           background: '#00c853',
//           color: '#fff',
//           border: 'none',
//           borderRadius: '4px',
//           padding: '6px 12px',
//           cursor: 'pointer',
//         }}
//       >
//         Update
//       </button>
//     </div>
//   );
// }
