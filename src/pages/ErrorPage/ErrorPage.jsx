import { Title } from '../../components/atoms/Title/Title';
import { Text } from '../../components/atoms';
import { CustomButton } from '../../components/atoms';
import { useNavigate } from 'react-router-dom';
const ErrorPage = () => {
  const navigate = useNavigate();
  const handleBackToHomePage = () => {
    navigate('/retourenportal');
  };
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <div>
        <Title className="text-9xl font-bold text-[#1976d2]">404</Title>
      </div>
      <div>
        <Title className="mt-8 text-4xl font-bold text-gray-800">
          Sorry, the page can't be found
        </Title>
      </div>
      <div className="flex w-full justify-center">
        <Text className="mb-10 mt-10 w-1/4 text-lg font-normal text-gray-500">
          The page you were looking for appears to have been moved, deleted or does not exist
        </Text>
      </div>
      <div>
        <CustomButton text="Back to homepage" variant="contained" onClick={handleBackToHomePage} />
      </div>
    </div>
  );
};

export default ErrorPage;
