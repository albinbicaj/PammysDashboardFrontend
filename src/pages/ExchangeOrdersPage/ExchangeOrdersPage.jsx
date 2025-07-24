import { ReturnLayout } from '../../components/template/ReturnLayout';
import { ExchangeOrder } from '../../components/organisms/Exchange/ExchangeOrder';
import useDocumentTitle from '../../components/useDocumentTitle';
const ExchangeOrdersPage = () => {
  useDocumentTitle('Pammys™ Exchange Orders');

  return (
    <ReturnLayout>
      <ExchangeOrder />
    </ReturnLayout>
  );
};
export default ExchangeOrdersPage;
