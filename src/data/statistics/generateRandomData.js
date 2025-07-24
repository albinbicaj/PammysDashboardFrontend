import { existsSync, writeFile } from 'fs';
import { storeProducts } from './products.js';
import { allVariants } from './allVariants.js';

const products = allVariants;

function generateRandomData(records) {
  const returnReasons = [
    'Damaged',
    'Wrong size',
    'Wrong color',
    'Not as described',
    'Changed mind',
    'Other',
  ];
  const returnStatus = ['return', 'exchange', 'refund'];

  const generatedData = [];

  for (let i = 0; i < records; i++) {
    const reasons = [];
    const typesMap = new Map(); // Use a Map to store counts for each returnType

    for (let j = 0; j < returnReasons.length; j++) {
      const reason = returnReasons[j];
      const randomCount = Math.floor(Math.random() * 51); // Random count from 0 to 50
      const randomStatus = returnStatus[Math.floor(Math.random() * returnStatus.length)]; // Random status

      reasons.push({
        reason: reason,
        count: randomCount,
      });

      // Update counts in typesMap
      if (typesMap.has(randomStatus)) {
        typesMap.set(randomStatus, typesMap.get(randomStatus) + randomCount);
      } else {
        typesMap.set(randomStatus, randomCount);
      }
    }

    const randomIndex = Math.floor(Math.random() * 41); // Random index from 0 to 40 for the products object
    const product = { ...products[randomIndex] }; // Copy one of the provided product objects

    // Convert typesMap back to array format
    const types = Array.from(typesMap).map(([returnType, count]) => ({
      returnType,
      count,
    }));

    product.returns = {
      reasons: reasons,
      types: types,
    };

    generatedData.push(product);
  }

  return generatedData;
}

// function generateRandomData(records) {
//   const returnReasons = [
//     'Damaged',
//     'Wrong size',
//     'Wrong color',
//     'Not as described',
//     'Changed mind',
//     'Other',
//   ];
//   const returnStatus = ['return', 'exchange', 'refund'];

//   const generatedData = [];

//   for (let i = 0; i < records; i++) {
//     const reasons = [];
//     const types = [];

//     for (let j = 0; j < returnReasons.length; j++) {
//       const reason = returnReasons[j];
//       const randomCount = Math.floor(Math.random() * 51); // Random count from 0 to 50
//       const randomStatus = returnStatus[Math.floor(Math.random() * returnStatus.length)]; // Random status

//       reasons.push({
//         reason: reason,
//         count: randomCount,
//       });

//       types.push({
//         returnType: randomStatus,
//         count: randomCount,
//       });
//     }

//     const randomIndex = Math.floor(Math.random() * 41); // Random index from 0 to 40 for the products object
//     const product = { ...products[randomIndex] }; // Copy one of the provided product objects

//     product.returns = {
//       reasons: reasons,
//       types: types,
//     };

//     generatedData.push(product);
//   }

//   return generatedData;
// }

function generateFileName(baseName, extension) {
  let fileName = `${baseName}.${extension}`;
  let counter = 1;

  while (existsSync(fileName)) {
    fileName = `${baseName}_${counter}.${extension}`;
    counter++;
  }

  return fileName;
}

// Usage
const generatedData = generateRandomData(100); // Generates 10 random data records
const fileName = generateFileName('generatedData', 'json');
writeFile(fileName, JSON.stringify(generatedData, null, 2), (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log(`Data has been saved to ${fileName}`);
});
