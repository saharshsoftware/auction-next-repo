const AuctionHeaderServer = ({
  name,
  total,
  heading,
}: {
  name?: string;
  total: number;
  heading?: string;
}) => {
  return (
    <h1 className="custom-h1-class break-words my-4 flex flex-row items-center gap-2">
      {`${total} ${heading ? heading : `Auction Properties in ${name}`}`}
    </h1>
  );
};

export default AuctionHeaderServer;
