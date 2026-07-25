import { LoadingSpinner } from '@/components/loading-spinner';

/** Suspense fallback for the entire admin section */
export default function AdminLoading() {
  return <LoadingSpinner />;
}
