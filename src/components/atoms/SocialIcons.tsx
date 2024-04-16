"use client";
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";

const BUTTON_SIZE = 30;

export const WhatsappShareWithIcon = (url?: any) => {
  return (
    <WhatsappShareButton url={url?.url ?? ""}>
      <WhatsappIcon size={BUTTON_SIZE} />
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
