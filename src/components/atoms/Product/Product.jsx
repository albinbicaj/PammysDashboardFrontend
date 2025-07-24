import React from 'react';
import { convertToDE, getOperationType, getReasonLabel } from '../../../utils';
import { reklamationReasons } from '../../../data/reasons';
import { ReasonEnum } from '../../../enums/Reason.enum';
import { TextField } from '../../molecules';
import { operationTypes } from '../../../data/type';
import { DeleteIcon } from '../DeleteIcon/DeleteIcon';
import { TypeEnum } from '../../../enums/Type.enum';
import { useTranslation } from 'react-i18next';
import { Checkbox, Tooltip } from '@mui/material';
import { useOrderContext } from '../../../context/Order.context';

// TODO-RGNPCRZ-BUGFIX
// reasons structure is changed in general file, the below is previous version
// per momentin nuk ka nevoj kjo faqe me qen ne dy gjuhe, arsyet shfaqen vetem gjermanisht me reasons.label
const reasons = [
  {
    label: 'Grund',
    value: 0,
  },
  {
    label: 'zu klein',
    value: 1,
  },
  {
    label: 'zu groß',
    value: 2,
  },
  {
    label: 'gefällt mir nicht',
    value: 3,
  },
  // {
  //   label: 'Qualität nicht ausreichend',
  //   value: 4,
  // },
  {
    label: 'Lieferung zu spät',
    value: 6,
  },
  {
    label: 'Mangel / beschädigter Artikel',
    value: 5,
  },
  {
    label: 'Falschlieferung / fehlender Artikel',
    value: 7,
  },
];

