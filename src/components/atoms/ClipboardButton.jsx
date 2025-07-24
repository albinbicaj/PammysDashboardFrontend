import React from 'react';
import { copyToClipboard } from '../../utils/clipboard';
import { IconClipboard, IconCopy } from '@tabler/icons-react';
import toast from 'react-simple-toasts';
import { Tooltip } from '@mui/material';
import showToast from '../../hooks/useToast';

const ClipboardButton = ({ iconSize = 16, textToCopy }) => {
  const handleCopy = () => {
    copyToClipboard(textToCopy)
      .then(() => {
        showToast('Copied to clipboard!', 'success');
      })
      .catch(() => {
        showToast('Failed to copy to clipboard!', 'failure');
      });
  };

  return (
    <div className="relative inline-block">
      <Tooltip title={`Copy: ${textToCopy}`} arrow placement="top">
        <button
          onClick={handleCopy}
          className="btn t!ext-gray-600 !hover:text-gray-800 flex cursor-pointer items-center !bg-gray-100 !p-1"
        >
          <IconClipboard size={iconSize} />
        </button>
      </Tooltip>

      {/* Tooltip displayed on hover */}
      {/* <div className="absolute left-1/2 top-[-30px] z-10 -translate-x-1/2 transform rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity hover:opacity-100">
        Click
      </div> */}
    </div>
  );
};

export default ClipboardButton;
