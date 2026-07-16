export type ArtContainer = "bag" | "dripbox" | "stickbox";

export type ArtMotif =
  | "sunrise-mountain"
  | "ridge-sunset"
  | "river-wave"
  | "waterfall"
  | "forest-fog"
  | "karst-peaks"
  | "lagoon-ripple";

export interface ProductArt {
  container: ArtContainer;
  motif: ArtMotif;
  sky: [string, string];
  land: [string, string];
  accent: string;
  body: [string, string];
}

/** productId -> 상품 설명(image 필드)에 맞춘 일러스트 사양 */
export const PRODUCT_ART: Record<number, ProductArt> = {
  1: {
    container: "bag",
    motif: "sunrise-mountain",
    sky: ["#F6D8A8", "#F0A860"],
    land: ["#6B4226", "#4A2C17"],
    accent: "#FCEEC4",
    body: ["#8B5A2B", "#5C3A22"],
  },
  2: {
    container: "bag",
    motif: "ridge-sunset",
    sky: ["#4A2C2A", "#8A4A2E"],
    land: ["#3B2420", "#1D110E"],
    accent: "#E8985A",
    body: ["#463024", "#241811"],
  },
  3: {
    container: "dripbox",
    motif: "river-wave",
    sky: ["#E9D9BE", "#C9A876"],
    land: ["#7C6B52", "#A9916D"],
    accent: "#FBF3E4",
    body: ["#C9A876", "#8B6F47"],
  },
  4: {
    container: "bag",
    motif: "river-wave",
    sky: ["#DCE8ED", "#AFC9D6"],
    land: ["#6E8C9C", "#96B0BD"],
    accent: "#F3FAFC",
    body: ["#4A6572", "#2E4048"],
  },
  5: {
    container: "stickbox",
    motif: "waterfall",
    sky: ["#DCEEDF", "#A9CDB0"],
    land: ["#EAF5EC", "#FFFFFF"],
    accent: "#F4FBF6",
    body: ["#4F7A57", "#335C3B"],
  },
  6: {
    container: "bag",
    motif: "forest-fog",
    sky: ["#3A4A3E", "#1F2A22"],
    land: ["#28331F", "#161D12"],
    accent: "#D9E4D2",
    body: ["#33402F", "#1C2418"],
  },
  7: {
    container: "bag",
    motif: "karst-peaks",
    sky: ["#EDE6D9", "#D8CFBC"],
    land: ["#A79C89", "#8B8070"],
    accent: "#FBF8F1",
    body: ["#C9B896", "#A98B5E"],
  },
  8: {
    container: "stickbox",
    motif: "lagoon-ripple",
    sky: ["#BEE7E8", "#6FC3C7"],
    land: ["#FFFFFF", "#FFFFFF"],
    accent: "#F2FDFD",
    body: ["#2E9AA0", "#1B6B70"],
  },
};

const FALLBACK_ART: ProductArt = PRODUCT_ART[1];

export function getProductArt(productId: number): ProductArt {
  return PRODUCT_ART[productId] ?? FALLBACK_ART;
}
