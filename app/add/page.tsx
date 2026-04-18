import Link from 'next/link';
import DestinationForm from '@/components/DestinationForm';

export default function AddPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 w-full">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/destinations"
          className="text-sm text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to destinations
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add a place</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Add a new destination to your road trip list.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <DestinationForm />
      </div>
    </div>
  );
}
