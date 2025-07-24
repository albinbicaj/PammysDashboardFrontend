export const FilterRole = ({ updateRole, role }) => {
  return (
    <div>
      <select className="input mt-0" value={role} onChange={(e) => updateRole(e.target.value)}>
        <option value="">Rolle</option>
        <option value="1">Admin</option>
        <option value="2">User</option>
        <option value="3">Support</option>
        <option value="4">Lagerleiter</option>
        <option value="5">Pick</option>
        <option value="6">Pack</option>
        <option value="7">Retoure</option>
      </select>
    </div>
  );
};
