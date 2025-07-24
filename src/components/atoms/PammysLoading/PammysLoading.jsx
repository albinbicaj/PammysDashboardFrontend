export const PammysLoading = ({ height = 10, width = 10 }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="animate-spin opacity-75">
        <img src="/images/pammys-icon.svg" className={`h-${height} w-${width}`} alt="Loading" />
      </div>
    </div>
  );
};
