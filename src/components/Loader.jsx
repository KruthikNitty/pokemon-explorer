function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-t-red-500 animate-spin" />
        <div className="absolute inset-2 rounded-full bg-white/5 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white/40" />
        </div>
      </div>
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#1a1a2e] border border-white/5 p-4">
      <div className="flex justify-center mb-4">
        <div className="w-28 h-28 rounded-xl shimmer bg-white/5" />
      </div>
      <div className="h-4 w-24 rounded shimmer bg-white/5 mb-2" />
      <div className="flex gap-2">
        <div className="h-5 w-14 rounded-full shimmer bg-white/5" />
        <div className="h-5 w-14 rounded-full shimmer bg-white/5" />
      </div>
    </div>
  )
}

export default Loader
