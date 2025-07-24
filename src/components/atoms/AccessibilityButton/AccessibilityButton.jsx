import { useModal } from '../../../context/UnhandledItemNotificationModalContext';
import { useAuthContext } from '../../../context/Auth.context';

export const AccessibilityButton = ({ item, id, onClick }) => {
  const { items, setShowModal } = useModal();
  const { user } = useAuthContext();

  const handleOnClick = () => {
    const hasRequested = items.some((item) => item.status === 'requested');
    if (hasRequested && user?.role_id === 7) {
      setShowModal(true);
      return;
    }
    onClick(item.id);
  };
  return (
    <button
      onClick={handleOnClick}
      className={`cursor-pointer ${item.id === id ? 'border-accent' : ''} rounded-md border-2 px-2 py-1.5 duration-150 hover:scale-[1.01] hover:shadow-md active:scale-[1]`}
    >
      <div className="flex items-center gap-1.5">
        <div>{item.icon}</div>
        <div
          className={`text-nowrap text-start ${item.id === id ? 'w-[130px] ' : ' w-0'} overflow-hidden duration-200`}
        >
          <span className="px-1.5">{item.name.en}</span>
        </div>
        <div className="cursor-pointer rounded-md border px-2 py-0.5 text-xs text-gray-400">
          {item.shortcut}
        </div>
      </div>
    </button>
  );
};
