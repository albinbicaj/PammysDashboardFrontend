const getRefundTypeDE = (refundType) => {
  switch (refundType) {
    case 'Geld':
      return 'Rückerstattung';
    case 'Geschenkkarte':
      return 'Geschenkcode';
    default:
      return refundType;
  }
};
