import MenuItem from '../../../atoms/MenuItem';
import items from './stories';

export const SidebarItemsMenu = () => {
  return (
    <div className="space-y-3">
      <label className="px-3 text-xs uppercase text-gray-500">Analytik</label>
      {items.map((item) => {
        return <MenuItem key={item.title} path={item.path} icon={item.icon} title={item.title} />;
      })}
    </div>
  );
};
export default SidebarItemsMenu;
