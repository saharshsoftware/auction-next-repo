import SortByDropdown from './SortByDropdown';
import MobileSortContainer from './MobileSortContainer';

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
      <div className="flex items-center gap-2 justify-between w-full">
        <h1 className="custom-h1-class break-words">
          {`${total} ${heading ? heading : `Auction Properties in ${name}`}`}
        </h1>
        <MobileSortContainer />
      </div>
      <SortByDropdown />
    </div>
  );
};

export default AuctionHeaderServer;
