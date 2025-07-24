import React, { useState } from 'react';
import { TextField, SelectField } from '../../molecules';
import { CustomButton } from '../../atoms';
import { feedback as feedbackOptions } from '../../../data/feedback';
import { MenuItem, Select } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

export const Feedback = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('Choose feedback');
  const handleSetFeedback = (e) => {
    setFeedback(e.target.value);
  };

  return (
    <div className="mt-12 w-full flex flex-col items-center text-left">
      <div className="mb-5">
        <InputLabel className="mb-2" id="feedback-label text-left">
          Choose feedback
        </InputLabel>
        <select
          labelId="feedback-label"
          value={feedback}
          className="select-reason"
          onChange={handleSetFeedback}
        >
          {feedbackOptions.map((feedbackOpt, index) => (
            <option key={index} value={feedbackOpt.value}>
              {feedbackOpt.label}
            </option>
          ))}
        </select>
      </div>
      {feedback === 'Other' && (
        <div className="mt-5">
          <TextField className="custom-feedback" placeholder={'Type your feedback'} minRows={3} />
        </div>
      )}

      <button className="start-button">Submit</button>
    </div>
  );
};
