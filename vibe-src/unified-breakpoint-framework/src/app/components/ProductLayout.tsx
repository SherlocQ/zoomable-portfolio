import React, { useState } from 'react';

interface ProductLayoutProps {
  width: number;
  canvasOffset: number;
  layoutType?: string;
}

// ServiceNow Icon Logo Component (for XS breakpoint)
function ServiceNowIconLogo() {
  return (
    <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M16.0935 0.6879C7.32602 0.637101 0.0737472 7.81098 0.00054844 16.6116C-0.0374509 21.2703 1.90172 25.4763 5.02606 28.4338C6.16244 29.5086 7.91921 29.613 9.15199 28.6514C10.9732 27.2298 13.3119 26.3823 16.0003 26.3823C18.6886 26.3823 21.0274 27.2298 22.8486 28.6514C24.0913 29.621 25.8553 29.497 26.9985 28.4102C30.0784 25.4831 32 21.3395 32 16.7468C32 7.90938 24.8857 0.737899 16.0939 0.6875M15.9999 24.7771C11.2508 24.7771 8.00041 21.2011 8.00041 16.778C8.00041 12.3549 11.2508 8.71696 15.9999 8.71696C20.749 8.71696 23.9989 12.3529 23.9989 16.778C23.9989 21.2031 20.7506 24.7771 15.9999 24.7771Z" fill="#62D84E"/>
    </svg>
  );
}

// ServiceNow Text Logo Component (for SM+ breakpoints)
function ServiceNowTextLogo() {
  return (
    <svg width="152" height="26" viewBox="0 0 152 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_37855_33144)">
        <path fillRule="evenodd" clipRule="evenodd" d="M42.6814 6.46875C41.1474 6.46875 39.8135 7.00232 38.6797 7.86936V6.60214H35.0781V20.6749H38.8131V11.671C39.3467 10.9374 40.6139 9.93693 42.2146 9.93693C42.8148 9.93693 43.2817 10.0036 43.7486 10.137V6.53544C43.4151 6.46875 43.0149 6.46875 42.6814 6.46875Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M9.80079 16.4073C10.7345 17.2743 12.2018 17.8079 13.6691 17.8079C14.6696 17.8079 15.4699 17.341 15.4699 16.6074C15.4699 14.4731 8.66696 15.2735 8.66696 10.6715C8.66696 7.93693 11.2681 6.26953 14.0693 6.26953C15.8701 6.26953 17.871 6.93649 18.8047 7.67014L17.0706 10.4047C16.337 9.8711 15.4032 9.47093 14.4028 9.47093C13.3357 9.47093 12.4686 9.8711 12.4686 10.6048C12.4686 12.4055 19.2716 11.7386 19.2716 16.6074C19.2716 19.3419 16.6038 20.9426 13.6691 20.9426C11.735 20.9426 9.66739 20.2756 8 19.0751L9.80079 16.4073Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M33.4804 13.5391C33.4804 9.60403 30.7458 6.33594 26.8775 6.33594C22.6756 6.33594 20.0078 9.73742 20.0078 13.6725C20.0078 18.0744 23.1425 21.009 27.3443 21.009C29.5453 21.009 31.7463 20.0753 33.0802 18.4746L30.9459 16.3403C30.279 17.074 29.0117 17.941 27.411 17.941C25.4102 17.941 23.8095 16.6071 23.6094 14.6062H33.347C33.4137 14.2727 33.4804 13.9393 33.4804 13.5391ZM23.8095 11.8717C24.0096 10.6045 25.2768 9.40394 26.8108 9.40394C28.3448 9.40394 29.4786 10.6045 29.612 11.8717H23.8095Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M52.7565 15.2073L56.5582 6.60352H60.4932L54.0238 20.743H51.4226L44.9531 6.60352H48.8882L52.7565 15.2073V" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M63.6943 0C65.0282 0 66.162 1.06713 66.162 2.40105C66.162 3.73496 65.0282 4.8021 63.6943 4.8021C62.3604 4.8021 61.2266 3.73496 61.2266 2.40105C61.2266 1.06713 62.2937 0 63.6943 0Z" fill="white"/>
        <path d="M65.4928 6.60352H61.7578V20.6763H65.4928V6.60352Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M81.0957 17.8076C79.4283 20.0086 77.3607 21.009 74.6929 21.009C70.3576 21.009 67.1562 17.7409 67.1562 13.6725C67.1562 9.60403 70.4243 6.33594 74.6929 6.33594C77.0939 6.33594 79.2949 7.46977 80.6288 9.13716L77.961 11.4715C77.2273 10.4711 76.0935 9.80412 74.6929 9.80412C72.4919 9.80412 70.8912 11.5382 70.8912 13.6725C70.8912 15.8734 72.4919 17.5408 74.7596 17.5408C76.2936 17.5408 77.4941 16.6071 78.0944 15.6733L81.0957 17.8076Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M94.7677 18.4746C93.4338 20.0753 91.1661 21.009 89.0318 21.009C84.83 21.009 81.6953 18.0744 81.6953 13.6725C81.6953 9.73742 84.3631 6.33594 88.565 6.33594C92.4333 6.33594 95.1679 9.60403 95.1679 13.5391C95.1679 13.9393 95.1679 14.2727 95.1012 14.6062H85.3636C85.5637 16.6071 87.1644 17.941 89.1652 17.941C90.7659 17.941 92.0332 17.0073 92.7001 16.3403L94.7677 18.4746ZM91.2995 11.8717C91.1661 10.6045 90.0323 9.40394 88.4983 9.40394C86.9643 9.40394 85.6304 10.6045 85.497 11.8717H91.2995Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M96.6406 20.7422V6.60272H100.242V7.73655C101.309 6.8695 102.643 6.33594 104.244 6.33594C106.178 6.33594 107.979 7.20298 109.113 8.60359C110.046 9.73742 110.58 11.138 110.58 13.5391V20.7422H106.845V13.2723C106.845 11.8717 106.512 11.138 105.978 10.6045C105.511 10.1376 104.711 9.80412 103.844 9.80412C102.243 9.80412 100.976 10.8046 100.442 11.5382V20.6755H96.6406V20.7422Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M120.247 6.33594C115.778 6.33594 112.043 10.0042 111.977 14.5395C111.977 16.9406 112.977 19.0748 114.578 20.6088C115.178 21.1424 116.045 21.2091 116.712 20.7422C117.646 20.0086 118.846 19.6084 120.247 19.6084C121.647 19.6084 122.848 20.0753 123.782 20.7422C124.449 21.2091 125.316 21.2091 125.916 20.6088C127.517 19.0748 128.45 17.0073 128.45 14.6062C128.384 10.0042 124.782 6.33594 120.247 6.33594ZM120.18 18.6747C117.712 18.6747 116.045 16.8072 116.045 14.5395C116.045 12.2719 117.712 10.4044 120.18 10.4044C122.648 10.4044 124.315 12.2719 124.315 14.5395C124.315 16.8739 122.648 18.6747 120.18 18.6747Z" fill="#62D84E"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M135.857 20.743H133.056L127.453 6.60352H131.255L134.323 14.6737L137.324 6.60352H140.459L143.46 14.6737L146.528 6.60352H150.263L144.661 20.743H141.859L138.858 12.6728L135.857 20.743Z" fill="white"/>
        <path d="M150.327 19.1414H149.993V19.7416H149.727V18.0742H150.394C150.66 18.0742 150.927 18.341 150.927 18.6078C150.927 18.8079 150.794 19.008 150.594 19.0747L150.994 19.7416H150.727L150.327 19.1414ZM149.993 18.8746H150.394C150.527 18.8746 150.66 18.7412 150.66 18.6078C150.66 18.4744 150.527 18.341 150.394 18.341H149.993V18.8746Z" fill="white"/>
        <path d="M150.265 17.4071C151.132 17.4071 151.799 18.0741 151.799 18.9411C151.799 19.8082 151.132 20.4751 150.265 20.4751C149.398 20.4751 148.731 19.8082 148.731 18.9411C148.731 18.0741 149.465 17.4071 150.265 17.4071ZM150.265 17.207C149.265 17.207 148.531 18.0074 148.531 18.9411C148.531 19.9416 149.332 20.6752 150.265 20.6752C151.266 20.6752 151.999 19.8749 151.999 18.9411C152.066 17.9407 151.266 17.207 150.265 17.207Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip0_37855_33144">
          <rect width="144" height="22" fill="white" transform="translate(8)"/>
        </clipPath>
      </defs>
    </svg>
  );
}

