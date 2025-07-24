import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import { Layout } from '../../components/template';
import useDocumentTitle from '../../components/useDocumentTitle';
import { CustomChart, StatsTab } from '../../components/atoms';
import { HomePageTabContent } from '../../components/molecules';
import { grey } from '@mui/material/colors';
import { products } from '../../data/products';

import dummyData from '../../data/statistics/generatedData_2.json';
import ReturnsStats from './components/ReturnsStats';
import { CustomDatePickerV2 } from '../../components/molecules/CustomDatePickerV2/CustomDatePickerV2';
import dayjs from 'dayjs';
import { filter } from 'jszip';
import { PammysLoading } from '../../components/atoms/PammysLoading/PammysLoading';
import axiosInstance from '../../utils/axios';

const DashboardHomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const parsed = queryString.parse(location.search);
  const activeTabQueryParam = parsed.activeTab;
  const validTabValues = ['most-returned-2', 'most-returned', 'most-reasons'];
  const [activeTab, setActiveTab] = useState(
    validTabValues.includes(activeTabQueryParam) ? activeTabQueryParam : 'most-returned-2',
  );
  console.log('HOME PAGE LOADED -------------');
  const updateActiveTabQueryParam = (activeTabValue) => {
    const updatedSearch = `activeTab=${activeTabValue}`;
    setActiveTab(activeTabValue);
    navigate(`?${updatedSearch}`);
  };

  const defaultStartDate = dayjs().subtract(1, 'month').toDate();

  const [filters, setFilters] = useState({
    filterOn: false,
    filterDate: false,
    sortBy: 'asc',
    sortWith: '',
    paymentMethod: [],
    startDate: defaultStartDate,
    endDate: new Date(),
  });

  const updateFilters = (fieldsToUpdate) => {
    setFilters((prevContext) => {
      let updatedContext = { ...prevContext };
      for (const [key, value] of Object.entries(fieldsToUpdate)) {
        console.log('Updated filter: ', key, value);
        updatedContext[key] = value;
      }
      return updatedContext;
    });
  };

  console.log('FILTERS', filters);
  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/home-anayltics/index?&startDate=${dayjs(filters.startDate).format('YYYY-MM-DD')}&endDate=${dayjs(filters.endDate).format('YYYY-MM-DD')}`,
      );
      console.log('RESPONSE', response);
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [filters]);

  useDocumentTitle("Pammy's | Dashboard");

  // if (loading) {
  //   return (
  //     <div className="flex h-32 w-full items-center justify-center bg-white ">
  //       <PammysLoading />
  //     </div>
  //   );
  // }

  return (
    <div className="homepage-container">
      <div className="mb-4 flex flex-col  gap-7">
        <div className=" flex items-center justify-between">
          <div className="flex items-center gap-3 align-middle">
            <CustomDatePickerV2 filters={filters} updateFilters={updateFilters} />
          </div>
        </div>
        <ReturnsStats data={data || []} loading={loading} />

        {/* <div className="flex  gap-5">
          <div className="border pt-5">
            <CustomChart />
          </div>
          <div className="flex flex-1 flex-col gap-10">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col font-bold">
                <span>Retouren</span>
                <span className="text-xl">40</span>
              </div>
              <div className="flex items-center">
                <span>Verteilung</span>
                <span></span>
              </div>
            </div>
             <div className="space-y-5 divide-y divide-solid">
              <div className="flex items-center justify-between">
                <span>Erstattungen</span>
                <span className=" font-bold">16.07%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Umtausche</span>
                <span className=" font-bold">83.92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shop-Guthaben</span>
                <span className=" font-bold">0.0%</span>
              </div>
            </div>
            <div className="flex flex-col font-bold text-slate-600">
              <span>Widerrufsfrist(tage)</span>
              <span className="text-xl">15</span>
            </div>
          </div>
        </div> */}
        <div className="bg-white">
          <HomePageTabContent
            activeTab={activeTab}
            setActiveTab={updateActiveTabQueryParam}
            filters={filters}
            variants={data.variants || []}
            returnReasons={data.reasons || []}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;

//
//
//
// Drinis code backup
//
//
//
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import queryString from 'query-string';
// import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
// import { Layout } from '../../components/template';
// import useDocumentTitle from '../../components/useDocumentTitle';
// import { CustomChart, StatsTab } from '../../components/atoms';
// import { HomePageTabContent } from '../../components/molecules';
// import { grey } from '@mui/material/colors';
// import { products } from '../../data/products';

// import dummyData from '../../data/statistics/generatedData_2.json';

// const DashboardHomePage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const parsed = queryString.parse(location.search);
//   const activeTabQueryParam = parsed.activeTab;
//   const validTabValues = ['most-returned', 'most-reasons'];
//   const [activeTab, setActiveTab] = useState(
//     validTabValues.includes(activeTabQueryParam) ? activeTabQueryParam : 'most-returned',
//   );
//   const updateActiveTabQueryParam = (activeTabValue) => {
//     const updatedSearch = `activeTab=${activeTabValue}`;
//     setActiveTab(activeTabValue);
//     navigate(`?${updatedSearch}`);
//   };

//   const data = [
//     { statName: 'Retouren Gesamt', statValue: '100' },
//     { statName: 'Offen', statValue: '100' },
//     { statName: 'Zu bearbaiten', statValue: '11' },
//     { statName: 'Klärfall', statValue: '100' },
//   ];
//   useDocumentTitle("Pummy's | Dashboard");
//   return (
//     <div className="homepage-container">
//       <div className="mb-4 flex flex-col  gap-7 border bg-white p-4">
//         <div className="tab-stats-wrapper mt-4 flex w-7/12 justify-between pb-4">
//           {data.map((dt) => (
//             <StatsTab statName={dt.statName} statValue={dt.statValue} />
//           ))}
//         </div>
//         <div className=" flex items-center justify-between">
//           <div className="flex ">
//             <SignalCellularAltIcon
//               style={{ marginRight: '5px', fontSize: '20px', color: grey[400] }}
//             />
//             <span className="font-semibold">Statistiken</span>
//           </div>
//           <div className="flex items-center gap-3 align-middle">
//             <select name="" id="" className="input ">
//               <option value="">Letzte 14 tage</option>
//               <option value=""></option>
//               <option value=""></option>
//             </select>
//             <button className="btn btn-primary text-nowrap">Daten neu laden</button>
//           </div>
//         </div>
//         <div className="flex flex-col gap-5">
//           <div className="border pt-5">
//             <CustomChart />
//           </div>
//           <div className="">
//             <div className="flex flex-col">
//               <span>Retouren</span>
//               <span>40</span>
//             </div>
//             <div>
//               <div className="flex items-center justify-end">
//                 <span>Verteilung</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span>Erstattungen</span>
//                 <span>16.07%</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span>Umtausche</span>
//                 <span>83.92%</span>
//               </div>
//               <div>
//                 <span>Shop-Guthaben</span>
//                 <span>0.0%</span>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div>
//           <HomePageTabContent activeTab={activeTab} setActiveTab={updateActiveTabQueryParam} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardHomePage;
