import { LoginForm } from '../../components/organisms';
import useDocumentTitle from '../../components/useDocumentTitle';
const LoginPage = () => {
  useDocumentTitle("Pammy's | Login");
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
