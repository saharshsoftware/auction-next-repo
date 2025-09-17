import SortByDropdown from './SortByDropdown';

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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-4">
      <h1 className="custom-h1-class break-words">
        {`${total} ${heading ? heading : `Auction Properties in ${name}`}`}
      </h1>
      <SortByDropdown />
    </div>
  );
};

export default AuctionHeaderServer;
