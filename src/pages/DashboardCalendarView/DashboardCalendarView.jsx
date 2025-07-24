import React, { useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Typography } from '@mui/material';
import { useAttendanceLogs } from '../../apiHooks/useOrders';
import { PammysLoading } from '../../components/atoms/PammysLoading/PammysLoading';
import axiosInstance from '../../utils/axios';

const DashboardCalendarView = () => {
  const [view, setView] = useState(Views.AGENDA);
  const [isDeleteAttendanceLoading, setIsDeleteAttendanceLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: moment().startOf('month').toDate(),
      endDate: moment().endOf('month').toDate(),
      key: 'selection',
    },
  ]);
  const localizer = momentLocalizer(moment);

  const colors = ['#FE938C', '#E6B89C', '#EAD2AC', '#9CAFB7', '#4281A4'];

  const getUserColor = (userName) => {
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
      hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const CustomToolbar = ({ dateRange, onNavigate, onDelete }) => {
    const goToBack = () => {
      onNavigate('PREV');
    };

    const goToNext = () => {
      onNavigate('NEXT');
    };

    const startDate = moment(dateRange[0].startDate).format('DD-MM-YYYY');
    const endDate = moment(dateRange[0].endDate).format('DD-MM-YYYY');

    return (
      <div className="flex-col bg-white">
        <div className="flex items-center justify-center bg-white p-2">
          <div className="flex space-x-2">
            <button type="button" onClick={goToBack} className="rounded bg-gray-200 px-4 py-2">
              Back
            </button>
            <button type="button" onClick={goToNext} className="rounded bg-gray-200 px-4 py-2">
              Next
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded bg-red-500 px-4 py-2 text-white"
            >
              {isDeleteAttendanceLoading ? <PammysLoading height={5} width={5} /> : 'Delete'}
            </button>
          </div>
        </div>
        <div className="text-black-700 flex items-center justify-center bg-white p-2">
          {startDate} - {endDate}
        </div>
      </div>
    );
  };

  const calculateTotalTime = (logs, type) => {
    const totalDuration = logs
      .filter((log) => log.type === type)
      .reduce((total, log) => {
        const start = moment(log.start_time);
        const end = moment(log.end_time);
        const duration = moment.duration(end.diff(start));
        return total.add(duration);
      }, moment.duration(0));

    const hours = Math.floor(totalDuration.asHours());
    const minutes = totalDuration.minutes();
    const seconds = totalDuration.seconds();

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const [tempFilters, setTempFilters] = useState({
    startDate: moment().startOf('month').format('YYYY-MM-DD'),
    endDate: moment().endOf('month').format('YYYY-MM-DD'),
  });

  const startDate = moment(dateRange[0].startDate).format('YYYY-MM-DD');
  const endDate = moment(dateRange[0].endDate).format('YYYY-MM-DD');

  const { data: userReports = [], isLoading, refetch } = useAttendanceLogs(startDate, endDate);

  const events = Array.isArray(userReports?.data)
    ? userReports?.data.flatMap((report) => {
        const userName = `${report.first_name} ${report.last_name}`;
        const logsByDate = report.logs.reduce((acc, log) => {
          const date = moment(log.start_time).format('YYYY-MM-DD');
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(log);
          return acc;
        }, {});

        return Object.keys(logsByDate).map((date) => {
          const logs = logsByDate[date];
          const totalPauseTime = calculateTotalTime(logs, 'pause');
          const totalWorkTime = calculateTotalTime(logs, 'work');

          return {
            title: userName,
            start: new Date(date),
            end: new Date(date),
            pauseTime: totalPauseTime,
            workTime: totalWorkTime,
            color: getUserColor(userName),
            user: userName,
            logs: logs,
          };
        });
      })
    : [];

  const userReportsArray = Array.isArray(userReports?.data) ? userReports?.data : [];

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color,
      borderRadius: '5px',
      color: 'white',
      padding: '5px',
      textAlign: 'left',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  });

  const AgendaEvent = ({ event }) => (
    <div className="bg-black-100 flex space-x-4">
      <div className="flex-1">
        <strong>{event.user}</strong>
      </div>
      <div className="flex-1">
        <strong>Pause Duration Tracker:</strong>
        <ul>
          {event.logs
            .filter((log) => log.type === 'pause')
            .map((log, index) => (
              <li key={index}>
                {moment(log.start_time).format('HH:mm:ss')} -{' '}
                {log.end_time ? moment(log.end_time).format('HH:mm:ss') : 'Still on pause'}
              </li>
            ))}
        </ul>
      </div>
      <div className="flex-1">
        <strong>Pause Duration:</strong> {event.pauseTime}
      </div>
      <div className="flex-1">
        <strong>Work Duration:</strong> {event.workTime}
      </div>
    </div>
  );

  const WorkLogsAgendaEvent = ({ event }) => (
    <div className="bg-black-100 col-span-6">
      <div>
        <ul>
          {event.logs
            .filter((log) => log.type === 'work')
            .map((log, index) => (
              <li key={index}>
                {moment(log.start_time).format('HH:mm:ss')} -{' '}
                {log.end_time ? moment(log.end_time).format('HH:mm:ss') : 'Still working'}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );

  const handleNavigate = (action) => {
    let newStartDate;
    let newEndDate;

    if (action === 'PREV') {
      newStartDate = moment(dateRange[0].startDate).subtract(1, 'months').startOf('month');
      newEndDate = moment(newStartDate).endOf('month');
    } else {
      newStartDate = moment(dateRange[0].startDate).add(1, 'months').startOf('month');
      newEndDate = moment(newStartDate).endOf('month');
    }

    setDateRange([
      {
        startDate: newStartDate.toDate(),
        endDate: newEndDate.toDate(),
        key: 'selection',
      },
    ]);
  };

  const handleDelete = async () => {
    const currentMonthStart = moment(dateRange[0].startDate).format('YYYY-MM-DD');
    const currentMonthEnd = moment(dateRange[0].endDate).format('YYYY-MM-DD');
    setIsDeleteAttendanceLoading(true);

    try {
      await axiosInstance.delete('/attendance/delete', {
        data: {
          start_date: currentMonthStart,
          end_date: currentMonthEnd,
        },
      });
      refetch();
      setIsDeleteAttendanceLoading(false);
    } catch (error) {
      setIsDeleteAttendanceLoading(false);
    }
  };

  const updateTempFilters = (newFilters) => {
    setTempFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const applyFilters = () => {
    setDateRange([
      {
        startDate: moment(tempFilters.startDate).toDate(),
        endDate: moment(tempFilters.endDate).toDate(),
        key: 'selection',
      },
    ]);
  };

  const dateRanges = [
    { label: 'Today', days: 0 },
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last 90 Days', days: 90 },
    { label: 'Last 12 Months', days: 365 },
  ];

  return (
    <div className=" bg-gray-100 p-5">
      <div className=" bg-white p-4 shadow-lg">
        <Typography variant="h5" className="flex justify-center pb-[20px]">
          Timesheet
        </Typography>
        <div className="mb-4 text-center">
          <div className="flex flex-wrap gap-3 border-black">
            <div className="flex items-center gap-3">
              <div>From:</div>
              <div>
                <input
                  type="date"
                  max={tempFilters?.endDate || ''}
                  className="rounded border p-2"
                  value={tempFilters?.startDate}
                  onChange={(e) => updateTempFilters({ startDate: e.target.value })}
                />
              </div>
              <div>to:</div>
              <div>
                <input
                  type="date"
                  min={tempFilters?.startDate || ''}
                  value={tempFilters?.endDate}
                  onChange={(e) => updateTempFilters({ endDate: e.target.value })}
                  className="rounded border p-2"
                />
              </div>
            </div>
            <button className="btn btn-primary" onClick={applyFilters}>
              Apply Filters
            </button>
            <div className="h-12 border-r-4"></div>
            <div className="flex flex-row gap-2 align-top">
              {dateRanges.map((range) => (
                <button
                  key={range.label}
                  className="btn btn-secondary px-2 py-1.5"
                  onClick={() => {
                    const endDate = moment().toDate();
                    const startDate = moment().subtract(range.days, 'days').toDate();
                    setDateRange([
                      {
                        startDate,
                        endDate,
                        key: 'selection',
                      },
                    ]);
                  }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {isLoading ? (
          <div>
            <PammysLoading />
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <div className="min-w-[1020px]">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100vh' }}
                selectable
                views={{ agenda: true }}
                date={dateRange[0].startDate}
                view={view}
                length={730}
                onView={setView}
                onNavigate={handleNavigate}
                eventPropGetter={eventStyleGetter}
                messages={{ time: 'Work time list', event: 'Work & Pause Time Summary' }}
                components={{
                  toolbar: () => (
                    <CustomToolbar
                      dateRange={dateRange}
                      onNavigate={handleNavigate}
                      onDelete={handleDelete}
                    />
                  ),
                  agenda: {
                    event: AgendaEvent,
                    time: WorkLogsAgendaEvent,
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
      {!isLoading && (
        <div className=" bg-gray-100 py-5">
          <div className=" bg-white p-4 shadow-lg">
            <Typography variant="h5" className="flex justify-center pb-[20px]">
              Total Work Duration per User:
            </Typography>
            <div className="mb-4 overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2 text-left">User</th>
                    <th className="border px-4 py-2 text-left">Total pause duration</th>
                    <th className="border px-4 py-2 text-left">Total work duration</th>
                  </tr>
                </thead>
                <tbody>
                  {userReportsArray.map((report, index) => {
                    const userName = `${report.first_name} ${report.last_name}`;
                    const backgroundColor = getUserColor(userName);

                    return (
                      <tr
                        key={index}
                        className="border-b"
                        style={{ backgroundColor: backgroundColor, color: 'white' }}
                      >
                        <td className="px-4 py-2 text-left">{userName}</td>
                        <td className="px-4 py-2 text-left">{report.total_break}</td>
                        <td className="px-4 py-2 text-left">{report.total_work}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCalendarView;
