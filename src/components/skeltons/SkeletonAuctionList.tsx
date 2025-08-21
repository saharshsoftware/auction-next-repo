const SkeletonAuctionCard = () => {
  return (
    <div className="flex flex-col gap-4 w-full border rounded shadow p-4 min-h-40">
      <div className="skeleton h-6 w-2/3"></div>
      <div className="skeleton h-4 w-1/4"></div>
      <div className="skeleton h-4 w-1/5"></div>
      <div className="skeleton h-4 w-1/3"></div>
      <div className="skeleton h-4 w-1/2"></div>
      <div className="flex gap-4 items-center justify-between">
        <div className="skeleton h-10 w-1/4"></div>
        <div className="skeleton h-10 w-1/6"></div>
      </div>
    </div>
  );
};
export const SkeletonAuctionList = () => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <SkeletonAuctionCard key={index} />
      ))}
    </div>
  );
};