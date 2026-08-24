import { IKImage } from "imagekitio-react";

const Image = ({ src, className, w, h, alt }) => {
  const rawSrc = String(src || "").trim();
  const normalizedSrc = rawSrc
    .replace(/^https:\/(?!\/)/i, "https://")
    .replace(/^http:\/(?!\/)/i, "http://")
    .replace(/^\/\//, "https://");
  const isExternalUrl = /^https?:\/\//i.test(normalizedSrc);

  if (isExternalUrl) {
    return (
      <img
        src={normalizedSrc}
        className={className}
        loading="lazy"
        alt={alt}
        width={w}
        height={h}
      />
    );
  }

  return (
    <IKImage
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      path={rawSrc}
      className={className}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      alt={alt}
      width={w}
      height={h}
      transformation={[
        {
          width: w,
          height: h,
        },
      ]}
    />
  );
};

export default Image;
