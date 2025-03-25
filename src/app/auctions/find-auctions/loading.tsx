import CustomLoading from "@/components/atoms/Loading";
import SkeletonAuctionPage from "@/components/skeltons/SkeletonAuctionPage";

export default function Loading() {
  // return (
  //   <div className="p-12 min-h-[70vh] flex items-center justify-center w-full">
  //     <CustomLoading />
  //   </div>
  // );
  return <SkeletonAuctionPage />;
}
