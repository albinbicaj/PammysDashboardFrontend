import { useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { PammysLoading } from '../../atoms/PammysLoading/PammysLoading';
import { AnimatePresence, motion } from 'framer-motion';

const reasons = {
  1: 'Zu klein',
  2: 'Zu groß',
  3: 'Gefällt mir nicht',
  4: 'Qualität unzureichend',
  5: 'Beschädigt',
  6: 'Lieferung zu spät',
  7: 'Falschlieferung / fehlender Artikel',
};

export const HomePageTabContent = ({ variants, loading, returnReasons, soldItems }) => {
  const [expandedProducts, setExpandedProducts] = useState({});

  const toggleExpand = (productName) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productName]: !prev[productName],
    }));
  };

  if (loading) {
    return (
      <div className="flex h-32 w-full items-center justify-center bg-white">
        <PammysLoading />
      </div>
    );
  }

  const calculateTotals = (productVariants) => {
    return productVariants.reduce(
      (totals, variant) => {
        totals.count_return += Number(variant.count_return);
        totals.count_wrong += Number(variant.count_wrong);
        totals.count_exchange += Number(variant.count_exchange);
        return totals;
      },
      { count_return: 0, count_wrong: 0, count_exchange: 0 },
    );
  };

  const calculateReasonTotals = (productVariants) => {
    const reasonTotals = {};
    productVariants.forEach((variant) => {
      Object.entries(variant.reasons).forEach(([key, value]) => {
        if (!reasonTotals[key]) {
          reasonTotals[key] = 0;
        }
        reasonTotals[key] += Number(value);
      });
    });
    return reasonTotals;
  };

  const calculateSoldTotals = (productName) => {
    return soldItems
      .filter((item) => item.product_name === productName)
      .reduce((total, item) => total + Number(item.total_count), 0);
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="text-2xl font-bold text-gray-500">Return reasons</div>
        <div className="grid grid-cols-4 gap-4">
          {Object.keys(returnReasons[0].reasons).map((index) => (
            <div key={index} className="border bg-white p-4">
              <span className="text-xl font-semibold">{returnReasons[0].reasons[index]}</span>
              <p>{reasons[index]}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="text-2xl font-bold text-gray-500">Meist retournierte Artikel</div>
        <div className="grid grid-cols-1 gap-3">
          {loading ? (
            <PammysLoading />
          ) : (
            Object.entries(variants).map(([productName, productVariants]) => {
              const totals = calculateTotals(productVariants);
              const reasonTotals = calculateReasonTotals(productVariants);
              const soldTotal = calculateSoldTotals(productName);

              return (
                <div key={productName} className="border bg-white p-4">
                  <div
                    className="flex cursor-pointer items-center justify-between"
                    onClick={() => toggleExpand(productName)}
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{productName}</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.entries(reasonTotals).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center gap-2 rounded-sm border-2 border-[#FFCC66] bg-white px-3 py-1 text-xs font-medium text-black"
                          >
                            <span>{reasons[key]}</span>
                            <span className="rounded bg-[#FFCC66] px-2 text-sm font-bold text-[#000]">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex w-[330px] justify-between gap-4 text-center text-sm text-gray-600">
                      <div className="w-[100px] border bg-[#f3f4f6] p-2 shadow-sm">
                        <p className="text-lg font-bold text-[#000]">{totals.count_return}</p>
                        <p className="text-[#000]">
                          Retouren (
                          {isFinite((totals.count_return / soldTotal) * 100)
                            ? `${((totals.count_return / soldTotal) * 100).toFixed(2)}%`
                            : '-'}
                          )
                        </p>
                      </div>
                      <div className="w-[100px] border bg-[#f3f4f6] p-2 shadow-sm">
                        <p className="text-lg font-bold text-[#000]">{totals.count_wrong}</p>
                        <p className="text-[#000]">
                          Erstattungen (
                          {isFinite((totals.count_wrong / soldTotal) * 100)
                            ? `${((totals.count_wrong / soldTotal) * 100).toFixed(2)}%`
                            : '-'}
                          )
                        </p>
                      </div>
                      <div className="w-[100px] border bg-[#f3f4f6] p-2 shadow-sm">
                        <p className="text-lg font-bold text-[#000]">{totals.count_exchange}</p>
                        <p className="text-[#000]">
                          Umtausche (
                          {isFinite((totals.count_exchange / soldTotal) * 100)
                            ? `${((totals.count_exchange / soldTotal) * 100).toFixed(2)}%`
                            : '-'}
                          )
                        </p>
                      </div>
                    </div>
                    <div className="w-8 text-right">
                      <button className="text-[#000]">
                        {expandedProducts[productName] ? <FaArrowUp /> : <FaArrowDown />}
                      </button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedProducts[productName] && (
                      <motion.div
                        key="variants"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="mt-4 grid grid-cols-1 gap-4 overflow-hidden"
                      >
                        {productVariants.map((variant) => (
                          <div
                            key={variant.shopify_variant_id}
                            className="flex flex-col gap-4 border bg-[#f3f4f6] p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row"
                          >
                            {variant.image && (
                              <img
                                src={variant.image}
                                alt={variant.variant_name}
                                className="h-24 w-24 rounded border object-cover"
                              />
                            )}
                            <div className="flex w-full flex-col justify-between">
                              <div>
                                <p className="text-lg font-semibold text-[#000]">
                                  {variant.variant_name}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {Object.entries(variant.reasons).map(
                                    ([key, value]) =>
                                      value > 0 && (
                                        <div
                                          key={key}
                                          className="flex items-center gap-2 rounded-sm border-2 border-[#FFCC66] bg-white px-3 py-1 text-xs font-medium text-black"
                                        >
                                          <span>{reasons[key]}</span>
                                          <span className="rounded bg-[#FFCC66] px-2 text-sm font-bold text-[#000]">
                                            {value}
                                          </span>
                                        </div>
                                      ),
                                  )}
                                </div>
                              </div>
                              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm text-[#000]">
                                <div className="border bg-white p-2 shadow-sm">
                                  <p className="text-lg font-bold text-[#000]">
                                    {variant.count_return}
                                  </p>
                                  <p>Retouren</p>
                                </div>
                                <div className="border bg-white p-2 shadow-sm">
                                  <p className="text-lg font-bold text-[#000]">
                                    {variant.count_wrong}
                                  </p>
                                  <p>Erstattungen</p>
                                </div>
                                <div className="border bg-white p-2 shadow-sm">
                                  <p className="text-lg font-bold text-[#000]">
                                    {variant.count_exchange}
                                  </p>
                                  <p>Umtausche</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};
