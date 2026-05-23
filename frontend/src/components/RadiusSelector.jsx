const RADIUS_OPTIONS = [
  { label: '500m', value: 0.5 },
  { label: '1 km', value: 1 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 }
];

const RadiusSelector = ({ value, onChange }) => (
  <label className="radius-selector">
    <span>Radius</span>
    <select value={value} onChange={(event) => onChange(Number(event.target.value))}>
      {RADIUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

export default RadiusSelector;
