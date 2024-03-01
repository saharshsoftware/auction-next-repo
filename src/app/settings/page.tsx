import ShowLabelValue from "@/components/atoms/ShowLabelValue";
import { STRING_DATA } from "@/shared/Constants";

export default function Page() {
  return (
    <div className="common-section">
      <div className="lg:w-3/5 md:w-4/5 w-full mx-auto py-4">
        <div className="custom-common-header-class">{STRING_DATA.SETTINGS}</div>
        <div className="custom-common-header-detail-class">
          <div className="flex flex-col gap-4 p-4  w-full min-h-12">
            <ShowLabelValue heading={"Notification"} value={"New Deal"} />
          </div>
        </div>
      </div>
    </div>
  );
}
