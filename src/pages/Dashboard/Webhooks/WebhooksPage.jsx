import { useWebhooks } from '../../../apiHooks/useWebhooks';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconTrash,
} from '@tabler/icons-react';
import { PammysLoading } from '../../../components/atoms/PammysLoading/PammysLoading';
import WebhookGroupedList from './WebhookGroupedList';
import { saveWebhook } from '../../../api/webhooks';
import showToast from '../../../hooks/useToast';

const WebhooksPage = () => {
  const {
    data: webhooks,
    isLoading: webhooksLoading,
    error: webhooksErrors,
    refetch,
    isFetching,
  } = useWebhooks();
  const handleSaveWebhook = async () => {
    console.log('handleSaveWebhook');
    try {
      showToast('Request sending...', 'success');
      const response = await saveWebhook();
    } catch {
    } finally {
      showToast('Request sent.', 'success');
      refetch();
    }
  };

  if (webhooksLoading == true) {
    return <PammysLoading />;
  }

  if (webhooksErrors) {
    <>
      <p>Something went wrong</p>
      <div>
        <pre>{JSON.stringify(webhooksErrors, null, 2)}</pre>
      </div>
    </>;
  }

  return (
    <div className="webhooks-page-container space-y-5 ">
      <div>
        <WebhookGroupedList
          webhooks={webhooks?.webhooks}
          handleSaveWebhook={handleSaveWebhook}
          isFetching={isFetching}
        />
      </div>
    </div>
  );

  return (
    <div className="webhooks-page-container space-y-5 ">
      <div className="flex min-h-48 flex-col items-center justify-center gap-3 py-8">
        {webhooks?.webhooks?.length == 7 ? (
          <>
            <IconCircleCheck className="text-green-500" size={64} />
            <p className="text-2xl font-semibold">Webhooks operational </p>
          </>
        ) : webhooks?.webhooks?.length < 7 ? (
          <>
            <IconAlertTriangle className="text-red-500" size={64} />
            <p className="text-2xl font-semibold">Inactive webhook detected</p>
          </>
        ) : (
          <>
            <IconAlertCircle className="text-orange-500" size={64} />
            <p className="text-2xl font-semibold">Something might be wrong</p>
          </>
        )}
      </div>

      {/* <div className="card">
        <pre>{JSON.stringify(webhooks?.webhooks, null, 2)}</pre>
      </div> */}
      <div className="card">
        <div className="grid grid-cols-12 font-bold">
          <div className=" col-span-7 p-2">Domain</div>
          <div className=" col-span-4 p-2">Topic</div>
          <div className=" col-span-1 flex justify-end p-2">Delete</div>
        </div>
        <div className=" grid grid-cols-12">
          {webhooks?.webhooks?.map((item) => {
            return (
              <>
                <div className="col-span-7 border-b p-2">{item.address}</div>
                <div className="col-span-4 border-b p-2">{item.topic}</div>
                <div className="col-span-1 flex items-center justify-end border-b p-2 ">
                  <button
                    className="text-gray-400 hover:text-gray-800"
                    onClick={() => {
                      console.log(item.id);
                    }}
                  >
                    <IconTrash size={18} />
                  </button>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WebhooksPage;