// Profile Image Component (for LG+ breakpoints)
function ProfileImage() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="12" fill="white"/>
      <path d="M19.7106 25.196C18.2126 25.196 17.0786 24.552 16.4766 23.334L18.1426 22.382C18.4506 22.998 18.8986 23.306 19.7106 23.306C20.7746 23.306 21.2366 22.746 21.2366 21.948V15.2H23.1546V21.948C23.1546 24.062 21.6426 25.196 19.7106 25.196Z" fill="#1D1D1D"/>
    </svg>
  );
}

// Caret Icon Component (for L1 navigation dropdown)
function CaretIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.9975 9.5344L12.5394 16.2889C12.258 16.5704 11.8358 16.5704 11.5544 16.2889L4.00246 9.5344C3.67412 9.25296 3.67412 8.7839 3.95555 8.50246C4.23699 8.17412 4.70606 8.17412 4.98749 8.45555L12.0235 14.741L19.0125 8.45555C19.2939 8.17412 19.763 8.17412 20.0444 8.50246C20.3259 8.7839 20.3259 9.25296 19.9975 9.5344Z" fill="#1D1D1D"/>
    </svg>
  );
}

const getLayoutConfig = (width: number) => {
  // Content max width is 1680px, then centered
  const contentWidth = Math.min(width, 1680);
  const shouldCenter = width > 1680;
  
  // Updated specification: XS:16px, SM:24px, MD:32px, XL:40px, XXL:48px
  if (contentWidth >= 1680) {
    return { gutter: 48, margin: 48, maxWidth: contentWidth, centered: shouldCenter, breakpoint: 'XXL' };
  } else if (contentWidth >= 1366) {
    return { gutter: 40, margin: 40, maxWidth: contentWidth, centered: shouldCenter, breakpoint: 'XL' };
  } else if (contentWidth >= 768) {
    return { gutter: 32, margin: 32, maxWidth: contentWidth, centered: shouldCenter, breakpoint: 'MD' };
  } else if (contentWidth >= 576) {
    return { gutter: 24, margin: 24, maxWidth: contentWidth, centered: shouldCenter, breakpoint: 'SM' };
  } else {
    return { gutter: 16, margin: 16, maxWidth: contentWidth, centered: shouldCenter, breakpoint: 'XS' };
  }
};

