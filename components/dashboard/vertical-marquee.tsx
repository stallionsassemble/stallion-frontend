export function VerticalMarquee({
  children,
  height = "h-[200px]",
  duration = "30s",
  reverse = false,
}: {
  children: React.ReactNode;
  height?: string;
  duration?: string;
  reverse?: boolean;
}) {
  return (
    <div className={`relative w-full overflow-hidden ${height}`}>
      {/* Gradient Masks */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-linear-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />

      <div
        className="flex flex-col gap-3 w-full hover:paused"
        style={{
          animation: `verticalMarquee ${duration} linear infinite ${reverse ? 'reverse' : 'normal'}`
        }}
      >
        {children}
        {children} {/* Duplicate content for seamless loop */}
      </div>
      <style jsx>{`
        @keyframes verticalMarquee {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
}