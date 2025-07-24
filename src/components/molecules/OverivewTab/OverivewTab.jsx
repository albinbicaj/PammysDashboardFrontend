import { useForm } from 'react-hook-form';
import axiosInstance from '../../../utils/axios';
import { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import showToast from '../../../hooks/useToast';
import OverviewTabUI from './OverviewTabUI';

export const OverivewTab = ({ fetchPickList, setPage, setCurrentTab }) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [checkId, setCheckId] = useState(null);
  const [tags1, setTags1] = useState([]);
  const [tagInputValue1, setTagInputValue] = useState('');
  const [discountCodes1, setDiscountCodes1] = useState([]);
  const [discountCodesInputValue1, setDiscountCodesInputValue] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showInputs, setShowInputs] = useState(false);
  const [tagChange, setTagChange] = useState(false);
  const [discountCodesChange, setDiscountCodesChange] = useState(false);
  const [datePickerChange, setDatePickerChange] = useState(false);
  const [checkboxState, setCheckboxState] = useState({
    barcode_exclude: false,
    barcode_strict: false,
  });
  const [clickedCheckbox, setClickedCheckbox] = useState('');
  const [clickedForButton, setClickedForButton] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    filterDate: false,
    sortBy: 'asc',
    sortWith: '',
    paymentMethod: [],
  });

  const handleCheckboxChange = (name) => (event) => {
    setCheckboxState((prevState) => ({
      barcode_exclude: name === 'barcode_exclude' ? event.target.checked : false,
      barcode_strict: name === 'barcode_strict' ? event.target.checked : false,
    }));
    setClickedCheckbox(event.target.checked ? name : '');
    setClickedForButton(true);
  };

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

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
  });
  const { vertical, horizontal } = state;
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setState({ ...state, open: false });
  };
  const getParameterFromUrl = (name) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(name);
  };

  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm();

  const [inputTageDisabled, setInputTageDisabled] = useState(false);
  const [inputDiscountCodesDisabled, setInputDiscountCodesDisabled] = useState(false);
  const handleTagInputChange1 = (value) => {
    setTagInputValue(value);
    setInputTageDisabled(true);
  };

  const handleTagInputKeyDown1 = (key) => {
    if (key === 'Enter' && tagInputValue1.trim() !== '') {
      setTags1([...tags1, tagInputValue1.trim()]);
      setTagInputValue('');
    }
  };

  const handleTagDelete1 = (tagToDelete) => {
    setTags1(tags1.filter((tag) => tag !== tagToDelete));
  };

  const handleDiscountCodesInputChange1 = (value) => {
    setDiscountCodesInputValue(value);
    setInputDiscountCodesDisabled(true);
  };

  const handleDiscountCodesInputKeyDown1 = (key) => {
    if (key === 'Enter' && discountCodesInputValue1.trim() !== '') {
      setDiscountCodes1([...discountCodes1, discountCodesInputValue1.trim()]);
      setDiscountCodesInputValue('');
    }
  };

  const handleDiscountCodesDelete1 = (tagToDelete) => {
    setDiscountCodes1(discountCodes1.filter((tag) => tag !== tagToDelete));
  };

  const loadSuggestions = debounce(async (inputValue, callback) => {
    try {
      if (inputValue.length >= 3) {
        const response = await axiosInstance.get(`/picklist/get-items?keywords=${inputValue}`);
        if (response.data.items) {
          const groupedOptions = response.data.items.reduce((acc, item) => {
            const { product_name, title, barcode_number, shopify_variant_id } = item;
            const uniqueValue = `${barcode_number}`; // Unique identifier
            const groupIndex = acc.findIndex((group) => group.label === product_name);
            if (groupIndex !== -1) {
              acc[groupIndex].options.push({ value: uniqueValue, label: title });
            } else {
              acc.push({ label: product_name, options: [{ value: uniqueValue, label: title }] });
            }
            return acc;
          }, []);
          setOptions(groupedOptions);
          callback(groupedOptions);
        } else {
          setOptions([]);
          callback([]);
        }
      } else {
        setOptions([]);
        callback([]);
      }
    } catch (error) {
      console.error('API Error:', error);
      setOptions([]);
      callback([]);
    }
  }, 300);

  const filterOptions = (options, { inputValue }) => {
    const flattenOptions = Array.isArray(options) ? options : [options];
    const flattenedArray = flattenOptions.flatMap((option) => {
      if (option && option.label) {
        return [option];
      } else if (option && option.options && Array.isArray(option.options)) {
        return option.options.filter((subOption) => subOption && subOption.label);
      }
      return [];
    });

    return flattenedArray.filter(
      (option) => option && option.label && option.label.includes(inputValue),
    );
  };

  const onSubmit = async (data) => {
    const barcodeIds = data?.items?.map((selectedItem) => selectedItem?.value);
    const editItemId = getParameterFromUrl('id');

    try {
      setLoading(true);
      const requestData = {
        name: data.name,
        no_of_orders: parseInt(data.orders, 10) || 0,
        picklists_max_no: parseInt(data.maxPicklists, 10) || 0,
        min_order_items: parseInt(data.min_order_items, 10) || '',
        exclude_dates: data.dateCheckbox ? 1 : 0,
        tags: tags1.join(', ') || '',
        discount_codes: discountCodes1.join(', ') || '',
        exclude_tags: data.tagsCheckbox ? 1 : 0,
        items: barcodeIds || [],
        exclude_items: checkboxState.barcode_exclude ? 1 : 0,
        items_strict_filter: checkboxState.barcode_strict ? 1 : 0,
        active: data.active ? 1 : 0,
        partially_fulfilled: data.partially_fulfilled,
        partially_in_progress_orders: data.partially_in_progress_orders,
        max_products_without_quantity_allowed: data.partially_in_progress_orders
          ? 0
          : Number(data.max_products_without_quantity_allowed),
        min_product_items: data.partially_in_progress_orders ? 0 : Number(data.min_product_items),
      };

      if (data.sku_limit) {
        requestData.sku_limit = Number(data.sku_limit);
      }

      if (filters.filterDate) {
        requestData.date_from = startDate ? dayjs(startDate).format('YYYY-MM-DD') : '';
        requestData.date_to = endDate ? dayjs(endDate).format('YYYY-MM-DD') : '';
      } else {
        requestData.date_from = null;
        requestData.date_to = null;
      }

      if (!showInputs) {
        requestData.max_products_without_quantity_allowed = 0;
        requestData.min_product_items = 0;
      }

      if (editItemId) {
        await axiosInstance
          .put(`/picklist/edit-rule/${editItemId}`, requestData)
          .then(() => {
            setState({ ...state, open: true });
            showToast('Auswahlliste erfolgreich aktualisiert', 'success');
            fetchPickList();
            setPage(0);
            setCurrentTab('definition');
            const queryParams = new URLSearchParams(location.search);
            queryParams.set('tab', 'definition');
            navigate({ search: queryParams.toString() });
          })
          .catch((error) => {
            console.error('API Error:', error);
          });
      } else {
        await axiosInstance
          .post('/picklist/store-rules', requestData)
          .then(() => {
            setOptions([]);
            setTags1([]);
            setDiscountCodes1([]);
            reset({});
            Object.keys(data).forEach((field) => {
              setValue(field, '');
            });
            setState({ ...state, open: true });
            showToast('Auswahlliste erfolgreich erstellt', 'success');
            fetchPickList();
            setPage(0);
            setCurrentTab('definition');
            const queryParams = new URLSearchParams(location.search);
            queryParams.set('tab', 'definition');
            navigate({ search: queryParams.toString() });
          })
          .catch((error) => {
            console.error('API Error:', error);
            showToast(null, 'failure');
          });
      }
    } catch (error) {
      console.error('API Error:', error);
      setOptions([]);
      setLoading(false);
    } finally {
      setLoading(false);
      setOptions([]);
    }
  };

  useEffect(() => {
    setOptions([]);
    reset({
      name: '',
      orders: '',
      maxPicklists: '',
      min_order_items: '',
      date_from: '',
      date_to: '',
      tags: '',
      max_products_without_quantity_allowed: '',
      min_product_items: '',
      sku_limit: '',
      exclude_dates: 0,
      exclude_items: 0,
      exclude_tags: 0,
      active: 0,
    });

    const editItemId = getParameterFromUrl('id');
    setCheckId(editItemId);

    if (editItemId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(`/picklist/rule-details/${editItemId}`);
          const { data } = response;

          const barcodeIds = data?.rule?.items?.map((selectedItem) => ({
            value: selectedItem?.barcode_number,
            label: selectedItem?.title,
          }));

          if (data?.rule?.date_from || data?.rule?.date_to) {
            setFilters({ ...filters, filterDate: true });
          }

          const tagsWrap = data.rule.tags.map((tag) => tag.tag);
          setTags1(tagsWrap || []);

          const discountCodesWrap = data.rule.discounts.map((discount) => discount.discount_code);
          setDiscountCodes1(discountCodesWrap || []);

          setStartDate(data?.rule?.date_from);
          setEndDate(data?.rule?.date_to);

          setCheckboxState((prevState) => ({
            barcode_exclude: data.rule.exclude_items === 1 ? true : false,
            barcode_strict: data.rule.items_strict_filter === 1 ? true : false,
          }));

          if (data.rule.exclude_items === 1) {
            setClickedCheckbox('barcode_exclude');
          }

          if (data.rule.items_strict_filter === 1) {
            setClickedCheckbox('barcode_strict');
          }

          reset({
            name: data.rule.name,
            orders: data.rule.no_of_orders,
            max_products_without_quantity_allowed: data.rule.max_products_without_quantity_allowed,
            min_product_items: data.rule.min_product_items,
            maxPicklists: data.rule.picklists_max_no,
            min_order_items: data.rule.min_order_items,
            tags: data.rule.tags.map((tag) => tag.tag).join(','),
            dateCheckbox: data.rule.exclude_dates === 1,
            itemsCheckbox: data.rule.exclude_items === 1 ? true : false,
            itemsStrictFilter: data.rule.items_strict_filter === 1 ? true : false,
            tagsCheckbox: data.rule.exclude_tags === 1,
            active: data.rule.active === 1,
            items: barcodeIds || [],
            partially_in_progress_orders: data.rule.partially_in_progress_orders,
            partially_fulfilled: data.rule.partially_fulfilled,
            sku_limit: data.rule.sku_limit || '', // Add sku_limit to reset
          });

          if (data?.rule?.max_products_without_quantity_allowed || data?.rule?.min_product_items) {
            setShowInputs(true);
          }

          setLoading(false);
        } catch (error) {
          console.error('API Error:', error);
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [location.search, reset]);

  return (
    <OverviewTabUI
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      errors={errors}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      filters={filters}
      updateFilters={updateFilters}
      setDatePickerChange={setDatePickerChange}
      control={control}
      tags1={tags1}
      setTags1={setTags1}
      setTagChange={setTagChange}
      handleTagDelete1={handleTagDelete1}
      tagInputValue1={tagInputValue1}
      handleTagInputChange1={handleTagInputChange1}
      handleTagInputKeyDown1={handleTagInputKeyDown1}
      discountCodes1={discountCodes1}
      setDiscountCodes1={setDiscountCodes1}
      setDiscountCodesChange={setDiscountCodesChange}
      handleDiscountCodesDelete1={handleDiscountCodesDelete1}
      handleDiscountCodesInputChange1={handleDiscountCodesInputChange1}
      handleDiscountCodesInputKeyDown1={handleDiscountCodesInputKeyDown1}
      options={options}
      filterOptions={filterOptions}
      loadSuggestions={loadSuggestions}
      clickedCheckbox={clickedCheckbox}
      checkboxState={checkboxState}
      handleCheckboxChange={handleCheckboxChange}
      setShowInputs={setShowInputs}
      setValue={setValue}
      showInputs={showInputs}
      register={register}
      clickedForButton={clickedForButton}
      loading={loading}
      checkId={checkId}
      isDirty={isDirty}
      inputTageDisable={inputTageDisabled}
      tagChange={tagChange}
      datePickerChange={datePickerChange}
      discountCodesChange={discountCodesChange}
      state={state}
      handleClose={handleClose}
    />
  );
};
