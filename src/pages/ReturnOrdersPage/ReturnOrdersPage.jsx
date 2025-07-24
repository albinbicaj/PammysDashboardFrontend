import { ReturnOrder } from '../../components/organisms/Return/ReturnOrder';
import { ReturnLayout } from '../../components/template/ReturnLayout';
import useDocumentTitle from '../../components/useDocumentTitle';
import { PortalLayout } from '../../components/template/PortalLayout';
import { ReturnPortalLayout } from '../../components/template/ReturnPortalLayout';

const ReturnOrdersPage = () => {
  useDocumentTitle('Pammys™ Return Orders');

  return (
    // <ReturnLayout>
    <ReturnPortalLayout>
      <ReturnOrder />
    </ReturnPortalLayout>
    // </ReturnLayout>
  );
};
export default ReturnOrdersPage;
