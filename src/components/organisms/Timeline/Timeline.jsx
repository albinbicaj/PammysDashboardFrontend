import { useState } from 'react';
import { Stepper, StepLabel, Step, Modal, Box, Button } from '@mui/material';
import { blue } from '@mui/material/colors';
import { Event, Comment, AddComment, CustomConnector } from '../../atoms';
import { WarningModal } from '../../molecules';
import axiosInstance from '../../../utils/axios';
import { EventShippingLabel } from '../../atoms/EventShippingLabel/EventShippingLabel';
import EmailModal from '../../molecules/EmailModal/EmailModal';
import ViewEmailButton from '../ViewEmailButton/ViewEmailButton';
import showToast from '../../../hooks/useToast';

export const Timeline = ({
  logs,
  comment,
  setComment,
  saveComment,
  commentToDelete,
  setCommentToDelete,
  deleteComment,
  pdf,
  setPdf,
  orderId,
  returnId,
  archivedOrderStatus,
}) => {
  const stepStyle = {
    '& .Mui-active': {
      '&.MuiStepIcon-root': {
        color: blue[900],
      },
    },
    '& .Mui-completed': {
      '&.MuiStepIcon-root': {
        color: blue[900],
        backgroundColor: blue[900],
        height: '11px',
        width: '11px',
        borderRadius: '50%',
      },
    },
  };

  const [showModal, setShowModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailHtml, setEmailHtml] = useState('');
  const [subjectTitle, setSubjectTitle] = useState('');
  const [loading, setLoading] = useState({});

  const handleViewEmail = async (status, id) => {
    setLoading((prevLoading) => ({ ...prevLoading, [id]: true }));
    try {
      const response = await axiosInstance.get(
        `dashboard/emails-render-template/${status}?id=${orderId}&barcode_number=${returnId}`,
      );
      setEmailHtml(response?.data?.template);
      setSubjectTitle(response?.data?.subject);
      setShowEmailModal(true);
      setLoading((prevLoading) => ({ ...prevLoading, [id]: false }));
    } catch (error) {
      setLoading((prevLoading) => ({ ...prevLoading, [id]: false }));
      showToast('Could not load this email', 'failure');
    }
  };

  return (
    <div className="bg-white p-4 text-sm shadow">
      <div className="pb-3 font-semibold">Chronik</div>
      <div className="w-full"></div>
      <div className="add-comment">
        <AddComment
          comment={comment}
          setComment={setComment}
          submitComment={saveComment}
          file={pdf}
          setFile={setPdf}
        />
      </div>
      <div className="timeline-content">
        <Stepper
          activeStep={1}
          sx={stepStyle}
          orientation="vertical"
          connector={<CustomConnector />}
        >
          <Step>
            {logs.map((log, index) =>
              !log.status ? (
                <div key={index} className="mb-8 flex flex-col border-b-2 border-gray-300 pb-6">
                  <Comment
                    author={log.created_by || ''}
                    comment={log.comment}
                    createdAt={log.created_at}
                    setShowModal={setShowModal}
                    commentToDelete={commentToDelete}
                    setCommentToDelete={setCommentToDelete}
                    deleteComment={deleteComment}
                    fileURL={log.image_path}
                  />
                </div>
              ) : log.status === 'requested' && log.image_path !== null ? (
                <div
                  key={index}
                  className="mb-8 flex items-center justify-between border-2 border-gray-300 px-5 pb-6"
                >
                  <StepLabel />
                  <EventShippingLabel
                    createdBy={log.created_by || ''}
                    message={log.comment}
                    createdAt={log.created_at}
                    pdfLabel={log.image_path}
                  />
                  {archivedOrderStatus === null && (
                    <ViewEmailButton
                      log={log}
                      handleViewEmail={handleViewEmail}
                      loading={loading}
                    />
                  )}
                </div>
              ) : (
                <div
                  key={index}
                  className="mb-8 flex items-center justify-between border-b-2 border-gray-300 pb-6 pl-5"
                >
                  <StepLabel />
                  <Event
                    createdBy={log.created_by || ''}
                    message={log.comment}
                    createdAt={log.created_at}
                    image={log.image_path}
                  />
                  {archivedOrderStatus === null && (
                    <ViewEmailButton
                      log={log}
                      handleViewEmail={handleViewEmail}
                      loading={loading}
                    />
                  )}
                </div>
              ),
            )}
          </Step>
        </Stepper>
        <WarningModal
          confirm={deleteComment}
          showModal={showModal}
          setShowModal={setShowModal}
          modalTitle={'Delete comment'}
          modalDescription={
            'You are deleting this comment, once a comment is deleted, it cannot be restored'
          }
        />
        <EmailModal
          open={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          emailHtml={emailHtml}
          subjectTitle={subjectTitle}
        />
      </div>
    </div>
  );
};
