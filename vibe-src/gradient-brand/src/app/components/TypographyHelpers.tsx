// Typography helper functions shared across components
export const fontFamilyMap = {
  "ServiceNow_Sans": "ServiceNow Sans",
  "ServiceNow_Sans_Mono": "ServiceNow Sans Mono",
  "Gilroy": "Gilroy"
};

export const fontWeightMap = {
  "Light": { designToken: "Light", actualWeight: "300", cssClass: ".sn-light", figmaVariable: "Regular" },
  "Regular": { designToken: "Regular", actualWeight: "400", cssClass: ".sn-regular", figmaVariable: "Medium" },
  "Medium": { designToken: "Medium", actualWeight: "500", cssClass: ".sn-medium", figmaVariable: "Bold" },
  "SemiBold": { designToken: "Book", actualWeight: "450", cssClass: ".sn-book", figmaVariable: "SemiBold" },
  "Bold": { designToken: "Bold", actualWeight: "700", cssClass: ".sn-bold", figmaVariable: "Black" },
  "Black": { designToken: "Black", actualWeight: "900", cssClass: ".sn-black", figmaVariable: "Black" }
};

export const getDisplayFontFamily = (fontFamily: string) => {
  return fontFamilyMap[fontFamily as keyof typeof fontFamilyMap] || fontFamily;
};

export const getFontWeightDetails = (weight: string) => {
  return fontWeightMap[weight as keyof typeof fontWeightMap] || {
    designToken: weight,
    actualWeight: "400",
    cssClass: ".sn-regular",
    figmaVariable: weight
  };
};

// Typography style presets matching the typography explorer
export const typographyStyles = {
  h1Anthemic: {
    fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
    fontSize: "90px", // XL breakpoint
    fontWeight: getFontWeightDetails("Bold").actualWeight,
    lineHeight: "100%",
    letterSpacing: "-0.01em"
  },
  h1Jumbo: {
    fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
    fontSize: "64px", // XL breakpoint
    fontWeight: getFontWeightDetails("Bold").actualWeight,
    lineHeight: "110%",
    letterSpacing: "-0.01em"
  },
  h1: {
    fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
    fontSize: "48px", // XL breakpoint
    fontWeight: getFontWeightDetails("Bold").actualWeight,
    lineHeight: "110%",
    letterSpacing: "-0.01em"
  },
  h2: {
    fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
    fontSize: "36px", // XL breakpoint
    fontWeight: getFontWeightDetails("Bold").actualWeight,
    lineHeight: "110%",
    letterSpacing: "-0.01em"
  },
  h3: {
    fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
    fontSize: "28px", // XL breakpoint
    fontWeight: getFontWeightDetails("Bold").actualWeight,
    lineHeight: "110%",
    letterSpacing: "-0.01em"
  },
  h4: {
    fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
    fontSize: "24px", // XL breakpoint
    fontWeight: getFontWeightDetails("Bold").actualWeight,
    lineHeight: "110%",
    letterSpacing: "-0.01em"
  },
  h5: {
    fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
    fontSize: "22px", // XL breakpoint
    fontWeight: getFontWeightDetails("Bold").actualWeight,
    lineHeight: "110%",
    letterSpacing: "-0.01em"
  },
  h6: {
    fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
    fontSize: "18px", // XL breakpoint
    fontWeight: getFontWeightDetails("Bold").actualWeight,
    lineHeight: "110%",
    letterSpacing: "-0.01em"
  },
  bodyXLarge: {
    fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
    fontSize: "24px", // XL breakpoint
    fontWeight: getFontWeightDetails("Light").actualWeight,
    lineHeight: "150%",
    letterSpacing: "0"
  },
  bodyLarge: {
    fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
    fontSize: "20px", // XL breakpoint
    fontWeight: getFontWeightDetails("Light").actualWeight,
    lineHeight: "150%",
    letterSpacing: "0"
  },
  bodyMedium: {
    fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
    fontSize: "18px", // XL breakpoint
    fontWeight: getFontWeightDetails("Light").actualWeight,
    lineHeight: "150%",
    letterSpacing: "0"
  },
  bodySmall: {
    fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
    fontSize: "16px", // XL breakpoint
    fontWeight: getFontWeightDetails("Light").actualWeight,
    lineHeight: "150%",
    letterSpacing: "0"
  },
  bodyXSmall: {
    fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
    fontSize: "16px", // XL breakpoint
    fontWeight: getFontWeightDetails("Light").actualWeight,
    lineHeight: "150%",
    letterSpacing: "0"
  },
  eyebrowLarge: {
    fontFamily: getDisplayFontFamily("ServiceNow_Sans_Mono"),
    fontSize: "18px", // XL breakpoint
    fontWeight: getFontWeightDetails("Regular").actualWeight,
    lineHeight: "130%",
    letterSpacing: "0"
  },
  eyebrowSmall: {
    fontFamily: getDisplayFontFamily("ServiceNow_Sans_Mono"),
    fontSize: "12px", // XL breakpoint
    fontWeight: getFontWeightDetails("Regular").actualWeight,
    lineHeight: "130%",
    letterSpacing: "0"
  },
  caption: {
    fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
    fontSize: "14px", // XL breakpoint
    fontWeight: getFontWeightDetails("Regular").actualWeight,
    lineHeight: "150%",
    letterSpacing: "0"
  },
  footnote: {
    fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
    fontSize: "14px", // XL breakpoint
    fontWeight: getFontWeightDetails("Light").actualWeight,
    lineHeight: "150%",
    letterSpacing: "-0.01em"
  }
};