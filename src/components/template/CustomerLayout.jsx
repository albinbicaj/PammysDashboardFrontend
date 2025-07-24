import './ScrollBar.css';

export const CustomerLayout = ({ children }) => {
  return (
    <div className="max-h-screen overflow-y-scroll bg-mobileBgImage bg-cover bg-no-repeat sm:bg-bgImage">
      <div className="mx-auto flex min-h-screen max-w-[1400px] items-center justify-center">
        <div className="hidden h-20 w-1/3 2xl:block"></div>
        <div className="max-w-full px-4 py-10 duration-300  sm:max-w-[700px] 2xl:mx-0">
          {children}
        </div>
      </div>
    </div>
  );
};
