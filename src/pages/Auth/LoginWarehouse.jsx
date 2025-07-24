import { LoginFormWarehouse } from '../../components/organisms/Authentication/LoginFormWarehouse';
import useDocumentTitle from '../../components/useDocumentTitle';
const LoginPageWarehouse = () => {
  useDocumentTitle("Pammy's | Login");
  return (
    <div className="relative bg-white">
      {/* <div className="before: fixed bottom-0 left-0 right-0 top-0 z-0 flex items-center justify-center px-12 py-8 opacity-30">
        <div className="h-96 w-96 scale-[2] rounded-full bg-gradient-to-r from-accent to-transparent  blur-3xl "></div>
        <div className="-ml-44 h-96 w-96 scale-[1.7] rounded-full bg-gradient-to-r from-yellow-200 to-transparent  blur-3xl "></div>
      </div> */}
      <div className="relative mx-auto h-screen max-h-screen max-w-[1200px] overflow-y-auto">
        <div className="fixed left-0 right-0 top-0 flex justify-between px-12 py-8">
          <img className="w-36 bg-cover" src="/images/new/logo-new.svg" alt="Pammy's Logo." />
          <p className="text-xl font-semibold">Anmeldung mit Pammys</p>
        </div>
        <LoginFormWarehouse />
      </div>
    </div>
  );
};

export default LoginPageWarehouse;
