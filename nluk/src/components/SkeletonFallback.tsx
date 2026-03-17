/** Generic skeleton fallback used while lazy pages are loading. */
export default function SkeletonFallback() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading…" style={{ padding: '0 20px' }}>
      {/* Page hero skeleton */}
      <div className="skeleton" style={{ height: 28, width: '55%', borderRadius: 8, margin: '20px 0 8px' }} />
      <div className="skeleton" style={{ height: 16, width: '80%', borderRadius: 6, marginBottom: 20 }} />

      {/* Card skeleton rows */}
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="skeleton" style={{ height: 72, borderRadius: 12, marginBottom: 10 }} />
      ))}
    </div>
  )
}
