export default function Loading() {
  return (
    <main className="site-page" aria-busy="true">
      <div className="container route-loading">
        <p className="sr-only" role="status">
          Chargement / Loading
        </p>
        <div className="route-loading__intro" aria-hidden="true">
          <span className="route-loading__block route-loading__block--eyebrow" />
          <span className="route-loading__block route-loading__block--title" />
          <span className="route-loading__block route-loading__block--copy" />
        </div>
        <div className="route-loading__grid" aria-hidden="true">
          <span className="route-loading__card" />
          <span className="route-loading__card" />
          <span className="route-loading__card" />
        </div>
      </div>
    </main>
  );
}
