import React from 'react';

export interface ErrorNoticeProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorNotice: React.FC<ErrorNoticeProps> = ({ message, onRetry }) => (
  <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-sindoor-500/40 bg-sindoor-500/10 px-4 py-3 font-medium text-sindoor-600">
    <span>{message}</span>
    {onRetry && (
      <button type="button" onClick={onRetry} className="btn-secondary !py-1">
        Try again
      </button>
    )}
  </div>
);

export default ErrorNotice;
