import "./jobCard.css";

export default function JobCard({ job }) {
  return (
    <article className="sr-job">
      <header className="sr-job__header">
        <h3 className="sr-job__title">{job.title}</h3>
        <span className="sr-job__type">{job.type}</span>
      </header>

      <p className="sr-job__meta">
        <strong>{job.company}</strong> · {job.city} — {job.area}
      </p>

      <ul className="sr-job__tags">
        {job.tags?.map((t, i) => (
          <li key={i} className="sr-tag">{t}</li>
        ))}
      </ul>

      <div className="sr-job__footer">
        <span className="sr-job__salary">{job.salary}</span>
        <span className="sr-job__date">Publicado: {job.postedAt}</span>
      </div>
    </article>
  );
}
