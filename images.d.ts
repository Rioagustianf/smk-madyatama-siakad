import type { StaticImageData } from "next/image";

declare module "*.png" {
  const src: StaticImageData;
  export default src;
}

declare module "*.jpg" {
  const src: StaticImageData;
  export default src;
}

declare module "*.jpeg" {
  const src: StaticImageData;
  export default src;
}

declare module "*.JPG" {
  const src: StaticImageData;
  export default src;
}

declare module "*.PNG" {
  const src: StaticImageData;
  export default src;
}
