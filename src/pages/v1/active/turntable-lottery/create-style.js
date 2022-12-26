const KEY = "active-turntable-lottery";
function writeThemeStyle(themeConfig) {
  const oldEl = document.getElementById(`${KEY}-theme-style`);
  const style = document.createElement("style");
  style.innerText = `
      .${KEY}-txt-color{
         color:${themeConfig.txtColor};

      }
      .${KEY}-main-bg{
        background-image:url(${themeConfig.mainBg});
      
     }
     .${KEY}-active-rule-color{
        color:${themeConfig.activeRuleColor};
     }
     .${KEY}-active-message-color{
        color:${themeConfig.activeMessageColor};
     }
     .${KEY}-slider-menu-color{
        color:${themeConfig.sliderMenuColor};
     }
     .${KEY}-slider-menu-bgcolor{
        background:${themeConfig.sliderMenuBgColor};
     }
     .${KEY}-title-color{
        color:${themeConfig.titleColor};
     }
     .${KEY}-title-date-color{
        color:${themeConfig.titleDateColor};
     }
     .${KEY}-tab-color{
        color:${themeConfig.tabColor};
     }
     .${KEY}-tip-txt-color{
        color:${themeConfig.tipTxtColor};
     }
     .${KEY}-warning-color{
        color:${themeConfig.warningColor};
     }
     .${KEY}-btn-one{
      background-image:url(${themeConfig.btnOne});
    
   }
   @media screen and (max-width: 540px) {
      .${KEY}-btn-one{
         background-image:url(${themeConfig.btnOneMobile});
      }
  
    }
   .${KEY}-btn-ten{
      background-image:url(${themeConfig.btnTen});
   }
   @media screen and (max-width: 540px) {
      .${KEY}-btn-ten{
         background-image:url(${themeConfig.btnTenMobile});
      }
    }
   .${KEY}-warning-color{
      color:${themeConfig.btnTenMobile};
   }
   .${KEY}-warning-color{
      color:${themeConfig.warningColor};
   }
      `;
  style.id = `${KEY}-theme-style`;
  style.setAttribute("type", "text/css");
  oldEl
    ? document.head.replaceChild(style, oldEl)
    : document.head.appendChild(style);
}
export default writeThemeStyle;
