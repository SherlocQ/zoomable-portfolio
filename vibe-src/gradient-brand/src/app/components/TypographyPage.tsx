import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Copy, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { typographyStyles, getDisplayFontFamily, getFontWeightDetails } from './TypographyHelpers';

interface TypeStyle {
  name: string;
  lineHeight: string;
  letterSpacing: string;
  sizes: {
    breakpoint: string;
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    example: string;
  }[];
}

const fontFamilyVariableMap = {
  "ServiceNow_Sans": "--Primary",
  "ServiceNow_Sans_Mono": "--Monospace",
  "Gilroy": "--Gilroy"
};

const fontFamilyCSSClassMap = {
  "ServiceNow_Sans": ".sn",
  "ServiceNow_Sans_Mono": ".sn-monospace",
  "Gilroy": ".sn-display"
};

const fontFamilyCSSVariableMap = {
  "ServiceNow_Sans": "var(--now-font-family-sn-sans)",
  "ServiceNow_Sans_Mono": "var(--now-font-family-sn-sans-monospace)",
  "Gilroy": "var(--now-font-family-sn-sans-display)"
};

const breakpoints = [
  "XS (0–575px)",
  "SM (576–767px)", 
  "MD (768–1023px)",
  "LG (1024–1365px)",
  "XL (1366–1679px)",
  "XXL (1680px+)"
];

