import { Chip, Collapse, Switch, Typography } from '@mui/material';

import React from 'react';
import { Controller } from 'react-hook-form';
import Select from 'react-select';
import { CustomDatePicker } from '../CustomDatePicker/CustomDatePicker';

export const OrdersFormContentV3 = ({
  tags1,
  control,
  errors,
  startDate,
  endDate,
  filters,
  updateFilters,
  selectedArticles,
  selectedAddress,
  selectedMonitor,
  paymentMethod,
  shippingMethod,
  statusMethod,
  incomingStock,
  tagInputValue1,
  options,
  filterOptions,
  handleArticleChange,
  clickedCheckbox,
  checkboxState,
  handleCheckboxChange,
  loadSuggestions,
  handleTagInputKeyDown1,
  setTags1,
  setSelectedDateRange,
  setStartDate,
  setEndDate,
  setSelectedAddress,
  setSelectedMonitor,
  setPaymentMethod,
  setStatusMethod,
  setShippingMethod,
  setIncomingStock,
  handleTagInputChange1,
}) => {
  const updateFilter = (field) => updateFilters(field);

  const handleTagsChange = (newValue) => {
    setTags1(newValue);
    updateFilter({ tags: newValue.join(',') });
  };

  const handleTagExcludeChange = (checked) => updateFilter({ tag_exclude: checked });

  return (
    <>
      <div className="flex justify-between">
        {/* DATE PICKER */}
        <div className="w-1/35 flex">
          <div className="mt-2 flex-col items-center">
            <span className="pb-4 pl-4 font-semibold">Date:</span>
            <CustomDatePicker
              startDate={startDate}
              endDate={endDate}
              setStartDate={(date) => {
                setSelectedDateRange((prev) => ({ ...prev, startDate: date }));
                setStartDate(date);
                updateFilter({ start_date: date });
              }}
              setEndDate={(date) => {
                setSelectedDateRange((prev) => ({ ...prev, endDate: date }));
                setEndDate(date);
                updateFilter({ end_date: date });
              }}
              filters={filters}
              updateFilters={updateFilters}
              useLegacyDatePicker
            />
          </div>
          <Controller
            name="date_exclude"
            control={control}
            defaultValue={filters.date_exclude}
            render={({ field }) => (
              <Tooltip title="ausschließen" placement="top" arrow>
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                    updateFilter({ date_exclude: e.target.checked });
                  }}
                />
              </Tooltip>
            )}
          />
        </div>

        {/* TAGS */}
        <div className="w-1/4">
          <div className="mt-[10.5px]">
            <span className="pb-4 font-semibold">Tags:</span>
            <Autocomplete
              multiple
              options={[]}
              value={tags1}
              freeSolo
              onChange={(e, v) => handleTagsChange(v)}
              renderTags={(value, getTagProps) =>
                value.map((option, i) => (
                  <Chip
                    key={i}
                    variant="outlined"
                    label={option}
                    onDelete={() => {
                      const nv = tags1.filter((t) => t !== option);
                      handleTagsChange(nv);
                    }}
                    {...getTagProps({ index: i })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="filled"
                  placeholder="Tags hinzufügen"
                  value={tagInputValue1}
                  onChange={(e) => handleTagInputChange1(e.target.value)}
                  onKeyDown={(e) => handleTagInputKeyDown1(e.key)}
                  sx={{ '& .MuiFilledInput-root': { borderRadius: '5px !important' } }}
                />
              )}
            />
            <Controller
              name="tag_exclude"
              control={control}
              defaultValue={filters.tag_exclude}
              render={({ field }) => (
                <Tooltip title="ausschließen" placement="top" arrow>
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      handleTagExcludeChange(e.target.checked);
                    }}
                  />
                </Tooltip>
              )}
            />
            {errors.tags1 && <span className="text-red-500">{errors.tags1.message}</span>}
          </div>

          {/* ARTIKEL */}
          <div className="mt-8">
            <span className="pb-4 font-semibold">Artikel:</span>
            <Controller
              name="barcode"
              control={control}
              defaultValue={filters.barcode}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  isMulti
                  options={options}
                  filterOption={filterOptions}
                  placeholder="Tippen Sie für die Suche..."
                  onInputChange={(val, { action }) => {
                    if (action === 'input-change') loadSuggestions(val, () => {});
                  }}
                  onChange={(value) => {
                    handleArticleChange(value);
                    updateFilter({ barcode: value ? value.map((v) => v.value).join(',') : '' });
                  }}
                  styles={{
                    container: (provided) => ({ ...provided, width: '250px' }),
                    indicatorsContainer: (provided) => ({ ...provided, height: '42px' }),
                    control: (provided) => ({ ...provided, borderRadius: '5px' }),
                  }}
                />
              )}
            />
            <Controller
              name="barcode_exclude"
              control={control}
              defaultValue={filters.barcode_exclude}
              render={({ field }) => (
                <Tooltip title="ausschließen" placement="top" arrow>
                  <Checkbox
                    checked={checkboxState.barcode_exclude}
                    onChange={(e) => {
                      handleCheckboxChange('barcode_exclude')(e);
                      updateFilter({ barcode_exclude: e.target.checked });
                    }}
                  />
                </Tooltip>
              )}
            />
            <Controller
              name="barcode_strict"
              control={control}
              defaultValue={filters.barcode_strict}
              render={({ field }) => (
                <Tooltip title="Strenger Filter für Artikel" placement="top" arrow>
                  <Checkbox
                    checked={checkboxState.barcode_strict}
                    onChange={(e) => {
                      handleCheckboxChange('barcode_strict')(e);
                      updateFilter({ barcode_strict: e.target.checked });
                    }}
                  />
                </Tooltip>
              )}
            />
            {errors.items && <span className="text-red-500">{errors.items.message}</span>}
          </div>

          {/* ADDRESS */}
          <div className="mt-4">
            <span className="pb-4 font-semibold">Adresse filtern:</span>
            <Controller
              name="filter_address"
              control={control}
              defaultValue={filters.filter_address}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  options={[
                    { value: true, label: 'Richtig' },
                    { value: false, label: 'Falsch' },
                  ]}
                  placeholder="Wählen Sie eine..."
                  onChange={(opt) => {
                    setSelectedAddress(opt);
                    field.onChange(opt ? opt.value : null);
                    updateFilter({ filter_address: opt ? opt.value : null });
                  }}
                  styles={{
                    container: (p) => ({ ...p, width: '250px' }),
                    indicatorsContainer: (p) => ({ ...p, height: '42px' }),
                  }}
                  value={selectedAddress}
                />
              )}
            />
          </div>

          {/* MONITOR */}
          <div className="mt-8">
            <span className="pb-4 font-semibold">Filterbestand:</span>
            <Controller
              name="monitor"
              control={control}
              defaultValue={filters.monitor}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  options={[
                    { value: true, label: 'Richtig' },
                    { value: false, label: 'Falsch' },
                  ]}
                  placeholder="Wählen Sie eine..."
                  onChange={(opt) => {
                    setSelectedMonitor(opt);
                    field.onChange(opt ? opt.value : null);
                    updateFilter({ monitor: opt ? opt.value : null });
                  }}
                  styles={{
                    container: (p) => ({ ...p, width: '250px' }),
                    indicatorsContainer: (p) => ({ ...p, height: '42px' }),
                  }}
                  value={selectedMonitor}
                />
              )}
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-1/3">
          {[
            {
              label: 'Zahlungsmethode',
              name: 'paymentMethod',
              filterKey: 'payment_method',
              value: paymentMethod,
              setter: setPaymentMethod,
              options: [
                { value: '', label: 'Alle' },
                { value: 'amazon', label: 'Amazon' },
                { value: 'gift_card', label: 'Gift_card' },
                { value: 'klarna', label: 'Klarna' },
                { value: 'manual', label: 'Manual' },
                { value: 'mollie', label: 'Mollie' },
                { value: 'paypal', label: 'Paypal' },
                { value: 'invoice', label: 'Invoice' },
                { value: 'shopify', label: 'Shopify' },
              ],
            },
            {
              label: 'Status',
              name: 'status',
              filterKey: 'status',
              multi: true,
              value: statusMethod,
              setter: setStatusMethod,
              options: [
                { value: '', label: 'Alle' },
                { value: 'canceled', label: 'Canceled' },
                { value: 'open', label: 'Open' },
                { value: 'completed', label: 'Abgeschlossen' },
              ],
            },
            {
              label: 'Versandart',
              name: 'shippingMethod',
              filterKey: 'shipping_method',
              value: shippingMethod,
              setter: setShippingMethod,
              options: [
                { value: '', label: 'Alle' },
                { value: 'dhl_paket', label: 'DHL Paket' },
                { value: 'dhl_paget_international', label: 'DHL Paket International' },
              ],
            },
            {
              label: 'Eingehender Bestand',
              name: 'incomingStock',
              filterKey: 'incoming_stock',
              value: incomingStock,
              setter: setIncomingStock,
              options: [
                { value: true, label: 'Richtig' },
                { value: false, label: 'Falsch' },
              ],
            },
          ].map(({ label, filterKey, value, setter, options, multi }) => (
            <div key={filterKey} className="mt-8">
              <span className="pb-4 font-semibold">{label}:</span>
              <div className="flex items-center">
                <Controller
                  name={filterKey}
                  control={control}
                  defaultValue={filters[filterKey]}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isClearable
                      isMulti={!!multi}
                      options={options}
                      placeholder="Tippen Sie für die Suche..."
                      onChange={(opt) => {
                        setter(opt);
                        const val = multi
                          ? opt
                            ? opt.map((o) => o.value).join(',')
                            : ''
                          : opt?.value ?? '';
                        field.onChange(val);
                        updateFilter({ [filterKey]: val });
                      }}
                      styles={{
                        container: (p) => ({ ...p, width: '250px' }),
                        indicatorsContainer: (p) => ({ ...p, height: '42px' }),
                        control: (p) => ({ ...p, borderRadius: '5px' }),
                      }}
                      value={value}
                    />
                  )}
                />
                <Controller
                  name={`${filterKey}_exclude`}
                  control={control}
                  defaultValue={filters[`${filterKey}_exclude`]}
                  render={({ field }) => (
                    <Tooltip title="ausschließen" placement="top" arrow>
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                          updateFilter({ [`${filterKey}_exclude`]: e.target.checked });
                        }}
                      />
                    </Tooltip>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
