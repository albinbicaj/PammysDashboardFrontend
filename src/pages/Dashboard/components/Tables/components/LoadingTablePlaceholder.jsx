export const LoadingTablePlaceholder = ({ perPage = 10, colspan = 1 }) => {
  return (
    <tbody>
      {Array.from({ length: perPage }, (_, rowIndex) => (
        <tr key={rowIndex} className="h-[43px] min-h-[43px]">
          {Array.from({ length: colspan }, (_, colIndex) => (
            <td key={colIndex} className="relative p-2">
              <div className="rounded-lg bg-secondary text-xs text-secondary "> loading</div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};
