import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
  FacebookIcon,
  TwitterIcon,
  PinterestIcon,
} from 'react-share';

const style = {
  marginRight: 8,
};
const ShareButtons = ({ url, quote, size }) => {
  return (
    <>
      <FacebookShareButton url={url} quote={quote} style={style}>
        <FacebookIcon size={size} round />
      </FacebookShareButton>
      <PinterestShareButton url={url} quote={quote} style={style}>
        <PinterestIcon size={size} round />
      </PinterestShareButton>
      <TwitterShareButton url={url} quote={quote} style={style}>
        <TwitterIcon size={size} round />
      </TwitterShareButton>
    </>
  );
};

ShareButtons.defaultProps = {
  quote: 'NovaWare',
  size: 32,
};

export default ShareButtons;
