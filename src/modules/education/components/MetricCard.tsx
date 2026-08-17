type MetricCardProps = {
    label: string;
    value: string;
};

export function MetricCard({ label, value }: MetricCardProps) {
    return (
        <article className="stat-card">
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
        </article>
    );
}
