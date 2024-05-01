"use client";
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";
import WhatsappSvg from "../svgIcons/WhatsappSvg";

const BUTTON_SIZE = 30;

export const WhatsappShareWithIcon = (url?: any) => {
  return (
    <WhatsappShareButton
      url={url?.url ?? ""}
      className="flex gap-2 items-center cursor-pointer "
    >
      {/* <WhatsappIcon size={BUTTON_SIZE} />  */}
      <em>
        <WhatsappSvg />
      </em>
      <span className="text-green-600 text-sm">Share</span>
    </WhatsappShareButton>
  );
};

export const FacebookShareWithIcon = (url?: any) => {
  return (
    <FacebookShareButton url={url?.url ?? ""}>
      <FacebookIcon size={BUTTON_SIZE} />
    </FacebookShareButton>
  );
};

export const TwitterShareWithIcon = (url?: any) => {
  return (
    <TwitterShareButton url={url?.url ?? ""}>
      <TwitterIcon size={BUTTON_SIZE} />
    </TwitterShareButton>
  );
};
