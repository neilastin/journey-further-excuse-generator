import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-card p-4 my-6 flex items-start gap-3">
      <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5 w-5 h-5" />
      <div className="flex-1">
        <h3 className="text-red-400 font-semibold mb-1">Error</h3>
        <p className="text-red-300 text-sm">{message}</p>
      </div>
    </div>
  );
}
