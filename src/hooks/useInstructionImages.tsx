// utils/getInstructionImages.ts
import { getImageCloudfrontUrl } from "@/shared/Utilies";
import { useDeviceType } from "@/hooks/useDeviceType";
import { INSTRUCTIONS_FOLDER_NAME } from "@/types";

export function useInstructionImages(
  imageNames: string[],
  folder: INSTRUCTIONS_FOLDER_NAME
): string[] {
  const device = useDeviceType();
  const images = imageNames.map((item) =>
    getImageCloudfrontUrl(
      item,
      folder,
      device === "mobile" || device === "tablet"
        ? "instructions-mobile-browser"
        : undefined
    )
  );

  return images;
}
