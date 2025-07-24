export const getStatusDE = (status) => {
  switch (status) {
    case 'requested':
      return 'angefragt';
    case 'in progress' || 'in_progress':
      return 'in Bearbeitung';
    case 'approved':
      return 'genehmigt';
    case 'refunded':
      return 'erstattet';
    case 'rejected':
      return 'abgelehnt';
    case 'exchanged':
      return 'umgetauscht';
    case 'canceled':
      return 'storniert';
    case 'partially':
      return 'teilweise';
    case 'completed':
      return 'abgeschlossen';
    default:
      return status;
  }
};
