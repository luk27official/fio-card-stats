import "./EmptyState.css";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

function EmptyState({ title, description, icon = "📊" }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-description">{description}</p>
    </div>
  );
}

export default EmptyState;
