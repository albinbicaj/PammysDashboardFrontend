import { Autocomplete, Checkbox, Chip, TextField, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';
import Select from 'react-select';
import { CustomDatePicker } from '../CustomDatePicker/CustomDatePicker';

export const OrdersFormContent = ({
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
  return (
    <>
      <div className="flex justify-between">
        <div className="w-1/35 flex">
          <div className="mt-2 flex-col items-center">
            <span className="pb-4 pl-4 font-semibold">Date:</span>
            <CustomDatePicker
              startDate={startDate}
              setStartDate={(date) => {
                setSelectedDateRange((prev) => ({ ...prev, startDate: date }));
                setStartDate(date);
              }}
              endDate={endDate}
              setEndDate={(date) => {
                setSelectedDateRange((prev) => ({ ...prev, endDate: date }));
                setEndDate(date);
              }}
              filters={filters}
              updateFilters={updateFilters}
              useLegacyDatePicker
            />
          </div>
          <Controller
            name="date_exclude"
            control={control}
            defaultValue={false}
            rules={{ required: false }}
            render={({ field }) => (
              <div className="flex items-center pb-[201px] text-sm">
                <Tooltip title="ausschließen" placement="top" arrow>
                  <Checkbox {...field} checked={field.value ?? false} />
                </Tooltip>
              </div>
            )}
          />
        </div>
        <div className="w-1/4">
          <div className="mt-[10.5px] flex-col items-center justify-between">
            <span className="pb-4 font-semibold">Tags:</span>
            <div className="flex w-full flex-col">
              <div className="flex items-start">
                <Autocomplete
                  multiple
                  options={[]}
                  id="tags-filled"
                  value={tags1}
                  fullWidth
                  freeSolo
                  onChange={(event, newValue) => {
                    setTags1(newValue);
                  }}
                  className="input__tag-wrapper"
                  renderTags={(value, getTagProps) => {
                    return value.map((option, index) => (
                      <Chip
                        key={index}
                        variant="outlined"
                        label={option}
                        onDelete={() => handleTagDelete1(option)}
                        {...getTagProps({ index })}
                      />
                    ));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="filled"
                      placeholder="Tags hinzufügen"
                      value={tagInputValue1}
                      onChange={(e) => handleTagInputChange1(e.target.value)}
                      onKeyDown={(e) => handleTagInputKeyDown1(e.key)}
                      sx={{
                        '& .MuiFilledInput-root': {
                          borderRadius: '5px !important',
                        },
                      }}
                    />
                  )}
                />
                <div className="flex">
                  <Controller
                    name="tag_exclude"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div className="mr-10 flex items-center text-sm">
                        <Tooltip title="ausschließen" placement="top" arrow>
                          <Checkbox {...field} checked={field.value ?? false} />
                        </Tooltip>
                      </div>
                    )}
                  />
                </div>
              </div>
              {errors.tags1?.message && (
                <span className="text-sm text-red-500">{errors.tags1?.message}</span>
              )}
            </div>
          </div>
          <div className="mt-8 flex-col items-center justify-between">
            <span className="pb-4 font-semibold">Artikel:</span>
            <div className="flex w-full flex-col">
              <div className="flex items-center">
                <Controller
                  name="items"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <div className="flex flex-col">
                      <Select
                        styles={{
                          container: (provided) => ({
                            ...provided,
                            width: '250px',
                          }),
                          indicatorsContainer: (provided) => ({
                            ...provided,
                            height: '42px',
                          }),
                          control: (provided) => ({
                            ...provided,
                            borderRadius: '5px',
                          }),
                        }}
                        {...field}
                        isClearable
                        value={selectedArticles}
                        isMulti
                        isSearchable
                        placeholder="Tippen Sie für die Suche..."
                        options={options}
                        filterOption={filterOptions}
                        closeMenuOnSelect={false}
                        onInputChange={(inputValue, { action }) => {
                          if (action === 'input-change') {
                            loadSuggestions(inputValue, () => {});
                          }
                        }}
                        onChange={handleArticleChange}
                      />
                      <Typography
                        className={clickedCheckbox ? 'visible' : 'invisible'}
                        fontSize="12px"
                      >
                        {clickedCheckbox
                          ? clickedCheckbox === 'barcode_exclude'
                            ? 'Ausschließen'
                            : clickedCheckbox === 'barcode_strict'
                              ? 'Strenger Filter für Artikel'
                              : 'test'
                          : 'test'}
                      </Typography>
                    </div>
                  )}
                />
                <div className="mb-5 flex flex-col order:max-w-[1600px] order:flex-row">
                  <Controller
                    name="barcode_exclude"
                    control={control}
                    defaultValue={false}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div className="flex items-center text-sm">
                        <Tooltip title="ausschließen" placement="top" arrow>
                          <Checkbox
                            {...field}
                            checked={checkboxState.barcode_exclude}
                            onChange={handleCheckboxChange('barcode_exclude')}
                          />
                        </Tooltip>
                      </div>
                    )}
                  />

                  <Controller
                    name="barcode_strict"
                    control={control}
                    defaultValue={false}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <div className="flex items-center">
                        <Tooltip title="Strenger Filter für Artikel" placement="top" arrow>
                          <Checkbox
                            {...field}
                            checked={checkboxState.barcode_strict}
                            onChange={handleCheckboxChange('barcode_strict')}
                          />
                        </Tooltip>
                      </div>
                    )}
                  />
                </div>
              </div>
              <span className="text-sm text-red-500">{errors.items?.message}</span>
            </div>
          </div>
          <div className="mt-4 flex-col items-center">
            <span className="pb-4 font-semibold">Adresse filtern:</span>
            <div className="flex items-center gap-4">
              <div>
                <Controller
                  name="filter_address"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <Select
                      styles={{
                        container: (provided) => ({
                          ...provided,
                          width: '250px',
                        }),
                        indicatorsContainer: (provided) => ({
                          ...provided,
                          height: '42px',
                        }),
                      }}
                      {...field}
                      isClearable
                      isSearchable
                      placeholder="Wählen Sie eine..."
                      options={[
                        { value: 1, label: 'Richtig' },
                        { value: 0, label: 'Falsch' },
                      ]}
                      onChange={(selectedOption) => {
                        setSelectedAddress(selectedOption);
                        field.onChange(selectedOption?.value);
                      }}
                      value={selectedAddress} // Set the value prop here
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div className="mt-[32px] flex-col items-center">
            <span className="pb-4 font-semibold">Filterbestand:</span>
            <div className="flex items-center gap-4">
              <div>
                <Controller
                  name="filter_monitor"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <Select
                      styles={{
                        container: (provided) => ({
                          ...provided,
                          width: '250px',
                        }),
                        indicatorsContainer: (provided) => ({
                          ...provided,
                          height: '42px',
                        }),
                      }}
                      {...field}
                      isClearable
                      isSearchable
                      placeholder="Wählen Sie eine..."
                      onChange={(selectedOption) => {
                        setSelectedMonitor(selectedOption);
                        field.onChange(selectedOption?.value);
                      }}
                      value={selectedMonitor}
                      options={[
                        { value: true, label: 'Richtig' },
                        { value: false, label: 'Falsch' },
                      ]}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/3">
          <div className="mt-2 flex-col items-center ">
            <span className="pb-4 font-semibold">Zahlungsmethode:</span>
            <div className="flex items-center">
              <Controller
                name="paymentMethod"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <Select
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: '250px',
                      }),
                      indicatorsContainer: (provided) => ({
                        ...provided,
                        height: '42px',
                      }),
                      control: (provided) => ({
                        ...provided,
                        borderRadius: '5px',
                      }),
                    }}
                    {...field}
                    isClearable
                    isSearchable
                    onChange={(selectedOption) => {
                      setPaymentMethod(selectedOption);
                      field.onChange(selectedOption?.value);
                    }}
                    value={paymentMethod}
                    placeholder="Tippen Sie für die Suche..."
                    options={[
                      { value: '', label: 'Alle' },
                      { value: 'amazon', label: 'Amazon' },
                      { value: 'gift_card', label: 'Gift_card' },
                      { value: 'klarna', label: 'Klarna' },
                      { value: 'manual', label: 'Manual' },
                      { value: 'mollie', label: 'Mollie' },
                      { value: 'paypal', label: 'Paypal' },
                      { value: 'invoice', label: 'Invoice' },
                      { value: 'shopify', label: 'Shopify' },
                    ]}
                  />
                )}
              />
              {/* Checkbox */}
              <Controller
                name="payment_exclude"
                control={control}
                defaultValue={false}
                rules={{ required: false }}
                render={({ field }) => (
                  <div className="flex items-center text-sm">
                    <Tooltip title="ausschließen" placement="top" arrow>
                      <Checkbox {...field} checked={field.value ?? false} />
                    </Tooltip>
                  </div>
                )}
              />{' '}
            </div>
          </div>
          <div className="mt-8 flex-col items-center ">
            <span className="pb-4 font-semibold">Status:</span>
            <div className="flex items-center">
              <Controller
                name="status"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <Select
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: '250px',
                      }),
                      indicatorsContainer: (provided) => ({
                        ...provided,
                        height: '42px',
                      }),
                      control: (provided) => ({
                        ...provided,
                        borderRadius: '5px',
                      }),
                    }}
                    {...field}
                    isMulti
                    isClearable
                    isSearchable
                    onChange={(selectedOption) => {
                      setStatusMethod(selectedOption);
                      field.onChange(selectedOption?.value);
                    }}
                    value={statusMethod}
                    placeholder="Tippen Sie für die Suche..."
                    options={[
                      { value: '', label: 'Alle' },
                      { value: 'canceled', label: 'Canceled' },
                      { value: 'open', label: 'Open' },
                      { value: 'completed', label: 'Abgeschlossen' },
                    ]}
                  />
                )}
              />
              <Controller
                name="status_exclude"
                control={control}
                defaultValue={false}
                rules={{ required: false }}
                render={({ field }) => (
                  <div className="flex items-center text-sm">
                    <Tooltip title="ausschließen" placement="top" arrow>
                      <Checkbox {...field} checked={field.value ?? false} />
                    </Tooltip>
                  </div>
                )}
              />{' '}
            </div>
          </div>
          <div className="mt-[34px] flex-col items-center ">
            <span className="pb-4 font-semibold">VersandartShipping method:</span>
            <div className="flex items-center">
              <Controller
                name="shippingMethod"
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <Select
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: '250px',
                      }),
                      indicatorsContainer: (provided) => ({
                        ...provided,
                        height: '42px',
                      }),
                      control: (provided) => ({
                        ...provided,
                        borderRadius: '5px',
                      }),
                    }}
                    {...field}
                    isClearable
                    isSearchable
                    onChange={(selectedOption) => {
                      setShippingMethod(selectedOption);
                      field.onChange(selectedOption?.value);
                    }}
                    value={shippingMethod}
                    placeholder="Tippen Sie für die Suche..."
                    options={[
                      { value: '', label: 'Alle' },
                      { value: 'dhl_paket', label: 'DHL Paket' },
                      { value: 'dhl_paget_international', label: 'DHL Paket International' },
                    ]}
                  />
                )}
              />
              {/* Checkbox */}
              <Controller
                name="shipping_method_exclude"
                control={control}
                defaultValue={false}
                rules={{ required: false }}
                render={({ field }) => (
                  <div className="flex items-center text-sm">
                    <Tooltip title="ausschließen" placement="top" arrow>
                      <Checkbox {...field} checked={field.value ?? false} />
                    </Tooltip>
                  </div>
                )}
              />
            </div>
          </div>
          <div className="mt-8 flex-col items-center">
            <span className="pb-4 font-semibold">Eingehender Bestand:</span>
            <div className="flex items-center">
              <div>
                <Controller
                  name="incoming_stock"
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <Select
                      styles={{
                        container: (provided) => ({
                          ...provided,
                          width: '250px',
                        }),
                        indicatorsContainer: (provided) => ({
                          ...provided,
                          height: '42px',
                        }),
                        control: (provided) => ({
                          ...provided,
                          borderRadius: '5px',
                        }),
                      }}
                      {...field}
                      isClearable
                      isSearchable
                      placeholder="Wählen Sie eine..."
                      onChange={(selectedOption) => {
                        setIncomingStock(selectedOption);
                        field.onChange(selectedOption?.value);
                      }}
                      value={incomingStock}
                      options={[
                        { value: true, label: 'Richtig' },
                        { value: false, label: 'Falsch' },
                      ]}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
