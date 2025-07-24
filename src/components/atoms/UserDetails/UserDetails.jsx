export const UserDetails = ({ email, workplace }) => {
  return (
    <div className="flex mb-3 items-center justify-between user  ">
      <p className="font-medium text-xs leading-4 text-gray-800">{email}</p>
      <div className="bg-white box-border rounded-lg border border-gray-300 px-2 py-1">
        <p className="font-medium text-sm leading-4 text-gray-800 capitalize">{workplace} </p>
      </div>
    </div>
  );
};
