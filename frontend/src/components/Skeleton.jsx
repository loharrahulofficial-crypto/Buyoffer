const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-image" />
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-price" />
    <div className="skeleton skeleton-button" />
  </div>
)

export const SkeletonGrid = () => (
  <div className="offers-grid">
    {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
  </div>
)
