import WorldMap from "@/components/ui/world-map"

export default function WorldMapDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">Global Network Coverage</h1>
          <p className="text-xl font-light text-gray-600 max-w-3xl mx-auto">
            Connecting India to the world with our extensive network spanning 190+ countries
          </p>
        </div>

        {/* World Map Container */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="h-[400px] md:h-[600px] text-gray-800">
              <WorldMap />
            </div>
          </div>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-light text-primary mb-2">190+</div>
            <div className="text-sm font-light text-gray-600">Countries Connected</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-primary mb-2">18</div>
            <div className="text-sm font-light text-gray-600">Major Hubs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-primary mb-2">24/7</div>
            <div className="text-sm font-light text-gray-600">Operations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-primary mb-2">1M+</div>
            <div className="text-sm font-light text-gray-600">Daily Shipments</div>
          </div>
        </div>
      </div>
    </div>
  )
}
