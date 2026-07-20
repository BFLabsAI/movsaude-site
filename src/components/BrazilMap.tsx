/**
 * Reusa o BrazilMap.html original (D3 + topojson no próprio arquivo).
 * Mesma abordagem do Home.dc.html — sem reinventar a silhueta.
 */
export function BrazilMap({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full ${className}`}>
      <iframe
        src="/BrazilMap.html"
        title="Mapa MovSaúde"
        loading="lazy"
        className="w-full border-0 bg-transparent block"
        style={{ aspectRatio: '1 / 1.05', minHeight: 320 }}
      />
    </div>
  )
}
