import PriorityBadge from '@/components/PriorityBadge';

export default function TestBadgePage() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="card-luxury mb-6">
          <h1 className="text-2xl font-bold mb-4">Priority Badge Test</h1>
          <p className="text-sm text-charcoal mb-4">
            Test the priority badge component with different sizes and priorities.
          </p>
        </div>
        
        <div className="card-luxury space-y-6">
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-700">Small Size (default):</p>
            <div className="flex flex-wrap gap-4 items-center">
              <PriorityBadge priority="critical" size="sm" />
              <PriorityBadge priority="high" size="sm" />
              <PriorityBadge priority="normal" size="sm" />
            </div>
          </div>
          
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-700">Medium Size:</p>
            <div className="flex flex-wrap gap-4 items-center">
              <PriorityBadge priority="critical" size="md" />
              <PriorityBadge priority="high" size="md" />
              <PriorityBadge priority="normal" size="md" />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="mb-3 text-sm font-semibold text-gray-700">Usage Examples:</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Critical badge pulses to draw attention</p>
              <p>• All badges include icons for quick visual recognition</p>
              <p>• ARIA labels ensure accessibility</p>
              <p>• Two sizes available: sm (default) and md</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

