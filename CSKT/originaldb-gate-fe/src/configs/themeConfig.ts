
import { ThemeConfig } from "antd";
const primaryColor = '#0074D6';
const primaryColorActive = '#005baa';
const primaryColorBg = '#009edb';
const secondaryBg = '#d0e3f4';
const grayColor = '#fafafa';
const whiteColor = '#fff';
const blackColor = 'black';

export const themeConfig: ThemeConfig = {
  token: {
    borderRadius: 10,
    colorPrimary: primaryColor,
    colorPrimaryActive: primaryColorActive,
    colorPrimaryBorder: primaryColor,
    boxShadowTertiary: 'none',
    controlHeightSM: 32,
    controlHeight: 40,
    controlHeightLG: 40,
    colorTextDisabled: 'initial',
    colorBgContainerDisabled: '#f6f6f6',
  },
  components: {
    Menu: {
      colorPrimary: whiteColor,
      itemHoverBg: primaryColor,
      colorText: whiteColor,
      itemSelectedBg: primaryColor,
      // itemColor: whiteColor,
      // colorSplit: primaryColorActive,
      itemActiveBg: primaryColor,
      popupBg: primaryColorActive,
      itemSelectedColor: whiteColor,  
      itemBg: 'transparent',
      // horizontalItemSelectedColor: 'red',
      colorInfoActive  : 'red',

    },
    Breadcrumb: {
      algorithm: true,
      colorText: primaryColorActive,
    },
    Layout: {
      siderBg: primaryColorActive,
      bodyBg: 'transference',
      headerBg: whiteColor,
      footerBg: secondaryBg,
      headerPadding: 0,
      footerPadding: 0,
      headerHeight: 64
    },
    Button: {
      primaryColor: whiteColor,
      defaultShadow: 'none',
      fontWeight: 500,
      primaryShadow: 'none',
    },
    Table: {
      cellPaddingBlock: 10,
      stickyScrollBarBorderRadius: 10,
      borderRadius: 10,
      rowHoverBg: 'transference',
      opacityLoading: 1,
      headerBg: grayColor,
      // headerColor: whiteColor,
    },
    Card: {
      borderRadiusLG: 10,
      borderRadius: 10,
    },
    Pagination: {
      // itemActiveBg: primaryColor,
      // colorPrimary: whiteColor,
      colorPrimary: primaryColor,
      // colorPrimaryHover: whiteColor,
      // colorBgTextHover: primaryColorBg
    },
    Tooltip: {
      colorBgSpotlight: primaryColorBg,
      colorTextLightSolid: whiteColor,
      controlHeight: 32
    },
    Form: {
    },
    Input: {
      // colorBorder: secondaryBg
      colorBgContainerDisabled: '#f6f6f6',
      colorTextDisabled: 'initial '
    },
    InputNumber: {
      colorBgContainerDisabled: '#f6f6f6',
      colorTextDisabled: 'initial '
    },
    Modal: {
      fontSizeHeading5: 18
    },
    Message: {
      contentPadding: "9px 9px",
      borderRadiusLG: 10
    },
    Collapse: {
      headerBg: whiteColor,
      // contentBg: whiteColor,

    },
    Tag: {
      "lineHeightSM": 2.6,
      defaultBg: grayColor,
    },
    Spin: {
      zIndexPopupBase: 1000000
    },
    Divider: {
      
    },
    Segmented: {
      trackBg: 'transparent',
      itemColor: whiteColor,
      colorText: blackColor,
      itemHoverColor: whiteColor,
      motionDurationMid: '0.3s',
      motionDurationSlow: '0.4s'
    },
    Tabs: {
      inkBarColor: primaryColor,
      itemHoverColor: blackColor,
      itemSelectedColor: blackColor,
      colorBorderSecondary: 'transparent',
      lineWidthBold: 3
    }
  }
}