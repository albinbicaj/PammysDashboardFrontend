import React from 'react';
import { Controller } from 'react-hook-form';
import {
  Alert,
  Autocomplete,
  Checkbox,
  Chip,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Typography } from '@mui/material';
import Select from 'react-select';
import { CustomDatePicker } from '../CustomDatePicker/CustomDatePicker';

function OverviewTabUI({
  handleSubmit,
  onSubmit,
  errors,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  filters,
  updateFilters,
  setDatePickerChange,
  control,
  tags1,
  setTags1,
  setTagChange,
  handleTagDelete1,
  tagInputValue1,
  handleTagInputChange1,
  handleTagInputKeyDown1,
  discountCodes1,
  setDiscountCodes1,
  setDiscountCodesChange,
  handleDiscountCodesDelete1,
  handleDiscountCodesInputChange1,
  handleDiscountCodesInputKeyDown1,
  options,
  filterOptions,
  loadSuggestions,
  clickedCheckbox,
  checkboxState,
  handleCheckboxChange,
  setShowInputs,
  setValue,
  showInputs,
  loading,
  register,
  checkId,
  clickedForButton,
  isDirty,
  inputTageDisabled,
  tagChange,
  datePickerChange,
  discountCodesChange,
  state,
  handleClose,
}) {
  return (
    <div>
      <div className="mt-5 flex flex-col gap-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-7  w-full border bg-white px-4 py-5 shadow"
        >
          <div className="flex flex-col items-start justify-start">
            <div className="flex w-full items-start justify-between gap-24">
              <div>
                <div className="mt-8 flex items-center justify-between gap-4">
                  <Typography variant="p" component="p">
                    Bezeichnung:
                  </Typography>
                  <div className="flex flex-col  items-start">
                    <input
                      {...register('name', { required: 'Dieses Feld ist erforderlich' })}
                      className="input min-h-10"
                    />

                    {errors.name?.message && (
                      <span className="text-sm text-red-500">{errors.name?.message}</span>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                  <Typography variant="p" component="p">
                    Bestellungen:
                  </Typography>
                  <div className="flex flex-col  items-start">
                    <input
                      type="number"
                      {...register('orders', { required: 'Dieses Feld ist erforderlich' })}
                      className="input min-h-10"
                    />
                    <span className="text-sm text-red-500">{errors.orders?.message}</span>
                  </div>
                </div>

                {/* Max. number of picklists */}
                <div className="my-8 flex items-center justify-between gap-4">
                  <Typography variant="p" component="p" sx={{ width: '200px' }}>
                    Maximale Anzahl von Auswahllisten:
                  </Typography>
                  <div className="flex flex-col">
                    <input
                      type="number"
                      {...register('maxPicklists', { required: 'Dieses Feld ist erforderlich' })}
                      className="input min-h-10"
                    />
                    <span className="text-sm text-red-500">{errors.maxPicklists?.message}</span>
                  </div>
                </div>
                <div className="my-8 flex items-center justify-between gap-4">
                  <Typography variant="p" component="p" sx={{ width: '200px' }}>
                    Maximale Bestellmenge:
                  </Typography>
                  <div className="flex flex-col">
                    <input
                      type="number"
                      {...register('min_order_items')}
                      className="input min-h-10"
                    />
                    <span className="text-sm text-red-500">{errors.min_order_items?.message}</span>
                  </div>
                </div>
                <div className="mt-8 flex items-center">
                  <Typography variant="p" component="p" sx={{ width: '120px' }}>
                    Datum:
                  </Typography>
                  <div className="flex gap-4">
                    <CustomDatePicker
                      startDate={startDate ? new Date(startDate) : null}
                      setStartDate={setStartDate}
                      endDate={endDate ? new Date(endDate) : null}
                      setEndDate={setEndDate}
                      filters={filters}
                      updateFilters={updateFilters}
                      setDatePickerChange={setDatePickerChange}
                    />
                    {/* Checkbox */}
                    <Controller
                      name="dateCheckbox"
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
              </div>

              <div>
                {/* Tags */}
                <div className="mt-8 flex items-center justify-between">
                  <Typography variant="p" component="p" sx={{ minWidth: '120px' }}>
                    Tags:
                  </Typography>
                  <div className="flex w-full flex-col">
                    <div className="flex">
                      <Autocomplete
                        multiple
                        options={[]}
                        id="tags-filled"
                        value={tags1}
                        fullWidth
                        freeSolo
                        onChange={(event, newValue) => {
                          setTags1(newValue);
                          setTagChange(true);
                        }}
                        className="input__tag-wrapper"
                        renderTags={(value, getTagProps) =>
                          (value || []).map((option, index) => {
                            // console.log('option', option);
                            return (
                              <Chip
                                key={index}
                                variant="outlined"
                                label={option.tag ? option.tag : option}
                                onDelete={() => handleTagDelete1(option)}
                                {...getTagProps({ index })}
                              />
                            );
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            placeholder="Tags hinzufügen"
                            value={tagInputValue1}
                            onChange={(e) => handleTagInputChange1(e.target.value)}
                            onKeyDown={(e) => handleTagInputKeyDown1(e.key)}
                          />
                        )}
                      />
                      <Controller
                        name="tagsCheckbox"
                        control={control}
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
                    {errors.tags?.message && (
                      <span className="text-sm text-red-500">{errors.tags?.message}</span>
                    )}
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <Typography variant="p" component="p" sx={{ minWidth: '120px' }}>
                    Discount Codes:
                  </Typography>
                  <div className="flex w-full flex-col">
                    <div className="flex">
                      <Autocomplete
                        multiple
                        options={[]}
                        id="tags-filled"
                        value={discountCodes1}
                        fullWidth
                        freeSolo
                        onChange={(event, newValue) => {
                          setDiscountCodes1(newValue);
                          setDiscountCodesChange(true);
                        }}
                        className="input__tag-wrapper"
                        renderTags={(value, getTagProps) =>
                          (value || []).map((option, index) => {
                            // console.log('option', option);
                            return (
                              <Chip
                                key={index}
                                variant="outlined"
                                label={option.tag ? option.tag : option}
                                onDelete={() => handleDiscountCodesDelete1(option)}
                                {...getTagProps({ index })}
                              />
                            );
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            placeholder="Tags hinzufügen"
                            value={tagInputValue1}
                            onChange={(e) => handleDiscountCodesInputChange1(e.target.value)}
                            onKeyDown={(e) => handleDiscountCodesInputKeyDown1(e.key)}
                          />
                        )}
                      />
                    </div>
                    {errors.tags?.message && (
                      <span className="text-sm text-red-500">{errors.tags?.message}</span>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="mt-8 flex items-center justify-between">
                  <Typography variant="p" component="p" sx={{ minWidth: '120px' }}>
                    Artikel:
                  </Typography>
                  <div className="flex w-full flex-col">
                    <div className="flex">
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
                                  width: '300px',
                                }),
                                indicatorsContainer: (provided) => ({
                                  ...provided,
                                  height: '42px',
                                }),
                              }}
                              {...field}
                              isClearable
                              isMulti
                              isSearchable
                              placeholder="Tippen Sie für die Suche..."
                              options={options}
                              closeMenuOnSelect={false}
                              filterOption={filterOptions}
                              onInputChange={(inputValue, { action }) => {
                                if (action === 'input-change') {
                                  loadSuggestions(inputValue, () => {});
                                }
                              }}
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
                                    : ''
                                : 'test'}
                            </Typography>
                          </div>
                        )}
                      />

                      {/* <Controller
                      name="itemsCheckbox"
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
                    /> */}

                      <div className="mb-5 flex">
                        <Controller
                          name="itemsCheckbox"
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
                          name="itemsStrictFilter"
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

                <div className="my-8 flex items-center gap-1">
                  <Typography variant="p" component="p" sx={{ width: '23%' }}>
                    Limit SKU:
                  </Typography>
                  <div className="flex flex-col">
                    <input type="number" {...register('sku_limit')} className="input min-h-10" />
                    <span className="text-sm text-red-500">{errors.sku_limit?.message}</span>
                  </div>
                </div>

                <div className=" mt-4 flex items-center ">
                  <Typography variant="p" component="p">
                    Aktiv:
                  </Typography>
                  <div className="w-[240px] ">
                    <Controller
                      name="active"
                      control={control}
                      defaultValue={false}
                      rules={{ required: false }}
                      render={({ field }) => <Checkbox {...field} checked={field.value ?? false} />}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2 mt-4 flex items-center justify-between">
              <Typography variant="p" component="p">
                Eingaben anzeigen:
              </Typography>
              <div className="w-[240px] ">
                <Controller
                  name="partially_fulfilled"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        field.onChange(isChecked);
                        setShowInputs(isChecked);
                        if (isChecked) {
                          setValue('partially_in_progress_orders', false);
                        }
                      }}
                    />
                  )}
                />
              </div>
            </div>

            {showInputs && (
              <>
                <div className="my-3 flex items-center justify-between">
                  <Typography variant="p" component="p" sx={{ width: '200px' }}>
                    Maximal zulässiges Produkt ohne Menge:
                  </Typography>
                  <div className="flex flex-col">
                    <input
                      type="number"
                      {...register('max_products_without_quantity_allowed', {
                        required: 'Dieses Feld ist erforderlich',
                      })}
                      className="input min-h-10"
                    />
                    <span className="text-sm text-red-500">
                      {errors.max_products_without_quantity_allowed?.message}
                    </span>
                  </div>
                </div>

                <div className="my-3 flex items-center justify-between">
                  <Typography variant="p" component="p" sx={{ width: '200px' }}>
                    Mindestbestellmengen:
                  </Typography>
                  <div className="flex flex-col">
                    <input
                      type="number"
                      {...register('min_product_items', {
                        required: 'Dieses Feld ist erforderlich',
                      })}
                      className="input min-h-10"
                    />
                    <span className="text-sm text-red-500">
                      {errors.min_product_items?.message}
                    </span>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <Typography variant="p" component="p">
                Laufende Aufträge:
              </Typography>
              <div className="w-[240px] ">
                <Controller
                  name="partially_in_progress_orders"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        field.onChange(isChecked);
                        if (isChecked) {
                          setValue('partially_fulfilled', false);
                          setShowInputs(false);
                        }
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Tooltip
              placement="top"
              title={
                checkId &&
                !isDirty &&
                !inputTageDisabled &&
                !tagChange &&
                !datePickerChange &&
                !discountCodesChange
                  ? 'Kommissionierlistenregel aktualisieren'
                  : null
              }
            >
              <button
                className="btn btn-primary flex items-center gap-1"
                disabled={
                  loading ||
                  (checkId &&
                    !isDirty &&
                    !inputTageDisabled &&
                    !tagChange &&
                    !datePickerChange &&
                    !clickedForButton &&
                    !discountCodesChange)
                }
              >
                {checkId ? 'Speichern Sie' : 'Einreichen'}
              </button>
            </Tooltip>
          </div>
        </form>

        <Stack className="bg-button" spacing={2} sx={{ width: '100%' }}>
          <Snackbar
            sx={{
              '& .MuiPaper-root': {
                color: '#fff',
                backgroundColor: 'rgb(74, 222, 128)',
                padding: '20px',
              },
            }}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={state.open}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert severity={'success'}>
              <div className="flex gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  color="#ffffff"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-rosette-discount-check"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" />
                  <path d="M9 12l2 2l4 -4" />
                </svg>
                <div>
                  <p className={`text-lg text-white`}>Erfolgreich!</p>
                </div>
              </div>
            </Alert>
          </Snackbar>
        </Stack>
      </div>
    </div>
  );
}

export default OverviewTabUI;
