import CustomLoading from "@/components/atoms/Loading";

export default function FallbackLoading() {
  return (
    <div className="p-12 min-h-[70vh] flex items-center justify-center w-full">
      <CustomLoading />
    </div>
  );
}