export function ProductLayout({ width, canvasOffset, layoutType = 'dashboard' }: ProductLayoutProps) {
  // State for L0 navigation carousel
  const [l0CarouselPosition, setL0CarouselPosition] = useState(0);

  const config = getLayoutConfig(width);
  const { gutter, margin, maxWidth, centered } = config;
  
  // Check if this is a simplified layout
  const isSimplifiedLayout = layoutType === 'two-column' || layoutType === 'three-column';
  
  // Calculate how many columns fit based on content width (not canvas width) and layout type
  const getColumnsCount = () => {
    if (layoutType === 'three-column') {
      return 3; // Always 3 columns
    } else if (layoutType === 'two-column') {
      return 2; // Always 2 columns
    } else {
      // Dashboard layout - responsive
      if (maxWidth >= 1024) return 3; // Three columns for large screens (1024px+)
      if (maxWidth >= 576) return 2;  // Two columns for medium screens (576px+)
      return 1; // Single column for small screens (< 576px)
    }
  };

  const columnsCount = getColumnsCount();

  // Calculate search width based on responsive grid using content width
  const getSearchWidth = () => {
    if (maxWidth >= 1024) {
      // 8 columns out of 12 for >= 1024px
      const contentLayoutWidth = maxWidth - (margin * 2);
      const columnWidth = (contentLayoutWidth - (gutter * 11)) / 12;
      return (columnWidth * 8) + (gutter * 7);
    } else {
      // 12 columns (full width) for < 1024px
      const contentLayoutWidth = maxWidth - (margin * 2);
      return contentLayoutWidth;
    }
  };

  const searchWidth = getSearchWidth();

  // Content container styles for centering when > 1680px (for cards and main content only)
  const getContentContainerStyle = () => {
    if (centered) {
      return {
        maxWidth: '1680px', // Always cap at 1680px
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%' // Ensure full width up to maxWidth
      };
    }
    return {
      width: '100%',
    };
  };

  const contentContainerStyle = getContentContainerStyle();

  // Helper function to get responsive skeleton widths
  const getSkeletonWidths = () => {
    if (maxWidth < 576) {
      // XS: Scale down for mobile
      return {
        title: 'w-48', // ~75% of available space
        subtitle: 'w-32', // ~50% of available space  
        text: 'w-40', // ~62% of available space
        longText: 'w-56', // ~87% of available space
        button: 'w-24', // ~37% of available space
        medium: 'w-36', // ~56% of available space
      };
    } else if (maxWidth < 768) {
      // SM: Moderate scaling
      return {
        title: 'w-56',
        subtitle: 'w-40',
        text: 'w-48',
        longText: 'w-64',
        button: 'w-28',
        medium: 'w-44',
      };
    } else {
      // MD and above: Original sizes
      return {
        title: 'w-64',
        subtitle: 'w-48',
        text: 'w-56',
        longText: 'w-72',
        button: 'w-32',
        medium: 'w-52',
      };
    }
  };

  const skeletonWidths = getSkeletonWidths();

  // Calculate L0 navigation carousel for 1024-1439px range
  const getL0NavigationDisplay = () => {
    const navItems = ['MyNow', 'Products', 'Industries', 'Learning', 'Support', 'Partners', 'Company'];
    
    // Only apply carousel logic for LG range (1024-1439px)
    if (maxWidth < 1024 || maxWidth >= 1440) {
      return {
        visibleItems: navItems,
        showLeftArrow: false,
        showRightArrow: false,
        canScrollLeft: false,
        canScrollRight: false
      };
    }

    // Calculate available space for navigation items
    const logoWidth = 152; // ServiceNow text logo width
    const utilityIconsWidth = 3 * 40 + 2 * 16; // 3 icons with gaps
    const profileImageWidth = 40;
    const gapBetweenSections = 48; // 12 * 4 = 48px gap
    const arrowWidth = 24; // Carousel arrow width
    const arrowGap = 16; // Gap around arrows
    
    // Available width for navigation items
    let availableWidth = maxWidth - (margin * 2) - logoWidth - (gapBetweenSections * 2) - utilityIconsWidth - profileImageWidth;
    
    // Reserve space for arrows (they're shown when needed)
    availableWidth -= (arrowWidth * 2 + arrowGap * 2);
    
    // Estimated widths for each nav item (text width + dropdown icon + padding)
    const itemWidths = [50, 64, 76, 60, 56, 60, 64]; // Approximate widths for each item
    const itemGap = 32; // 8 * 4 = 32px gap between items
    
    // Calculate how many items can fit
    let totalWidth = 0;
    let visibleCount = 0;
    
    for (let i = 0; i < navItems.length; i++) {
      const itemWidth = itemWidths[i] + (i > 0 ? itemGap : 0);
      
      if (totalWidth + itemWidth <= availableWidth) {
        totalWidth += itemWidth;
        visibleCount++;
      } else {
        break;
      }
    }
    
    // Ensure at least one item is visible
    visibleCount = Math.max(1, Math.min(visibleCount, navItems.length));
    
    // Calculate which items to show based on carousel position
    const startIndex = Math.max(0, Math.min(l0CarouselPosition, navItems.length - visibleCount));
    const endIndex = startIndex + visibleCount;
    const visibleItems = navItems.slice(startIndex, endIndex);
    
    const canScrollLeft = startIndex > 0;
    const canScrollRight = endIndex < navItems.length;
    
    return {
      visibleItems,
      showLeftArrow: canScrollLeft,
      showRightArrow: canScrollRight,
      canScrollLeft,
      canScrollRight
    };
  };

  const l0NavDisplay = getL0NavigationDisplay();

  // Carousel navigation functions
  const scrollL0Left = () => {
    if (l0NavDisplay.canScrollLeft) {
      setL0CarouselPosition(Math.max(0, l0CarouselPosition - 1));
    }
  };

  const scrollL0Right = () => {
    if (l0NavDisplay.canScrollRight) {
      setL0CarouselPosition(l0CarouselPosition + 1);
    }
  };

  // Calculate responsive tab display for L1 navigation with improved carousel logic
  const getTabDisplay = () => {
    const tabs = ['Home', 'Tasks', 'Cases', 'Instances', 'Products', 'Users'];
    
    // For screens < 1024px, don't show tabs at all - use caret instead
    if (maxWidth < 1024) {
      return {
        visibleTabs: [],
        hiddenCount: 0,
        showTabs: false,
        showCarouselArrows: false,
        showCaret: true
      };
    }
    
    // Estimate widths for responsive calculation
    const logoAreaWidth = 120; // Logo + icon + name
    const createButtonWidth = 96; // Create button
    const tabGap = 32; // 8 * 4 = 32px gap between tabs
    const carouselArrowWidth = 32; // Width for each carousel arrow
    
    // Calculate available space for tabs
    let availableWidth = maxWidth - (margin * 2) - logoAreaWidth - createButtonWidth - (tabGap * 2);
    
    // For 1024-1439px range, reserve space for carousel arrows
    const isCarouselRange = maxWidth >= 1024 && maxWidth < 1440;
    if (isCarouselRange) {
      availableWidth -= (carouselArrowWidth * 2 + tabGap); // Reserve space for left and right arrows
    }
    
    // Estimated tab widths (skeleton widths)
    const tabWidths = [48, 48, 48, 72, 64, 48]; // Approximate widths for each tab
    
    // Calculate how many tabs can fit
    let totalWidth = 0;
    let visibleCount = 0;
    
    for (let i = 0; i < tabs.length; i++) {
      const tabWidth = tabWidths[i] + (i > 0 ? tabGap : 0);
      
      if (totalWidth + tabWidth <= availableWidth) {
        totalWidth += tabWidth;
        visibleCount++;
      } else {
        break;
      }
    }
    
    // Ensure at least one tab is visible if there's space
    visibleCount = Math.max(1, Math.min(visibleCount, tabs.length));
    
    const visibleTabs = tabs.slice(0, visibleCount);
    const hiddenCount = tabs.length - visibleCount;
    
    // Show carousel arrows only in 1024-1439px range AND when there are hidden tabs
    const showCarouselArrows = isCarouselRange && hiddenCount > 0;
    
    return { 
      visibleTabs, 
      hiddenCount, 
      showTabs: true,
      showCarouselArrows,
      showCaret: false
    };
  };

  const tabDisplay = getTabDisplay();

  // L0 Navigation responsive configuration
  const getL0NavigationConfig = () => {
    if (maxWidth < 576) {
      // XS: Icon logo + 2 utility icons + hamburger
      return {
        logoType: 'icon', // Small icon logo
        showNavigation: false,
        utilityIconCount: 2,
        showHamburger: true,
        showCarouselArrows: false,
        showProfileImage: false
      };
    } else if (maxWidth < 768) {
      // SM: Full logo + 2 utility icons + hamburger
      return {
        logoType: 'full', // Full logo
        showNavigation: false,
        utilityIconCount: 2,
        showHamburger: true,
        showCarouselArrows: false,
        showProfileImage: false
      };
    } else if (maxWidth < 1024) {
      // MD: Full logo + 3 utility icons + hamburger
      return {
        logoType: 'full', // Full logo
        showNavigation: false,
        utilityIconCount: 3,
        showHamburger: true,
        showCarouselArrows: false,
        showProfileImage: false
      };
    } else if (maxWidth < 1440) {
      // LG: Full logo + full navigation + 3 utility icons + profile image + carousel arrows
      return {
        logoType: 'full', // Full logo
        showNavigation: true,
        utilityIconCount: 3,
        showHamburger: false,
        showCarouselArrows: l0NavDisplay.showLeftArrow || l0NavDisplay.showRightArrow,
        showProfileImage: true
      };
    } else {
      // XL: Full logo + full navigation + 3 utility icons + profile image (no carousel arrows)
      return {
        logoType: 'full', // Full logo
        showNavigation: true,
        utilityIconCount: 3,
        showHamburger: false,
        showCarouselArrows: false,
        showProfileImage: true
      };
    }
  };

  const l0Config = getL0NavigationConfig();

  // Generate unique pattern ID for each instance
  const patternId = `pattern-${Math.random().toString(36).substr(2, 9)}`;

  // Calculate exact content area height for simplified layouts - UPDATED with proper spacing
  const getSimplifiedContentAreaHeight = () => {
    const canvasHeight = 810; // Fixed canvas height from App.tsx
    const primaryNavHeight = 64; // L0 navigation height
    const bottomSpacing = gutter; // Add spacing between content and footer
    
    // Calculate footer height based on responsive layout
    let footerHeight = 69; // Base height for large screens
    if (maxWidth < 768) {
      footerHeight = 120; // Approximate height for small screens with stacked layout
    } else if (maxWidth < 1024) {
      footerHeight = 90; // Approximate height for medium screens
    }
    
    return canvasHeight - primaryNavHeight - footerHeight - bottomSpacing;
  };

  const simplifiedContentAreaHeight = getSimplifiedContentAreaHeight();

  // Render simplified empty columns for 2-column and 3-column layouts - UPDATED with proper spacing
  const renderSimplifiedContent = () => {
    return (
      <div 
        className="flex flex-col"
        style={{ 
          height: `${simplifiedContentAreaHeight}px`, // Reduced height to account for bottom spacing
          paddingTop: gutter,
          paddingBottom: gutter, // Add bottom spacing between content and footer
        }}
      >
        {/* Use the same content container system as dashboard for 1680px max width and centering */}
        <div style={contentContainerStyle} className="flex-1 flex flex-col">
          <div
            className="flex-1 flex flex-col"
            style={{
              paddingLeft: margin,
              paddingRight: margin,
            }}
          >
            {/* Grid that fills remaining space */}
            <div 
              className="grid flex-1"
              style={{
                gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
                gap: gutter,
              }}
            >
              {Array.from({ length: columnsCount }, (_, colIndex) => (
                <div 
                  key={colIndex} 
                  className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
                  style={{
                    borderStyle: 'dashed',
                    borderWidth: '2px',
                    borderColor: '#d1d5db'
                  }}
                  data-inspect-type={`Column ${colIndex + 1}`}
                >
                  {/* Diagonal line pattern background */}
                  <svg className="absolute inset-0 size-full stroke-gray-900/10" fill="none">
                    <defs>
                      <pattern id={`${patternId}-${colIndex}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                      </pattern>
                    </defs>
                    <rect stroke="none" fill={`url(#${patternId}-${colIndex})`} width="100%" height="100%"></rect>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render dashboard layout content (existing complex layout) - UNCHANGED
  const renderDashboardContent = () => {
    return (
      <>
        {/* Banner Section with Search */}
        <div 
          style={{
            paddingBottom: gutter,
          }}
          data-inspect-type="Banner Section"
        >
          <div style={contentContainerStyle}>
            <div 
              className="flex flex-col items-center justify-center text-center"
              style={{
                paddingLeft: margin,
                paddingRight: margin,
                paddingTop: gutter,
              }}
            >
              <div className={`${skeletonWidths.title} h-6 bg-gray-300 rounded mb-6`}></div>
              {/* Responsive search bar */}
              <div 
                className="h-12 bg-white rounded-full shadow-lg border border-gray-200 mb-4"
                style={{ width: searchWidth }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Product Cards */}
        <div 
          style={{
            paddingTop: gutter,
            paddingBottom: gutter * 1.5,
          }}
        >
          <div style={contentContainerStyle}>
            <div
              style={{
                paddingLeft: margin,
                paddingRight: margin,
              }}
            >
              <div 
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
                  gap: gutter,
                }}
              >
                {/* Column 1 */}
                <div className="flex flex-col" style={{ gap: gutter }} data-inspect-type="Column 1">
                  {/* Tasks Card - Always position 1 */}
                  <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    {/* Task Card Header */}
                    <div className="bg-[#bddae2] h-14 px-6 flex items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-300 rounded"></div>
                        <div className="w-20 h-4 bg-gray-300 rounded"></div>
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                    
                    {/* Task Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-8 h-4 bg-gray-300 rounded"></div>
                        <div className="w-12 h-3 bg-gray-300 rounded"></div>
                      </div>
                      <div className={`${skeletonWidths.title} h-5 bg-gray-300 rounded mb-3`}></div>
                      <div className={`${skeletonWidths.longText} h-4 bg-gray-300 rounded mb-4`}></div>
                      <div className={`${skeletonWidths.button} h-8 bg-[#62D84E] rounded-lg`}></div>
                    </div>
                  </div>

                  {/* Training Card - 3 columns: position 4, 2 columns: position 3, 1 column: position 4 */}
                  {columnsCount >= 3 && (
                    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                      {/* Card Background Image Area */}
                      <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200"></div>
                      
                      {/* Card Content */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`${skeletonWidths.button} h-3 bg-gray-300 rounded`}></div>
                          <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        </div>
                        <div className={`${skeletonWidths.title} h-5 bg-gray-300 rounded mb-2`}></div>
                        <div className={`${skeletonWidths.longText} h-3 bg-gray-300 rounded mb-4`}></div>
                        <div className={`${skeletonWidths.button} h-8 bg-[#62D84E] rounded-lg`}></div>
                      </div>
                    </div>
                  )}

                  {/* In 2-column layout, show PDI card (original position 3) */}
                  {columnsCount === 2 && (
                    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                      {/* Card Background */}
                      <div className="h-32 bg-gradient-to-r from-green-100 to-green-200"></div>
                      
                      {/* Card Content */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`${skeletonWidths.text} h-3 bg-gray-300 rounded`}></div>
                          <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        </div>
                        <div className={`${skeletonWidths.title} h-5 bg-gray-300 rounded mb-2`}></div>
                        <div className={`${skeletonWidths.longText} h-3 bg-gray-300 rounded mb-4`}></div>
                        <div className={`${skeletonWidths.medium} h-8 bg-[#62D84E] rounded-lg`}></div>
                      </div>
                    </div>
                  )}

                  {/* In 2-column layout, show Event card (original position 5) */}
                  {columnsCount === 2 && (
                    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                      {/* Card Background */}
                      <div className="h-32 bg-gradient-to-r from-purple-100 to-purple-200"></div>
                      
                      {/* Card Content */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-3 bg-gray-300 rounded"></div>
                          <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        </div>
                        <div className={`${skeletonWidths.button} h-5 bg-gray-300 rounded mb-2`}></div>
                        <div className={`${skeletonWidths.text} h-3 bg-gray-300 rounded mb-1`}></div>
                        <div className={`${skeletonWidths.title} h-3 bg-gray-300 rounded mb-4`}></div>
                        <div className="w-20 h-8 bg-[#62D84E] rounded-lg"></div>
                      </div>
                    </div>
                  )}

                  {/* In 2-column layout, show Prompt Card 2 (original position 7) */}
                  {columnsCount === 2 && (
                    <div className="bg-white rounded-3xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-16 h-3 bg-gray-300 rounded"></div>
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      </div>
                      <div className={`${skeletonWidths.title} h-5 bg-gray-300 rounded`}></div>
                    </div>
                  )}

                  {/* In single-column layout, show all remaining cards */}
                  {columnsCount === 1 && (
                    <>
                      {/* Prompt Card 1 - position 2 */}
                      <div className="bg-white rounded-3xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`${skeletonWidths.button} h-3 bg-gray-300 rounded`}></div>
                          <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        </div>
                        <div className={`${skeletonWidths.longText} h-5 bg-gray-300 rounded`}></div>
                      </div>

                      {/* PDI Card - position 3 */}
                      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                        {/* Card Background */}
                        <div className="h-32 bg-gradient-to-r from-green-100 to-green-200"></div>
                        
                        {/* Card Content */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`${skeletonWidths.text} h-3 bg-gray-300 rounded`}></div>
                            <div className="w-4 h-4 bg-gray-300 rounded"></div>
                          </div>
                          <div className={`${skeletonWidths.title} h-5 bg-gray-300 rounded mb-2`}></div>
                          <div className={`${skeletonWidths.longText} h-3 bg-gray-300 rounded mb-4`}></div>
                          <div className={`${skeletonWidths.medium} h-8 bg-[#62D84E] rounded-lg`}></div>
                        </div>
                      </div>

                      {/* Training Card - position 4 */}
                      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                        {/* Card Background Image Area */}
                        <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200"></div>
                        
                        {/* Card Content */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`${skeletonWidths.button} h-3 bg-gray-300 rounded`}></div>
                            <div className="w-4 h-4 bg-gray-300 rounded"></div>
                          </div>
                          <div className={`${skeletonWidths.title} h-5 bg-gray-300 rounded mb-2`}></div>
                          <div className={`${skeletonWidths.longText} h-3 bg-gray-300 rounded mb-4`}></div>
                          <div className={`${skeletonWidths.button} h-8 bg-[#62D84E] rounded-lg`}></div>
                        </div>
                      </div>

                      {/* Event Card - position 5 */}
                      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                        {/* Card Background */}
                        <div className="h-32 bg-gradient-to-r from-purple-100 to-purple-200"></div>
                        
                        {/* Card Content */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-3 bg-gray-300 rounded"></div>
                            <div className="w-4 h-4 bg-gray-300 rounded"></div>
                          </div>
                          <div className={`${skeletonWidths.button} h-5 bg-gray-300 rounded mb-2`}></div>
                          <div className={`${skeletonWidths.text} h-3 bg-gray-300 rounded mb-1`}></div>
                          <div className={`${skeletonWidths.title} h-3 bg-gray-300 rounded mb-4`}></div>
                          <div className="w-20 h-8 bg-[#62D84E] rounded-lg"></div>
                        </div>
                      </div>

                      {/* Products Prompt Card - position 6 */}
                      <div className="bg-white rounded-3xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-16 h-3 bg-gray-300 rounded"></div>
                          <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        </div>
                        <div className={`${skeletonWidths.text} h-5 bg-gray-300 rounded`}></div>
                      </div>

                      {/* Prompt Card 2 - position 7 */}
                      <div className="bg-white rounded-3xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-16 h-3 bg-gray-300 rounded"></div>
                          <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        </div>
                        <div className={`${skeletonWidths.title} h-5 bg-gray-300 rounded`}></div>
                      </div>
                    </>
                  )}
                </div>

                {/* Column 2 - Show in 2+ column layouts */}
                {columnsCount >= 2 && (
                  <div className="flex flex-col" style={{ gap: gutter }} data-inspect-type="Column 2">
                    {/* Prompt Card 1 - Always position 2 */}
                    <div className="bg-white rounded-3xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`${skeletonWidths.button} h-3 bg-gray-300 rounded`}></div>
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      </div>
                      <div className={`${skeletonWidths.longText} h-5 bg-gray-300 rounded`}></div>
                    </div>

                    {/* In 3-column layout: Event Card (position 5), Prompt Card 2 (position 7) */}
                    {columnsCount >= 3 && (
                      <>
                        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                          {/* Card Background */}
                          <div className="h-32 bg-gradient-to-r from-purple-100 to-purple-200"></div>
                          
                          {/* Card Content */}
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-12 h-3 bg-gray-300 rounded"></div>
                              <div className="w-4 h-4 bg-gray-300 rounded"></div>
                            </div>
                            <div className={`${skeletonWidths.button} h-5 bg-gray-300 rounded mb-2`}></div>
                            <div className={`${skeletonWidths.text} h-3 bg-gray-300 rounded mb-1`}></div>
                            <div className={`${skeletonWidths.title} h-3 bg-gray-300 rounded mb-4`}></div>
                            <div className="w-20 h-8 bg-[#62D84E] rounded-lg"></div>
                          </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-16 h-3 bg-gray-300 rounded"></div>
                            <div className="w-4 h-4 bg-gray-300 rounded"></div>
                          </div>
                          <div className={`${skeletonWidths.title} h-5 bg-gray-300 rounded`}></div>
                        </div>
                      </>
                    )}

                    {/* In 2-column layout: Training Card (position 4), Products Prompt Card (position 6) */}
                    {columnsCount === 2 && (
                      <>
                        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                          {/* Card Background Image Area */}
                          <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200"></div>
                          
                          {/* Card Content */}
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className={`${skeletonWidths.button} h-3 bg-gray-300 rounded`}></div>
                              <div className="w-4 h-4 bg-gray-300 rounded"></div>
                            </div>
                            <div className={`${skeletonWidths.title} h-5 bg-gray-300 rounded mb-2`}></div>
                            <div className={`${skeletonWidths.longText} h-3 bg-gray-300 rounded mb-4`}></div>
                            <div className={`${skeletonWidths.button} h-8 bg-[#62D84E] rounded-lg`}></div>
                          </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-16 h-3 bg-gray-300 rounded"></div>
                            <div className="w-4 h-4 bg-gray-300 rounded"></div>
                          </div>
                          <div className={`${skeletonWidths.text} h-5 bg-gray-300 rounded`}></div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Column 3 - Show only in 3-column layout */}
                {columnsCount >= 3 && (
                  <div className="flex flex-col" style={{ gap: gutter }} data-inspect-type="Column 3">
                    {/* PDI Card - Position 3 */}
                    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                      {/* Card Background */}
                      <div className="h-32 bg-gradient-to-r from-green-100 to-green-200"></div>
                      
                      {/* Card Content */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`${skeletonWidths.text} h-3 bg-gray-300 rounded`}></div>
                          <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        </div>
                        <div className={`${skeletonWidths.title} h-5 bg-gray-300 rounded mb-2`}></div>
                        <div className={`${skeletonWidths.longText} h-3 bg-gray-300 rounded mb-4`}></div>
                        <div className={`${skeletonWidths.medium} h-8 bg-[#62D84E] rounded-lg`}></div>
                      </div>
                    </div>

                    {/* Products Prompt Card - Position 6 */}
                    <div className="bg-white rounded-3xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-16 h-3 bg-gray-300 rounded"></div>
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      </div>
                      <div className={`${skeletonWidths.text} h-5 bg-gray-300 rounded`}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Main layout structure - consistent for all layout types
  return (
    <div 
      className={`${isSimplifiedLayout ? 'bg-white' : 'min-h-full'} flex flex-col`}
      style={isSimplifiedLayout ? { height: '810px' } : {
        background: 'radial-gradient(66.63% 51.1% at 49.05% 52.03%, #D1E7F5 0%, rgba(229, 247, 247, 0.00) 100%), linear-gradient(0deg, rgba(230, 247, 249, 0.30) 0%, rgba(230, 247, 249, 0.30) 100%), #FFF'
      }}
    >
      {/* Navigation Header - L0 - Fixed at top of canvas */}
      <div 
        className="bg-[#032d42] w-full absolute top-0 left-0 right-0 z-30"
        style={{
          height: '64px',
        }}
        data-inspect-type="Primary Navigation"
      >
        {/* Use responsive margins instead of fixed px-4 */}
        <div className="h-full flex items-center" style={{ paddingLeft: margin, paddingRight: margin }}>
          <div className="w-full">
            <div className="flex items-center justify-between h-full">
              {/* Left Side - Logo + Navigation */}
              <div className="flex items-center gap-12">
                {/* Responsive ServiceNow Logo */}
                {l0Config.logoType === 'icon' ? (
                  // XS: Icon logo
                  <div className="w-8 h-[30px] flex items-center">
                    <ServiceNowIconLogo />
                  </div>
                ) : (
                  // SM+: Full text logo
                  <div className="w-38 h-[26px] flex items-center">
                    <ServiceNowTextLogo />
                  </div>
                )}
                
                {/* Full Navigation for LG+ screens */}
                {l0Config.showNavigation && (
                  <div className="flex items-center gap-0 relative">
                    {/* Left Carousel Arrow - only show when needed */}
                    {l0NavDisplay.showLeftArrow && (
                      <div 
                        className="mr-4 flex items-center cursor-pointer"
                        onClick={scrollL0Left}
                      >
                        <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center hover:bg-white/30 transition-colors">
                          <div className="w-3 h-3 border-l-2 border-b-2 border-white/60 transform rotate-[45deg]"></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Navigation Links Container */}
                    <div className="flex gap-8">
                      {l0NavDisplay.visibleItems.map((item, i) => (
                        <div key={item} className="flex items-center gap-1.5">
                          <div className="w-16 h-4 bg-white/20 rounded"></div>
                          <div className="w-3 h-3 bg-white/20 rounded"></div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Right Carousel Arrow - only show when needed */}
                    {l0NavDisplay.showRightArrow && (
                      <div 
                        className="ml-4 flex items-center cursor-pointer"
                        onClick={scrollL0Right}
                      >
                        <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center hover:bg-white/30 transition-colors">
                          <div className="w-3 h-3 border-r-2 border-b-2 border-white/60 transform rotate-[-45deg]"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Right Side - Utility Icons + Profile */}
              <div className="flex items-center gap-4">
                {/* Responsive utility icons */}
                {Array.from({ length: l0Config.utilityIconCount }, (_, i) => (
                  <div key={i} className="w-10 h-10 bg-white/20 rounded-full"></div>
                ))}
                
                {/* Profile Image for LG+ screens */}
                {l0Config.showProfileImage && (
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <ProfileImage />
                  </div>
                )}
                
                {/* Hamburger menu for smaller screens */}
                {l0Config.showHamburger && (
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="flex flex-col gap-1">
                      <div className="w-4 h-0.5 bg-white rounded"></div>
                      <div className="w-4 h-0.5 bg-white rounded"></div>
                      <div className="w-4 h-0.5 bg-white rounded"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation - L1 - Fixed below L0 - Only for Dashboard Layout */}
      {!isSimplifiedLayout && (
        <div 
          className="bg-white border-b border-gray-200 w-full absolute left-0 right-0 z-20"
          style={{
            top: '64px',
            height: '64px',
          }}
          data-inspect-type="Secondary Navigation"
        >
          {/* Use responsive margins instead of fixed px-4 and 1440px max-width */}
          <div className="h-full flex items-center" style={{ paddingLeft: margin, paddingRight: margin }}>
            <div className="w-full">
              <div className="flex items-center justify-between h-full">
                {/* Logo + Tabs */}
                <div className="flex items-center gap-12">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    <div className="w-20 h-5 bg-gray-300 rounded"></div>
                  </div>
                  
                  {/* Responsive Tabs - Only show for >= 1024px */}
                  {tabDisplay.showTabs && (
                    <div className="flex items-center gap-8">
                      {/* Left Carousel Arrow - only show when needed */}
                      {tabDisplay.showCarouselArrows && (
                        <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                          <div className="w-3 h-3 border-l-2 border-b-2 border-gray-600 transform rotate-[45deg]"></div>
                        </div>
                      )}
                      
                      {/* Tabs Container */}
                      <div className="flex gap-8">
                        {tabDisplay.visibleTabs.map((item, i) => (
                          <div key={i} className="h-full flex items-center relative">
                            <div className={`${item === 'Home' ? 'w-12' : item === 'Instances' ? 'w-18' : item === 'Products' ? 'w-16' : 'w-12'} h-4 bg-gray-300 rounded`}></div>
                            {/* Green border positioned at bottom of nav for active tab */}
                            {i === 0 && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#62D84E]"></div>
                            )}
                          </div>
                        ))}
                        
                        {/* More Tab - shown when tabs are collapsed but no carousel */}
                        {tabDisplay.hiddenCount > 0 && !tabDisplay.showCarouselArrows && (
                          <div className="h-full flex items-center relative">
                            <div className="flex items-center gap-1">
                              <div className="w-8 h-4 bg-gray-300 rounded"></div>
                              <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Right Carousel Arrow - only show when needed */}
                      {tabDisplay.showCarouselArrows && (
                        <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                          <div className="w-3 h-3 border-r-2 border-b-2 border-gray-600 transform rotate-[-45deg]"></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Right Side Content - Responsive */}
                {maxWidth >= 1024 ? (
                  /* Desktop: Show Create button */
                  <div className="w-24 h-9 bg-white border-2 border-[#62D84E] rounded-full"></div>
                ) : (
                  /* Mobile/Tablet: Show Caret icon */
                  <div className="w-6 h-6 flex items-center justify-center">
                    <CaretIcon />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area - Different content based on layout type */}
      <div 
        style={isSimplifiedLayout ? { 
          paddingTop: '64px', // Just L0 navigation
          paddingBottom: gutter,
        } : { 
          paddingTop: '128px', // L0 + L1 navigation height
        }}
      >
        {isSimplifiedLayout ? renderSimplifiedContent() : renderDashboardContent()}
      </div>

      {/* Footer - Natural flow after content */}
      <div 
        className="bg-white w-full mt-auto"
        style={isSimplifiedLayout ? { position: 'absolute', bottom: 0, left: 0, right: 0 } : {}}
        data-inspect-type="Footer"
      >
        <div className="border-t border-[#cfd5d7]" />
        <div style={contentContainerStyle}>
          {/* LG+ Layout (≥1024px) - Two column layout */}
          {maxWidth >= 1024 && (
            <div className="flex flex-row items-center relative w-full">
              <div className="box-border content-stretch flex flex-row gap-10 items-center justify-start relative w-full" style={{ padding: margin }}>
                {/* Container */}
                <div className="basis-0 grow h-[69px] min-h-px min-w-px relative shrink-0">
                  <div className="box-border content-stretch flex flex-row gap-[120px] h-[69px] items-start justify-start p-0 relative w-full">
                    {/* Left Side */}
                    <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
                      <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative w-full">
                        {/* ServiceNow Logo w/Brandline - Skeleton */}
                        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                          {/* ServiceNow Logo */}
                          <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-[0.724px] place-items-start relative">
                            {/* Logo skeleton */}
                            <div className="[grid-area:1_/_1] h-[19.617px] ml-0 mt-0 relative w-[132.394px]">
                              <div className="w-[132px] h-5 bg-gray-300 rounded"></div>
                            </div>
                          </div>
                          
                          {/* Divider line */}
                          <div className="[grid-area:1_/_1] flex h-[22px] items-center justify-center ml-[153.641px] mt-0 relative w-[0px]">
                            <div className="flex-none rotate-[90deg]">
                              <div className="h-0 relative w-[22px]">
                                <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                                  <div className="w-full h-px bg-[#E1E1E1]"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Brand line skeleton */}
                          <div className="[grid-area:1_/_1] h-[15px] ml-[173.641px] mt-[5px] overflow-clip relative w-[307.346px]">
                            <div className="w-[307px] h-[15px] bg-gray-300 rounded"></div>
                          </div>
                        </div>
                        
                        {/* Link Group */}
                        <div className="relative shrink-0 w-full">
                          <div className="box-border content-stretch flex flex-row gap-8 items-start justify-start p-0 relative w-full">
                            {/* Links - Skeleton */}
                            <div className="relative shrink-0">
                              <div className="w-32 h-6 bg-gray-300 rounded"></div>
                            </div>
                            <div className="relative shrink-0">
                              <div className="w-28 h-6 bg-gray-300 rounded"></div>
                            </div>
                            <div className="relative shrink-0">
                              <div className="w-12 h-6 bg-gray-300 rounded"></div>
                            </div>
                            <div className="relative shrink-0">
                              <div className="w-24 h-6 bg-gray-300 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Side */}
                    <div className="relative shrink-0">
                      <div className="box-border content-stretch flex flex-col gap-2 items-end justify-center p-0 relative">
                        {/* Social Links */}
                        <div className="relative shrink-0">
                          <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative">
                            {/* Social Icons - Skeleton */}
                            {Array.from({ length: 5 }, (_, i) => (
                              <div key={i} className="relative rounded shrink-0 size-10">
                                <div className="w-10 h-10 bg-gray-300 rounded"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Copyright */}
                        <div className="flex flex-col justify-center relative shrink-0">
                          <div className="w-48 h-[21px] bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MD Layout (768-1023px) - Single column with stacked logo */}
          {maxWidth >= 768 && maxWidth < 1024 && (
            <div className="flex flex-row justify-center relative size-full">
              <div className="box-border content-stretch flex flex-row items-baseline justify-center relative w-full" style={{ padding: margin }}>
                <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
                  <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative w-full">
                    {/* Left Side - Logo and Links */}
                    <div className="relative shrink-0 w-full">
                      <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative w-full">
                        {/* ServiceNow Logo w/Brandline - Stacked */}
                        <div className="relative shrink-0 w-full">
                          <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative w-full">
                            {/* Logo skeleton */}
                            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                              <div className="w-[132px] h-5 bg-gray-300 rounded"></div>
                            </div>
                            {/* Brand line skeleton */}
                            <div className="h-[15px] overflow-clip relative shrink-0 w-[307.346px]">
                              <div className="w-[307px] h-[15px] bg-gray-300 rounded"></div>
                            </div>
                          </div>
                        </div>
                        {/* Link Group - Wrapped */}
                        <div className="relative shrink-0 w-full">
                          <div className="[flex-flow:wrap] box-border content-start flex gap-8 items-start justify-start p-0 relative w-full">
                            <div className="w-32 h-6 bg-gray-300 rounded"></div>
                            <div className="w-28 h-6 bg-gray-300 rounded"></div>
                            <div className="w-12 h-6 bg-gray-300 rounded"></div>
                            <div className="w-24 h-6 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Right Side - Social and Copyright */}
                    <div className="relative shrink-0">
                      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-center p-0 relative">
                        {/* Social Links */}
                        <div className="relative shrink-0">
                          <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div key={i} className="relative rounded shrink-0 size-10">
                                <div className="w-10 h-10 bg-gray-300 rounded"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Copyright */}
                        <div className="flex flex-col justify-center relative shrink-0">
                          <div className="w-48 h-[21px] bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* XS/SM Layout (<768px) - Single column with horizontal logo */}
          {maxWidth < 768 && (
            <div className="flex flex-row justify-center relative size-full">
              <div className="box-border content-stretch flex flex-row items-baseline justify-center relative w-full" style={{ padding: margin }}>
                <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
                  <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative w-full">
                    {/* Left Side */}
                    <div className="relative shrink-0 w-full">
                      <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative w-full">
                        {/* ServiceNow Logo w/Brandline - Horizontal with divider */}
                        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                          {/* ServiceNow Logo */}
                          <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-[0.724px] place-items-start relative">
                            <div className="w-[132px] h-5 bg-gray-300 rounded"></div>
                          </div>
                          {/* Divider line */}
                          <div className="[grid-area:1_/_1] flex h-[22px] items-center justify-center ml-[153.641px] mt-0 relative w-[0px]">
                            <div className="flex-none rotate-[90deg]">
                              <div className="h-0 relative w-[22px]">
                                <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                                  <div className="w-full h-px bg-[#E1E1E1]"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Brand line skeleton */}
                          <div className="[grid-area:1_/_1] h-[15px] ml-[173.641px] mt-[5px] overflow-clip relative w-[307.346px]">
                            <div className="w-[307px] h-[15px] bg-gray-300 rounded"></div>
                          </div>
                        </div>
                        {/* Link Group - Single row */}
                        <div className="relative shrink-0 w-full">
                          <div className="box-border content-stretch flex flex-row gap-8 items-start justify-start p-0 relative w-full">
                            <div className="w-32 h-6 bg-gray-300 rounded"></div>
                            <div className="w-28 h-6 bg-gray-300 rounded"></div>
                            <div className="w-12 h-6 bg-gray-300 rounded"></div>
                            <div className="w-24 h-6 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Right Side */}
                    <div className="relative shrink-0">
                      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-center p-0 relative">
                        {/* Social Links */}
                        <div className="relative shrink-0">
                          <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div key={i} className="relative rounded shrink-0 size-10">
                                <div className="w-10 h-10 bg-gray-300 rounded"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Copyright */}
                        <div className="flex flex-col justify-center relative shrink-0">
                          <div className="w-48 h-[21px] bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}