const typeStyles: TypeStyle[] = [
  {
    name: "H1 Anthemic",
    lineHeight: "100% (1.0)",
    letterSpacing: "-1% (-0.01em)",
    sizes: [
      { breakpoint: "XS (0–575px)", fontSize: "34px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Anthemic Bold" },
      { breakpoint: "SM (576–767px)", fontSize: "64px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Anthemic Bold" },
      { breakpoint: "MD (768–1023px)", fontSize: "64px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Anthemic Bold" },
      { breakpoint: "LG (1024–1365px)", fontSize: "64px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Anthemic Bold" },
      { breakpoint: "XL (1366–1679px)", fontSize: "90px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Anthemic Bold" },
      { breakpoint: "XXL (1680px+)", fontSize: "110px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Anthemic Bold" }
    ]
  },
  {
    name: "H1 Jumbo",
    lineHeight: "110% (1.1)",
    letterSpacing: "-1% (-0.01em)",
    sizes: [
      { breakpoint: "XS (0–575px)", fontSize: "32px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Jumbo Bold" },
      { breakpoint: "SM (576–767px)", fontSize: "36px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Jumbo Bold" },
      { breakpoint: "MD (768–1023px)", fontSize: "48px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Jumbo Bold" },
      { breakpoint: "LG (1024–1365px)", fontSize: "64px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Jumbo Bold" },
      { breakpoint: "XL (1366–1679px)", fontSize: "64px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Jumbo Bold" },
      { breakpoint: "XXL (1680px+)", fontSize: "80px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Jumbo Bold" }
    ]
  },
  {
    name: "H1",
    lineHeight: "110% (1.1)",
    letterSpacing: "-1% (-0.01em)",
    sizes: [
      { breakpoint: "XS (0–575px)", fontSize: "28px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Bold" },
      { breakpoint: "SM (576–767px)", fontSize: "28px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Bold" },
      { breakpoint: "MD (768–1023px)", fontSize: "36px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Bold" },
      { breakpoint: "LG (1024–1365px)", fontSize: "48px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Bold" },
      { breakpoint: "XL (1366–1679px)", fontSize: "48px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Bold" },
      { breakpoint: "XXL (1680px+)", fontSize: "64px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H1 Bold" }
    ]
  },
  {
    name: "H2",
    lineHeight: "110% (1.1)",
    letterSpacing: "-1% (-0.01em)",
    sizes: [
      { breakpoint: "XS (0–575px)", fontSize: "24px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H2 Bold" },
      { breakpoint: "SM (576–767px)", fontSize: "24px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H2 Bold" },
      { breakpoint: "MD (768–1023px)", fontSize: "28px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H2 Bold" },
      { breakpoint: "LG (1024–1365px)", fontSize: "36px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H2 Bold" },
      { breakpoint: "XL (1366–1679px)", fontSize: "36px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H2 Bold" },
      { breakpoint: "XXL (1680px+)", fontSize: "48px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H2 Bold" }
    ]
  },
  {
    name: "H3",
    lineHeight: "110% (1.1)",
    letterSpacing: "-1% (-0.01em)",
    sizes: [
      { breakpoint: "XS (0–575px)", fontSize: "22px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H3 Bold" },
      { breakpoint: "SM (576–767px)", fontSize: "22px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H3 Bold" },
      { breakpoint: "MD (768–1023px)", fontSize: "24px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H3 Bold" },
      { breakpoint: "LG (1024–1365px)", fontSize: "28px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H3 Bold" },
      { breakpoint: "XL (1366–1679px)", fontSize: "28px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H3 Bold" },
      { breakpoint: "XXL (1680px+)", fontSize: "36px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H3 Bold" }
    ]
  },
  {
    name: "H4",
    lineHeight: "110% (1.1)",
    letterSpacing: "-1% (-0.01em)",
    sizes: [
      { breakpoint: "XS (0–575px)", fontSize: "20px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H4 Bold" },
      { breakpoint: "SM (576–767px)", fontSize: "20px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H4 Bold" },
      { breakpoint: "MD (768–1023px)", fontSize: "22px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H4 Bold" },
      { breakpoint: "LG (1024–1365px)", fontSize: "24px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H4 Bold" },
      { breakpoint: "XL (1366–1679px)", fontSize: "24px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H4 Bold" },
      { breakpoint: "XXL (1680px+)", fontSize: "28px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H4 Bold" }
    ]
  },
  {
    name: "H5",
    lineHeight: "110% (1.1)",
    letterSpacing: "-1% (-0.01em)",
    sizes: [
      { breakpoint: "XS (0–575px)", fontSize: "18px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H5 Bold" },
      { breakpoint: "SM (576–767px)", fontSize: "18px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H5 Bold" },
      { breakpoint: "MD (768–1023px)", fontSize: "20px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H5 Bold" },
      { breakpoint: "LG (1024–1365px)", fontSize: "22px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H5 Bold" },
      { breakpoint: "XL (1366–1679px)", fontSize: "22px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H5 Bold" },
      { breakpoint: "XXL (1680px+)", fontSize: "24px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H5 Bold" }
    ]
  },
  {
    name: "H6",
    lineHeight: "110% (1.1)",
    letterSpacing: "-1% (-0.01em)",
    sizes: [
      { breakpoint: "XS (0–575px)", fontSize: "16px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H6 Bold" },
      { breakpoint: "SM (576–767px)", fontSize: "16px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H6 Bold" },
      { breakpoint: "MD (768–1023px)", fontSize: "16px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H6 Bold" },
      { breakpoint: "LG (1024–1365px)", fontSize: "18px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H6 Bold" },
      { breakpoint: "XL (1366–1679px)", fontSize: "18px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H6 Bold" },
      { breakpoint: "XXL (1680px+)", fontSize: "18px", fontFamily: "ServiceNow_Sans", fontWeight: "Bold", example: "H6 Bold" }
    ]
  },
  {
    name: "Body XLarge",
    lineHeight: "150% (1.5)",
    letterSpacing: "0",
    sizes: [
      { breakpoint: "XS (0–575px)", fontSize: "18px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body XLarge - Light" },
      { breakpoint: "SM (576–767px)", fontSize: "18px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body XLarge - Light" },
      { breakpoint: "MD (768–1023px)", fontSize: "20px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body XLarge - Light" },
      { breakpoint: "LG (1024–1365px)", fontSize: "24px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body XLarge - Light" },
      { breakpoint: "XL (1366–1679px)", fontSize: "24px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body XLarge - Light" },
      { breakpoint: "XXL (1680px+)", fontSize: "28px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body XLarge - Light" }
    ]
  },
  {
    name: "Body Large",
    lineHeight: "150% (1.5)",
    letterSpacing: "0",
    sizes: [
      { breakpoint: "XS (0–575px)", fontSize: "18px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Large - Light" },
      { breakpoint: "SM (576–767px)", fontSize: "18px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Large - Light" },
      { breakpoint: "MD (768–1023px)", fontSize: "18px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Large - Light" },
      { breakpoint: "LG (1024���1365px)", fontSize: "20px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Large - Light" },
      { breakpoint: "XL (1366–1679px)", fontSize: "20px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Large - Light" },
      { breakpoint: "XXL (1680px+)", fontSize: "22px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Large - Light" }
    ]
  },
  {
    name: "Body Medium",
    lineHeight: "150% (1.5)",
    letterSpacing: "0",
    sizes: [
      { breakpoint: "XS (0–575px)", fontSize: "16px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Medium - Light" },
      { breakpoint: "SM (576–767px)", fontSize: "16px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Medium - Light" },
      { breakpoint: "MD (768–1023px)", fontSize: "16px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Medium - Light" },
      { breakpoint: "LG (1024–1365px)", fontSize: "18px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Medium - Light" },
      { breakpoint: "XL (1366–1679px)", fontSize: "18px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Medium - Light" },
      { breakpoint: "XXL (1680px+)", fontSize: "20px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Medium - Light" }
    ]
  },
  {
    name: "Body Small",
    lineHeight: "150% (1.5)",
    letterSpacing: "0",
    sizes: [
      { breakpoint: "XS (0–575px)", fontSize: "16px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Small - Light" },
      { breakpoint: "SM (576–767px)", fontSize: "16px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Small - Light" },
      { breakpoint: "MD (768–1023px)", fontSize: "16px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Small - Light" },
      { breakpoint: "LG (1024–1365px)", fontSize: "16px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Small - Light" },
      { breakpoint: "XL (1366–1679px)", fontSize: "16px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Small - Light" },
      { breakpoint: "XXL (1680px+)", fontSize: "18px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body Small - Light" }
    ]
  },
  {
    name: "Body XSmall",
    lineHeight: "150% (1.5)",
    letterSpacing: "0",
    sizes: [
      { breakpoint: "XS (0–575px)", fontSize: "14px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body XSmall - Light" },
      { breakpoint: "SM (576–767px)", fontSize: "14px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body XSmall - Light" },
      { breakpoint: "MD (768–1023px)", fontSize: "14px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body XSmall - Light" },
      { breakpoint: "LG (1024–1365px)", fontSize: "16px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body XSmall - Light" },
      { breakpoint: "XL (1366–1679px)", fontSize: "16px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body XSmall - Light" },
      { breakpoint: "XXL (1680px+)", fontSize: "16px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Body XSmall - Light" }
    ]
  },
  {
    name: "Eyebrow Large",
    lineHeight: "130% (1.3)",
    letterSpacing: "0",
    sizes: [
      { breakpoint: "XS (0–575px)", fontSize: "16px", fontFamily: "ServiceNow_Sans_Mono", fontWeight: "Regular", example: "EYEBROW LARGE - MONO REGULAR, UPPERCASE" },
      { breakpoint: "SM (576–767px)", fontSize: "16px", fontFamily: "ServiceNow_Sans_Mono", fontWeight: "Regular", example: "EYEBROW LARGE - MONO REGULAR, UPPERCASE" },
      { breakpoint: "MD (768–1023px)", fontSize: "16px", fontFamily: "ServiceNow_Sans_Mono", fontWeight: "Regular", example: "EYEBROW LARGE - MONO REGULAR, UPPERCASE" },
      { breakpoint: "LG (1024–1365px)", fontSize: "18px", fontFamily: "ServiceNow_Sans_Mono", fontWeight: "Regular", example: "EYEBROW LARGE - MONO REGULAR, UPPERCASE" },
      { breakpoint: "XL (1366–1679px)", fontSize: "18px", fontFamily: "ServiceNow_Sans_Mono", fontWeight: "Regular", example: "EYEBROW LARGE - MONO REGULAR, UPPERCASE" },
      { breakpoint: "XXL (1680px+)", fontSize: "20px", fontFamily: "ServiceNow_Sans_Mono", fontWeight: "Regular", example: "EYEBROW LARGE - MONO REGULAR, UPPERCASE" }
    ]
  },
  {
    name: "Eyebrow Small",
    lineHeight: "130% (1.3)",
    letterSpacing: "0",
    sizes: [
      { breakpoint: "XS (0–575px)", fontSize: "12px", fontFamily: "ServiceNow_Sans_Mono", fontWeight: "Regular", example: "EYEBROW SMALL - MONO REGULAR, UPPERCASE" },
      { breakpoint: "SM (576–767px)", fontSize: "12px", fontFamily: "ServiceNow_Sans_Mono", fontWeight: "Regular", example: "EYEBROW SMALL - MONO REGULAR, UPPERCASE" },
      { breakpoint: "MD (768–1023px)", fontSize: "12px", fontFamily: "ServiceNow_Sans_Mono", fontWeight: "Regular", example: "EYEBROW SMALL - MONO REGULAR, UPPERCASE" },
      { breakpoint: "LG (1024–1365px)", fontSize: "12px", fontFamily: "ServiceNow_Sans_Mono", fontWeight: "Regular", example: "EYEBROW SMALL - MONO REGULAR, UPPERCASE" },
      { breakpoint: "XL (1366–1679px)", fontSize: "12px", fontFamily: "ServiceNow_Sans_Mono", fontWeight: "Regular", example: "EYEBROW SMALL - MONO REGULAR, UPPERCASE" },
      { breakpoint: "XXL (1680px+)", fontSize: "12px", fontFamily: "ServiceNow_Sans_Mono", fontWeight: "Regular", example: "EYEBROW SMALL - MONO REGULAR, UPPERCASE" }
    ]
  },
  {
    name: "Caption",
    lineHeight: "150% (1.5)",
    letterSpacing: "0",
    sizes: [
      { breakpoint: "XS (0–575px)", fontSize: "14px", fontFamily: "ServiceNow_Sans", fontWeight: "Regular", example: "Caption - Regular" },
      { breakpoint: "SM (576–767px)", fontSize: "14px", fontFamily: "ServiceNow_Sans", fontWeight: "Regular", example: "Caption - Regular" },
      { breakpoint: "MD (768–1023px)", fontSize: "14px", fontFamily: "ServiceNow_Sans", fontWeight: "Regular", example: "Caption - Regular" },
      { breakpoint: "LG (1024–1365px)", fontSize: "14px", fontFamily: "ServiceNow_Sans", fontWeight: "Regular", example: "Caption - Regular" },
      { breakpoint: "XL (1366–1679px)", fontSize: "14px", fontFamily: "ServiceNow_Sans", fontWeight: "Regular", example: "Caption - Regular" },
      { breakpoint: "XXL (1680px+)", fontSize: "14px", fontFamily: "ServiceNow_Sans", fontWeight: "Regular", example: "Caption - Regular" }
    ]
  },
  {
    name: "Footnote",
    lineHeight: "150% (1.5)",
    letterSpacing: "-1% (-0.01em)",
    sizes: [
      { breakpoint: "XS (0–575px)", fontSize: "14px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Footnote - Light" },
      { breakpoint: "SM (576–767px)", fontSize: "14px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Footnote - Light" },
      { breakpoint: "MD (768–1023px)", fontSize: "14px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Footnote - Light" },
      { breakpoint: "LG (1024–1365px)", fontSize: "14px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Footnote - Light" },
      { breakpoint: "XL (1366–1679px)", fontSize: "14px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Footnote - Light" },
      { breakpoint: "XXL (1680px+)", fontSize: "14px", fontFamily: "ServiceNow_Sans", fontWeight: "Light", example: "Footnote - Light" }
    ]
  }
];

