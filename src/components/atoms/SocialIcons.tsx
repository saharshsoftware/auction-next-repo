/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
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
import { IMAGES } from "@/shared/Images";

const BUTTON_SIZE = 30;

export const WhatsappShareWithIcon = (url?: any) => {
  return (
    <WhatsappShareButton
      url={url?.url ?? ""}
      className="flex gap-3 items-center cursor-pointer"
    >
      <img src={IMAGES.whatsapppng.src} className="w-4 h-4" />
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
