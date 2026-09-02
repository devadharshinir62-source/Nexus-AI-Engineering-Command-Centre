import React from 'react';
import { EmptyState } from '../components/common/EmptyState';
import { FileQuestion, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-16">
      <EmptyState
        icon={FileQuestion}
        title="404 — Page Not Found"
        description="The telemetry view or navigation route you are attempting to access does not exist in the NEXUS Command Center."
        actionLabel="Return to Command Center"
        actionIcon={Home}
        onAction={() => navigate('/')}
      />
    </div>
  );
};