interface SelectedStyleDetail {
  styleName: string;
  breakpoint: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
}

interface TypographyPageProps {
  onBack: () => void;
}

export default function TypographyPage({ onBack }: TypographyPageProps) {
  const [selectedBreakpoint, setSelectedBreakpoint] = useState("XL (1366–1679px)");
  const [selectedStyle, setSelectedStyle] = useState<SelectedStyleDetail | null>(null);
  const [copiedCSS, setCopiedCSS] = useState(false);
  const [copiedClasses, setCopiedClasses] = useState(false);
  const [cssUnit, setCssUnit] = useState<'px' | 'rem'>('px');
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [sidePanelWidth, setSidePanelWidth] = useState(400); // 25rem = 400px
  const [isResizing, setIsResizing] = useState(false);

  const handleStyleClick = (style: TypeStyle) => {
    const currentSize = style.sizes.find(size => size.breakpoint === selectedBreakpoint) || style.sizes[0];
    setSelectedStyle({
      styleName: style.name,
      breakpoint: selectedBreakpoint,
      fontSize: currentSize.fontSize,
      fontFamily: currentSize.fontFamily,
      fontWeight: currentSize.fontWeight,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing
    });
    setShowMobileDetail(true); // Show detail panel on mobile
  };

  const handleBackToList = () => {
    setShowMobileDetail(false);
  };

  // Update selected style when breakpoint changes
  useEffect(() => {
    if (selectedStyle) {
      const typeStyle = typeStyles.find(s => s.name === selectedStyle.styleName);
      if (typeStyle) {
        const currentSize = typeStyle.sizes.find(size => size.breakpoint === selectedBreakpoint) || typeStyle.sizes[0];
        setSelectedStyle({
          styleName: typeStyle.name,
          breakpoint: selectedBreakpoint,
          fontSize: currentSize.fontSize,
          fontFamily: currentSize.fontFamily,
          fontWeight: currentSize.fontWeight,
          lineHeight: typeStyle.lineHeight,
          letterSpacing: typeStyle.letterSpacing
        });
      }
    }
  }, [selectedBreakpoint]);

  const getStyleForTypography = (style: TypeStyle, breakpoint: string) => {
    const currentSize = style.sizes.find(size => size.breakpoint === breakpoint) || style.sizes[0];
    return {
      fontFamily: getDisplayFontFamily(currentSize.fontFamily),
      fontSize: currentSize.fontSize, // Use actual font size, no scaling
      fontWeight: getFontWeightDetails(currentSize.fontWeight).actualWeight,
      lineHeight: style.lineHeight.split(' ')[1]?.replace('(', '').replace(')', '') || '1.5',
      letterSpacing: style.letterSpacing.includes('em') ? 
        style.letterSpacing.split(' ')[1]?.replace('(', '').replace(')', '') : '0'
    };
  };

  const getFontFamilyVariable = (fontFamily: string) => {
    return fontFamilyVariableMap[fontFamily as keyof typeof fontFamilyVariableMap] || "--Primary";
  };

  const getFontFamilyCSSClass = (fontFamily: string) => {
    return fontFamilyCSSClassMap[fontFamily as keyof typeof fontFamilyCSSClassMap] || ".sn";
  };

  const getFontFamilyCSSVariable = (fontFamily: string) => {
    return fontFamilyCSSVariableMap[fontFamily as keyof typeof fontFamilyCSSVariableMap] || "var(--now-font-family-sn-sans)";
  };

  const convertToPx = (value: string, baseFontSize: number = 16) => {
    if (value.includes('em')) {
      const emValue = parseFloat(value.replace('em', ''));
      return `${emValue * baseFontSize}px`;
    }
    return value;
  };

  const convertToRem = (value: string, baseFontSize: number = 16, isLetterSpacing: boolean = false) => {
    if (value.includes('px')) {
      const pxValue = parseFloat(value.replace('px', ''));
      const digits = isLetterSpacing ? 4 : 3;
      return `${(pxValue / baseFontSize).toFixed(digits)}rem`;
    }
    if (value.includes('em')) {
      return value.replace('em', 'rem');
    }
    return value;
  };

  const generateCSSCode = (style: SelectedStyleDetail) => {
    const breakpointComment = `/* ${style.breakpoint.split(' ')[0]} breakpoint/${style.styleName} */`;
    const fontFamilyValue = getFontFamilyCSSVariable(style.fontFamily);
    const fontSizeValue = cssUnit === 'rem' ? convertToRem(style.fontSize) : style.fontSize;
    const fontWeightValue = getFontWeightDetails(style.fontWeight).actualWeight;
    
    // Get line height in pixels first
    const lineHeightPx = style.lineHeight.includes('px') ? 
      style.lineHeight.split(' ')[0] : 
      `${Math.round(parseInt(style.fontSize) * parseFloat(style.lineHeight.split(' ')[1]?.replace('(', '').replace(')', '') || '1.5') * 10) / 10}px`;
    
    const lineHeightValue = cssUnit === 'rem' ? convertToRem(lineHeightPx, 16, false) : 
      `${parseFloat(lineHeightPx.replace('px', '')).toFixed(1)}px`;
    
    // Get letter spacing in pixels first  
    let letterSpacingPx = '0px';
    if (style.letterSpacing.includes('em')) {
      const emValue = parseFloat(style.letterSpacing.split(' ')[1]?.replace('(', '').replace(')', '') || '0');
      letterSpacingPx = `${(emValue * parseInt(style.fontSize)).toFixed(2)}px`;
    } else if (style.letterSpacing !== '0') {
      letterSpacingPx = `${parseFloat(style.letterSpacing.replace('px', '')).toFixed(2)}px`;
    } else {
      letterSpacingPx = '0.00px';
    }
    
    const letterSpacingValue = cssUnit === 'rem' ? 
      (letterSpacingPx === '0.00px' ? '0' : convertToRem(letterSpacingPx, 16, true)) : 
      letterSpacingPx;

    return `${breakpointComment}
font-family: ${fontFamilyValue};
font-size: ${fontSizeValue};
font-style: normal;
font-weight: ${fontWeightValue};
line-height: ${lineHeightValue}; /* ${style.lineHeight.split(' ')[0]} */
letter-spacing: ${letterSpacingValue};`;
  };

  const copyToClipboard = (text: string, type: 'css' | 'classes' = 'css') => {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Make it invisible and off-screen but still focusable
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      textArea.setAttribute('readonly', '');
      
      // Add to DOM
      document.body.appendChild(textArea);
      
      // Focus and select the text
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, textArea.value.length);
      
      // Execute copy command
      const successful = document.execCommand('copy');
      
      // Remove from DOM
      document.body.removeChild(textArea);
      
      if (successful) {
        // Set appropriate copied state
        if (type === 'css') {
          setCopiedCSS(true);
          setTimeout(() => setCopiedCSS(false), 1200);
        } else {
          setCopiedClasses(true);
          setTimeout(() => setCopiedClasses(false), 1200);
        }
        
        toast('Copied to clipboard', {
          style: {
            background: '#000',
            color: '#fff',
            border: 'none',
          },
          position: 'bottom-center',
          duration: 1500,
        });
      } else {
        throw new Error('Copy command failed');
      }
    } catch (err) {
      console.error('Copy failed:', err);
      toast('Failed to copy', {
        style: {
          background: '#000',
          color: '#fff',
          border: 'none',
        },
        position: 'bottom-center',
        duration: 1500,
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const containerWidth = window.innerWidth;
    const newSidePanelWidth = containerWidth - e.clientX;
    
    // Minimum width of 400px for side panel, maximum of 60% of container
    const minWidth = 400;
    const maxWidth = containerWidth * 0.6;
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newSidePanelWidth));
    
    setSidePanelWidth(clampedWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Add mouse event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const CodeBlock = ({ code }: { code: string }) => {
    const lines = code.split('\n');
    
    return (
      <div className="relative">
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
            <span className="text-gray-300 text-sm">Typography</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
              onClick={() => copyToClipboard(code, 'css')}
            >
              {copiedCSS ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <div className="p-4">
            <div className="font-mono text-sm">
              {lines.map((line, index) => (
                <div key={index} className="flex">
                  <span className="text-gray-500 select-none w-6 text-right mr-4 text-xs leading-5">
                    {index + 1}
                  </span>
                  <span className="text-gray-300 leading-5">
                    {line.includes('/*') ? (
                      <span className="text-green-400">{line}</span>
                    ) : line.includes(':') ? (
                      <>
                        <span className="text-blue-300">{line.split(':')[0]}:</span>
                        <span className="text-yellow-300">{line.split(':').slice(1).join(':')}</span>
                      </>
                    ) : (
                      line
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ minWidth: '576px' }}>
      <Toaster />
      <div className="flex h-screen">
        {/* Main Content - Hidden on small screens when detail is shown */}
        <div 
          className={`flex-1 p-4 sm:p-6 overflow-auto ${showMobileDetail ? 'hidden sm:flex sm:flex-col' : 'flex flex-col'}`}
          style={{
            width: selectedStyle ? `calc(100% - ${sidePanelWidth}px)` : '100%'
          }}
        >
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 
                  className="mb-2"
                  style={typographyStyles.h2}
                >
                  ServiceNow Sans Typography Explorer
                </h1>
                <p 
                  className="text-gray-600"
                  style={typographyStyles.bodySmall}
                >
                  Select a breakpoint and click on any typography style to view detailed CSS mappings
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-4">
                <label className="text-sm">Breakpoint:</label>
                <Select value={selectedBreakpoint} onValueChange={setSelectedBreakpoint}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Select breakpoint" />
                  </SelectTrigger>
                  <SelectContent>
                    {breakpoints.map((breakpoint) => (
                      <SelectItem key={breakpoint} value={breakpoint}>
                        {breakpoint}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="text-sm">CSS Units:</label>
                <Select value={cssUnit} onValueChange={(value: 'px' | 'rem') => setCssUnit(value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="px">px</SelectItem>
                    <SelectItem value="rem">rem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {typeStyles.map((style) => {
              const currentSize = style.sizes.find(size => size.breakpoint === selectedBreakpoint) || style.sizes[0];
              const isSelected = selectedStyle?.styleName === style.name;
              
              // Calculate actual line height and letter spacing values for current breakpoint
              const lineHeightPx = style.lineHeight.includes('px') ? 
                style.lineHeight.split(' ')[0] : 
                `${Math.round(parseInt(currentSize.fontSize) * parseFloat(style.lineHeight.split(' ')[1]?.replace('(', '').replace(')', '') || '1.5') * 10) / 10}px`;
              
              let letterSpacingPx = '0px';
              if (style.letterSpacing.includes('em')) {
                const emValue = parseFloat(style.letterSpacing.split(' ')[1]?.replace('(', '').replace(')', '') || '0');
                letterSpacingPx = `${(emValue * parseInt(currentSize.fontSize)).toFixed(2)}px`;
              } else if (style.letterSpacing !== '0') {
                letterSpacingPx = `${parseFloat(style.letterSpacing.replace('px', '')).toFixed(2)}px`;
              } else {
                letterSpacingPx = '0.00px';
              }
              
              const displayLineHeight = cssUnit === 'rem' ? convertToRem(lineHeightPx, 16, false) : 
                `${parseFloat(lineHeightPx.replace('px', '')).toFixed(1)}px`;
              const displayLetterSpacing = cssUnit === 'rem' ? 
                (letterSpacingPx === '0.00px' ? '0' : convertToRem(letterSpacingPx, 16, true)) : 
                letterSpacingPx;
              
              return (
                <Card 
                  key={style.name} 
                  className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                  onClick={() => handleStyleClick(style)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="mb-4">
                      <div 
                        className="select-none mb-3 overflow-hidden"
                        style={{
                          ...getStyleForTypography(style, selectedBreakpoint),
                          // Handle uppercase for eyebrow styles
                          textTransform: style.name.includes('Eyebrow') ? 'uppercase' : 'none'
                        }}
                      >
                        {style.name}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span>{currentSize.fontSize}</span>
                        <span>•</span>
                        <span>{getDisplayFontFamily(currentSize.fontFamily)}</span>
                        <span>•</span>
                        <span>{currentSize.fontWeight}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        Line Height: {displayLineHeight} <span className="text-gray-400">({style.lineHeight.split(' ')[0]})</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Letter Spacing: {displayLetterSpacing === '0' ? '0' : displayLetterSpacing}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Resize Handle - Only visible on larger screens when side panel is shown */}
        {selectedStyle && (
          <div 
            className="hidden sm:block w-1 bg-gray-200 cursor-col-resize hover:bg-gray-300 transition-colors relative group"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-y-0 -inset-x-1 group-hover:bg-blue-500/20" />
          </div>
        )}

        {/* Side Panel - Full width on small screens when detail is shown, resizable width on larger screens */}
        <div 
          className={`bg-white border-l border-gray-200 p-4 sm:p-6 overflow-auto ${
            showMobileDetail ? 'fixed inset-0 z-50 sm:relative' : 'hidden sm:block'
          } ${selectedStyle ? '' : 'hidden sm:block'}`}
          style={{
            width: showMobileDetail && window.innerWidth < 640 ? '100%' : `${sidePanelWidth}px`
          }}
        >
          {selectedStyle ? (
            <div className="space-y-6">
              {/* Small screen back button */}
              <div className="flex items-center gap-4 sm:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h3 style={typographyStyles.h5}>
                    {selectedStyle.styleName}
                  </h3>
                  <p className="text-sm text-gray-600">{selectedStyle.breakpoint}</p>
                </div>
              </div>
              
              {/* Larger screen header */}
              <div className="hidden sm:block">
                <h3 
                  className="mb-1"
                  style={typographyStyles.h5}
                >
                  {selectedStyle.styleName}
                </h3>
                <p className="text-sm text-gray-600">{selectedStyle.breakpoint}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 
                    className="mb-3"
                    style={typographyStyles.h5}
                  >
                    CSS Properties
                  </h3>
                  <CodeBlock code={generateCSSCode(selectedStyle)} />
                </div>

                <div>
                  <h3 
                    className="mb-3"
                    style={typographyStyles.h5}
                  >
                    Design System Mapping
                  </h3>
                  <div className="space-y-4 text-sm">
                    {/* Column Headers */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">Figma Variable</div>
                      </div>
                      <div className="w-4"></div> {/* Spacer for arrow */}
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">Figma Value</div>
                      </div>
                      <div className="w-4"></div> {/* Spacer for arrow */}
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">CSS Classes</div>
                      </div>
                    </div>

                    {/* Font Family Mapping */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Badge variant="secondary" className="text-xs">{getFontFamilyVariable(selectedStyle.fontFamily)}</Badge>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1">
                        <Badge variant="outline" className="text-xs">{getDisplayFontFamily(selectedStyle.fontFamily)}</Badge>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1">
                        <Badge variant="outline" className="text-xs">{getFontFamilyCSSClass(selectedStyle.fontFamily)}</Badge>
                      </div>
                    </div>

                    {/* Font Weight Mapping */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Badge variant="secondary" className="text-xs">--{getFontWeightDetails(selectedStyle.fontWeight).figmaVariable}</Badge>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1">
                        <Badge variant="outline" className="text-xs">{getFontWeightDetails(selectedStyle.fontWeight).designToken}</Badge>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1">
                        <Badge variant="outline" className="text-xs">{getFontWeightDetails(selectedStyle.fontWeight).cssClass}</Badge>
                      </div>
                    </div>

                    {/* Combined CSS Classes */}
                    <div className="pt-2">
                      <div className="text-xs text-gray-500 mb-1">Combined CSS Classes</div>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {getFontFamilyCSSClass(selectedStyle.fontFamily)}.{getFontWeightDetails(selectedStyle.fontWeight).cssClass.replace('.', '')}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          onClick={() => copyToClipboard(
                            `${getFontFamilyCSSClass(selectedStyle.fontFamily)}.${getFontWeightDetails(selectedStyle.fontWeight).cssClass.replace('.', '')}`,
                            'classes'
                          )}
                        >
                          {copiedClasses ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 
                    className="mb-3"
                    style={{
                      fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
                      fontSize: "22px", // H3 XS breakpoint
                      fontWeight: getFontWeightDetails("Bold").actualWeight,
                      lineHeight: "110%",
                      letterSpacing: "-0.01em"
                    }}
                  >
                    Preview
                  </h3>
                  <div 
                    className="p-4 border rounded bg-white text-sm overflow-hidden break-words"
                    style={{
                      fontFamily: getDisplayFontFamily(selectedStyle.fontFamily),
                      fontSize: selectedStyle.fontSize,
                      fontWeight: getFontWeightDetails(selectedStyle.fontWeight).actualWeight,
                      lineHeight: selectedStyle.lineHeight.split(' ')[1]?.replace('(', '').replace(')', '') || '1.5',
                      letterSpacing: selectedStyle.letterSpacing.includes('em') ? 
                        selectedStyle.letterSpacing.split(' ')[1]?.replace('(', '').replace(')', '') : '0',
                      wordWrap: 'break-word',
                      hyphens: 'auto'
                    }}
                  >
                    The quick brown fox jumps over the lazy dog. Typography is the art and technique of arranging type.
                  </div>
                </div>

                <div>
                  <h3 
                    className="mb-3"
                    style={{
                      fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
                      fontSize: "22px", // H3 XS breakpoint
                      fontWeight: getFontWeightDetails("Bold").actualWeight,
                      lineHeight: "110%",
                      letterSpacing: "-0.01em"
                    }}
                  >
                    All Breakpoints
                  </h3>
                  <div className="space-y-2 text-xs">
                    {typeStyles.find(s => s.name === selectedStyle.styleName)?.sizes.map((size) => (
                      <div key={size.breakpoint} className="flex justify-between py-1 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-600">{size.breakpoint.split(' ')[0]}:</span>
                        <span>{size.fontSize}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-12 hidden sm:block">
              <h3 
                className="mb-2"
                style={{
                  fontFamily: getDisplayFontFamily("ServiceNow_Sans"),
                  fontSize: "22px", // H3 XS breakpoint
                  fontWeight: getFontWeightDetails("Bold").actualWeight,
                  lineHeight: "110%",
                  letterSpacing: "-0.01em"
                }}
              >
                Select a Typography Style
              </h3>
              <p className="text-sm">Choose a breakpoint and click on any typography style to view detailed information and CSS properties.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}