const RADIUS_OPTIONS = [
  { label: '500m', value: 0.5 },
  { label: '1 km', value: 1 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 }
]

const RadiusSelector = ({ value, onChange }) => (
  <div className="radius-selector fade-in">
    {RADIUS_OPTIONS.map((option) => (
      <button
        type="button"
        key={option.value}
        className={`radius-pill ${value === option.value ? 'active' : ''}`}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
)

export default RadiusSelector
