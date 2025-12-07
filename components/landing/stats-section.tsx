export function StatsSection() {
  return (
    <section className="bg-muted/50 py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-4xl font-bold mb-2">$1M+</div>
          <div className="text-muted-foreground">Total Value Locked</div>
        </div>
        <div>
          <div className="text-4xl font-bold mb-2">500+</div>
          <div className="text-muted-foreground">Bounties Paid</div>
        </div>
        <div>
          <div className="text-4xl font-bold mb-2">10k+</div>
          <div className="text-muted-foreground">Active Hunters</div>
        </div>
      </div>
    </section>
  );
}