export const Product = ({
  productId,
  selected,
  onClick,
  img,
  price,
  product,
  quantity,
  quantityDisabled,
  variant_info,
  reason,
  handleQuantity,
  disabledQuantitySelect,
  reasonChange,
  handleRemoveProduct,
  currentStep,
  maxQuantity,
  images,
  imagesData,
  comment,
  type,
  typeDisabled = false,
  typeChange,
  exchangeTitle,
  discount,
  reklamation,
}) => {
  const options = ['Quantity', ...Array.from({ length: maxQuantity }, (_, i) => i + 1)];
  const { t } = useTranslation();
  const { orderContext, updateMultipleFields } = useOrderContext();

  // const exchangePossible =
  //   reason == ReasonEnum.TOO_SMALL ||
  //   reason == ReasonEnum.TOO_LARGE ||
  //   reason == ReasonEnum.CHANGED_MY_MIND;

  // Below is improved verison of || logic
  const exchangePossible =
    reason == ReasonEnum.TOO_SMALL ||
    reason == ReasonEnum.TOO_LARGE ||
    reason == ReasonEnum.DONT_LIKE_IT;
  // the .includes uses === checking which creates the error on reason "2" and ReasonEnum being number
  // const exchangePossible = [ReasonEnum.TOO_SMALL, ReasonEnum.TOO_LARGE].includes(reason);

  return (
    <div onClick={onClick} className=" mt-2 flex flex-col ">
      <div className="flex justify-between">
        <div className="flex">
          <div className="image-wrapper ml-2">
            <img className="product-image" src={img} />
          </div>

          <div className="">
            {quantityDisabled ? (
              <span className="mr-2">{quantity}</span>
            ) : (
              <>
                {!quantityDisabled && (
                  <select
                    disabled={quantityDisabled}
                    value={quantity}
                    className={`select-quantity  ${disabledQuantitySelect ? '' : 'cursor-pointer'}`}
                    onChange={(e) => {
                      handleQuantity(productId, e.target.value);
                    }}
                  >
                    {options.map((option, index) => (
                      <option key={index} disabled={index === 0}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}
          </div>
          <div className={'product-info flex flex-col text-left'}>
            <span className="product">{product}</span>
            {variant_info && <span className="variant">{variant_info.title}</span>}
            <div>
              <span className="price">
                {quantity
                  ? convertToDE(price * quantity - discount)
                  : convertToDE(price - discount)}
              </span>{' '}
            </div>
          </div>
        </div>

        <div className="flex  items-start justify-end">
          {selected && handleRemoveProduct && (
            <div
              onClick={handleRemoveProduct}
              className="remove-product-button mr-2 flex items-center"
            >
              <DeleteIcon />
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 flex w-full flex-col items-end">
        <div className="  flex items-center gap-2">
          {currentStep === 1 && (
            <select
              // disabled={!selected}
              value={reason}
              onChange={(e) => {
                reasonChange(productId, e.target.value);
              }}
              className={`select-reason px-3 ${!selected ? 'w-80 cursor-default' : ''} ${
                reason == ReasonEnum.QUALITY_INSUFFICIENT || reason == ReasonEnum.DELIVERY_TOO_LATE
                  ? 'wider'
                  : ''
              } 
							${reason == ReasonEnum.DAMAGED || reason == ReasonEnum.MISDELIVERY ? 'wide' : ''}
							${reason == ReasonEnum.MISDELIVERY ? ' w-80' : ''}`}
            >
              {reklamation === true
                ? reklamationReasons.map((reason, index) => (
                    <option key={index} value={reason.value}>
                      {reason.label}
                      {/* {t('selectOptionReklamtionReason.' + reason.label)} */}
                    </option>
                  ))
                : reasons.map((reason, index) => (
                    <option key={index} value={reason.value}>
                      {reason.label}
                      {/* {t('selectOptionReasons.' + reason.label)} */}
                    </option>
                  ))}
            </select>
          )}
          {typeDisabled ? (
            <div className="flex">
              {currentStep === 2 && reason && (
                <div className="selected-reason font-bold">{getReasonLabel(reason)}</div>
              )}
              {reason == ReasonEnum.DAMAGED || reason == ReasonEnum.MISDELIVERY ? (
                reason == ReasonEnum.DAMAGED && (
                  <span className="reason-extra-tag">{t('product.textSupport')}</span>
                )
              ) : (
                <span className="reason-extra-info">
                  {type === TypeEnum.EXCHANGE
                    ? getOperationType(type) + ': ' + exchangeTitle
                    : getOperationType(type)}
                </span>
              )}
            </div>
          ) : (
            <div>
              {!typeDisabled && exchangePossible ? (
                <select
                  value={type}
                  className={`select-type px-3  ${!selected ? 'cursor-default' : ''}`}
                  onChange={(e) => typeChange(productId, e.target.value)}
                >
                  {operationTypes.map((operation, index) => (
                    <option key={index} value={operation.value}>
                      {t('product.' + operation.label)}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="">
                  {reason == ReasonEnum.DAMAGED && (
                    <span className="reason-extra-tag">{t('product.textSupport')}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {reason == 5 || reason == 7 ? (
        <div className="mt-3 text-left text-sm">
          <Checkbox
            color="default"
            onChange={() => {
              updateMultipleFields({
                package_damaged: !orderContext.package_damaged,
              });
            }}
            checked={orderContext.package_damaged}
          />
          {t('product.package_damaged_checkbox')}
        </div>
      ) : null}
      {comment && (
        <div className="product-feedback mt-2">
          <TextField
            label={t('returnProductsStep.noteSupport')}
            value={comment}
            className="disabled-comment"
            minRows={2}
          />
        </div>
      )}
      <div className="mt-2">
        {/* {images && images.length > 0 && (
          <div className="image-names-wrapper flex items-center justify-start">
            <span className="mr-2 font-bold text-black">Anhang:</span>
            <div className="flex flex-wrap">
              {images.map((_image, index) => (
                <span key={index} className="mr-3 font-bold">
                  Img{index + 1}.jpg,
                </span>
              ))}
            </div>
          </div>
        )} */}
        {images && images.length > 0 && (
          <div className="flex flex-col gap-3 bg-gray-100 p-2 text-start">
            <span className="mr-2 text-sm font-bold text-black">Anhang:</span>
            <div className="grid grid-cols-5 gap-4">
              {imagesData.map((image, index) => (
                <div className="relative flex flex-col items-center" key={index}>
                  <div key={index} className="group relative bg-white">
                    <img
                      className="aspect-square  border object-contain"
                      src={images[index]}
                      alt="Uploaded"
                    />
                  </div>
                  <Tooltip title={image.path} className="cursor-pointer" arrow>
                    <p className="w-full overflow-hidden truncate text-sm ">{image.path}</p>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
