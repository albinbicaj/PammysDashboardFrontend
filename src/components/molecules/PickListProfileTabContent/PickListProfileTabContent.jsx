import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import showToast from '../../../hooks/useToast';
import PickListProfileTabUIContent from './PickListProfileTabUIContent';

export const PickListProfileTabContent = ({
  fetchedPickedListProfile,
  setCurrentTab,
  currentTab,
  getPicklists,
  filters,
  setFilters,
  fetchData,
  saveStatus,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  setColumnFilters,
  columnFilters,
  loadingTable,
  setLoadingTable,
  setLoadingFullTable,
  loadingFullTable,
}) => {
  const [rules, setRules] = useState([]);
  const [roleId, setRoleId] = useState('');
  const [selected, setSelected] = useState([]);
  const [openRows, setOpenRows] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [partiallyFulfilled, setPartiallyFulfilled] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectValue, setSelectValue] = useState('');
  const [shortestPath, setShortestPath] = useState(false);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const fetchRulesList = async (page = 1) => {
    try {
      const response = await axiosInstance.get(`/picklist/rules?page=${page}&paginate=100`);
      const data = response.data;
      const activeRules = data.rules.data.filter((rule) => rule.active === 1);

      const newRules = activeRules.filter((newRule) => {
        return !rules.some((existingRule) => existingRule.id === newRule.id);
      });
      setCurrentPage(page);
      setRules((prevRules) => [...prevRules, ...newRules]);
      setTotalPages(data.rules.last_page);
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const onSelectChange = (selectedOption) => {
    if (selectedOption) {
      const selectedId = selectedOption.id;
      const partiallyFulfilled = selectedOption.partially_fulfilled;
      const partiallyInProgressOrders = selectedOption.partially_in_progress_orders;
      setRoleId(selectedId);
      setSelectValue(selectedOption);

      if (partiallyFulfilled === 1) {
        setPartiallyFulfilled(1);
      } else if (partiallyInProgressOrders === 1) {
        setPartiallyFulfilled(2);
      } else {
        setPartiallyFulfilled(0);
      }
    } else {
      setRoleId(null);
    }
  };
  // #notification #rgnpcrz #1209301358047863-Asana
  const onCreateProfile = async () => {
    setLoadingTable(true);
    try {
      let endpoint = '/picklist/create-picklist';

      if (partiallyFulfilled == 1) {
        endpoint = '/picklist/create-partially-picklist';
      }

      if (partiallyFulfilled == 2) {
        endpoint = '/picklist/create-in-progress-picklist';
      }

      const response = await axiosInstance.post(endpoint, {
        rule_id: roleId,
        shortest_path: shortestPath,
      });

      if (
        response.data.message == 'Success' ||
        response.data.message == 'success' ||
        response.data.message == 'Erfolg'
      ) {
        setLoadingTable(false);
        showToast(
          partiallyFulfilled == 1
            ? 'Created partially fulfilled '
            : partiallyFulfilled == 2
              ? 'Created progress picklist'
              : 'Created picklist',
          'success',
        );
      } else {
        setLoadingTable(false);
        showToast(`Server response: ${response.data.message}`, 'failure');
      }
      await getPicklists();
      setSelectValue('');
    } catch (error) {
      setSelectValue('');
      console.error('Error fetching data:', error);
    }
  };

  const handleDownloadAll = async (id) => {
    const itemIds = id ? Array.from(id) : Array.from(selected);

    const formattedDateTime = dayjs().format('DD-MM-YYYY_HH-mm-ss');
    const fileName = `pick_list_profile_${formattedDateTime}`;

    try {
      setIsDownloading(true);
      setLoadingFullTable(true);
      setLoadingTable(true);
      const zip = new JSZip();

      // Create a new PDFDocument to merge the PDFs if id is null and more than one PDF exists
      let mergedPdf = null;

      // Function to add a PDF to the merged PDF
      const addPdfToMergedPdf = async (base64String) => {
        const pdfDoc = await PDFDocument.load(base64String);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      };

      try {
        const response = await axiosInstance.post('/picklist/generate-picklist', {
          picklist_id: itemIds,
        });

        const data = response.data;

        if (data && Array.isArray(data.pdf)) {
          if (data.pdf.length > 1 && !id) {
            mergedPdf = await PDFDocument.create();
          }

          for (const [index, base64String] of data.pdf.entries()) {
            const base64StringSplit = base64String.split(',')[1];
            const byteCharacters = atob(base64StringSplit);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const itemId = itemIds[index];
            // Check if the itemId exists, if it does, add it to the zip
            if (itemId) {
              zip.file(`${fileName}_${itemId}.pdf`, byteArray);
            }

            // Add to the merged PDF if it exists
            if (mergedPdf) {
              const base64PdfString = `data:application/pdf;base64,${base64StringSplit}`;
              await addPdfToMergedPdf(base64PdfString);
            }
          }
        } else {
          throw new Error('API did not return any PDFs');
        }
      } catch (error) {
        console.error('Fehler beim Herunterladen von PDFs:', error);
        showToast('Fehler beim Herunterladen von PDFs.', 'failure');
      }

      if (id) {
        const singleIdResponse = await axiosInstance.post('/picklist/generate-picklist', {
          picklist_id: [id],
        });

        const singleIdData = singleIdResponse.data;

        if (singleIdData && Array.isArray(singleIdData.pdf) && singleIdData.pdf.length > 0) {
          const base64String = singleIdData.pdf[0];
          const base64StringSplit = base64String.split(',')[1];
          const byteCharacters = atob(base64StringSplit);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${fileName}.pdf`);
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          throw new Error('API did not return any PDFs');
        }
      } else {
        // Save the merged PDF and add it to the zip if it exists
        if (mergedPdf) {
          const mergedPdfBytes = await mergedPdf.save();
          zip.file(`${fileName}_merged.pdf`, mergedPdfBytes);
        }

        // Generate the zip file
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.setAttribute('download', 'picklist_pdfs.zip');
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setSelectedCount(0);
      setSelected([]);
      showToast('Download abgeschlossen', 'success');
    } catch (error) {
      console.error('Fehler beim Herunterladen aller PDFs:', error);
      showToast('Beim Herunterladen von PDFs ist ein Fehler aufgetreten.', 'failure');
    } finally {
      setIsDownloading(false);
      setLoadingFullTable(false);
      setLoadingTable(false);

      const tabStatusMapping = {
        picklist: undefined,
        downloaded: 1,
        finished: 2,
        working: 3,
      };

      const status = tabStatusMapping[currentTab];
      fetchData(status);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = fetchedPickedListProfile?.data.map((row) => row.id);
      setSelected(newSelected);
      setSelectedCount(newSelected.length);
    } else {
      setSelected([]);
      setSelectedCount(0);
    }
  };

  const handleCheckboxChange = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
    setSelectedCount(newSelected.length);
  };

  const toggleRow = (rowId) => {
    setOpenRows((prevOpenRows) =>
      prevOpenRows.includes(rowId)
        ? prevOpenRows.filter((id) => id !== rowId)
        : [...prevOpenRows, rowId],
    );
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleChangePage = async (event, newPage) => {
    if (newPage < 0 || newPage >= fetchedPickedListProfile.last_page) {
      return;
    }
    await fetchData(saveStatus, newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    await fetchData(saveStatus, 0, newRowsPerPage);
  };

  const updateFilters = (fieldsToUpdate) => {
    setFilters((prevContext) => {
      let updatedContext = { ...prevContext };
      for (const [key, value] of Object.entries(fieldsToUpdate)) {
        updatedContext[key] = value;
      }
      return updatedContext;
    });
  };

  const handleSortBy = (sort) => {
    if (filters.sortBy === sort.sortBy && filters.sortWith === sort.sortWith) {
      updateFilters({ sortBy: 'asc', sortWith: '' });
    } else {
      updateFilters(sort);
    }
    setPage(0);
  };

  const handleScroll = (event) => {
    const target = event.target;
    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
      if (currentPage < totalPages) {
        fetchRulesList(currentPage + 1);
      }
    }
  };

  const handleFilterChange = (column, value) => {
    setColumnFilters((prevFilters) => {
      // If the value is empty, remove the filter for this column
      if (value === '') {
        const { [column.field]: omit, ...restFilters } = prevFilters;
        return restFilters;
      }
      // Otherwise, add/update the filter for this column
      return {
        ...prevFilters,
        [column.field]: value,
      };
    });
    setPage(0);
  };

  useEffect(() => {
    setSelected([]);
    setSelectedCount(0);
    if (currentTab === 'definition') {
      const { pathname, search } = location;
      const newSearch = new URLSearchParams(search);
      newSearch.delete('id');
      navigate(`${pathname}?${newSearch.toString()}`);
    }
  }, [location.search, currentTab]);

  return (
    <PickListProfileTabUIContent
      currentTab={currentTab}
      selectValue={selectValue}
      handleScroll={handleScroll}
      rules={rules}
      onSelectChange={onSelectChange}
      fetchRulesList={fetchRulesList}
      setShortestPath={setShortestPath}
      shortestPath={shortestPath}
      selected={selected}
      isDownloading={isDownloading}
      roleId={roleId}
      onCreateProfile={onCreateProfile}
      loadingTable={loadingTable}
      partiallyFulfilled={partiallyFulfilled}
      handleChange={handleChange}
      fetchedPickedListProfile={fetchedPickedListProfile}
      selectedCount={selectedCount}
      handleSortBy={handleSortBy}
      filters={filters}
      columnFilters={columnFilters}
      handleFilterChange={handleFilterChange}
      loadingFullTable={loadingFullTable}
      isSelected={isSelected}
      handleCheckboxChange={handleCheckboxChange}
      handleSelectAllClick={handleSelectAllClick}
      toggleRow={toggleRow}
      openRows={openRows}
      handleDownloadAll={handleDownloadAll}
      page={page}
      rowsPerPage={rowsPerPage}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};
