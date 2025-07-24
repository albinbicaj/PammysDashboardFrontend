import { useState } from 'react';
import axiosInstance from '../../../utils/axios';

const SyncShopifyProductForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shopifyProductId, setShopifyProductId] = useState('');
  const [filterSkus, setFilterSkus] = useState(true);
  const [allowedSkus, setAllowedSkus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const skusArray = allowedSkus
      .split('\n')
      .map((sku) => sku.trim())
      .filter(Boolean);

    try {
      const response = await axiosInstance.post(
        `/product/sync-shopify-product-id/${shopifyProductId}`,
        {
          filter_skus: filterSkus,
          allowed_skus: skusArray,
        },
      );
      console.log('Server response:', response.data);
      setIsOpen(false);
    } catch (error) {
      console.error('Error syncing product:', error);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn btn-secondary">
        Open Sync Modal
      </button>

      {/* Modal container: always mounted */}
      <div
        className={`bg-modal absolute inset-0 z-50 flex items-center
          justify-center
          transition-opacity duration-200
          ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setIsOpen(false)}
      >
        {/* Modal content */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative z-10 w-full min-w-[300px] max-w-xl
            transform rounded-lg border bg-white p-6
            shadow-lg transition-all duration-200
            ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <h2 className="mb-4 text-xl font-semibold">Sync Shopify Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block font-medium">Shopify Product ID</label>
              <input
                type="text"
                value={shopifyProductId}
                onChange={(e) => setShopifyProductId(e.target.value)}
                className="w-full rounded border p-2"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="filterSkus"
                checked={filterSkus}
                onChange={(e) => setFilterSkus(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="filterSkus" className="text-sm">
                Filter SKUs
              </label>
            </div>

            <div>
              <label className="mb-1 block font-medium">Allowed SKUs (one per line)</label>
              <textarea
                value={allowedSkus}
                onChange={(e) => setAllowedSkus(e.target.value)}
                rows={6}
                className="w-full rounded border p-2 font-mono"
                placeholder={`sku1\nsku2`}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn rounded border px-4 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-4 py-2">
                Sync Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SyncShopifyProductForm;

// import { useState } from 'react';
// import axiosInstance from '../../../utils/axios';

// const SyncShopifyProductForm = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [shopifyProductId, setShopifyProductId] = useState('');
//   const [filterSkus, setFilterSkus] = useState(false);
//   const [allowedSkus, setAllowedSkus] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const skusArray = allowedSkus
//       .split('\n')
//       .map((sku) => sku.trim())
//       .filter(Boolean);

//     try {
//       const response = await axiosInstance.post(
//         `/product/sync-shopify-product-id/${shopifyProductId}`,
//         {
//           filter_skus: filterSkus,
//           allowed_skus: skusArray,
//         },
//       );
//       console.log('Server response:', response.data); // Replace with notification
//       setIsOpen(false); // Close modal on success
//     } catch (error) {
//       console.error('Error syncing product:', error); // Replace with notification
//     }
//   };

//   return (
//     <>
//       <button onClick={() => setIsOpen(true)} className="btn btn-primary">
//         Open Sync Modal
//       </button>

//       {isOpen && (
//         <div
//           className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200"
//           onClick={() => setIsOpen(false)} // clicking outside closes modal
//         >
//           <div
//             className="animate-fadeIn w-full min-w-[300px] max-w-xl scale-95 transform rounded-lg border bg-white p-6 opacity-0 shadow-lg transition-all duration-200"
//             onClick={(e) => e.stopPropagation()} // prevent close on modal click
//           >
//             <h2 className="mb-4 text-xl font-semibold">Sync Shopify Product</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="mb-1 block font-medium">Shopify Product ID</label>
//                 <input
//                   type="text"
//                   value={shopifyProductId}
//                   onChange={(e) => setShopifyProductId(e.target.value)}
//                   className="w-full rounded border p-2"
//                   required
//                 />
//               </div>

//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id="filterSkus"
//                   checked={filterSkus}
//                   onChange={(e) => setFilterSkus(e.target.checked)}
//                   className="h-4 w-4"
//                 />
//                 <label htmlFor="filterSkus" className="text-sm">
//                   Filter SKUs
//                 </label>
//               </div>

//               <div>
//                 <label className="mb-1 block font-medium">Allowed SKUs (one per line)</label>
//                 <textarea
//                   value={allowedSkus}
//                   onChange={(e) => setAllowedSkus(e.target.value)}
//                   rows={6}
//                   className="w-full rounded border p-2 font-mono"
//                   placeholder={`sku1\nsku2`}
//                 />
//               </div>

//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsOpen(false)}
//                   className="btn rounded border px-4 py-2 hover:bg-gray-100"
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-primary px-4 py-2">
//                   Sync Product
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default SyncShopifyProductForm;
