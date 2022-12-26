const KEY = "active-blind-box";
function writeThemeStyle(themeConfig) {
  const oldEl = document.getElementById(`${KEY}-theme-style`);
  const style = document.createElement("style");
  style.innerText = `
      .${KEY}-bg{
         background:${themeConfig.bgColor};
      }
      .${KEY}-main-bg{
         background:url(${themeConfig.mainBg});
         background-repeat:no-repeat;
         background-size:cover;
      }
      .${KEY}-active-rule-color{
         color:${themeConfig.activeRuleColor};
      }
      .${KEY}-active-rule-bg-color{
         background:${themeConfig.activeRuleBgColor};
      }
      .${KEY}-active-message-color{
         color:${themeConfig.activeMessageColor};
      }
      .${KEY}-active-message-icon-color{
         color:${themeConfig.activeMessageIconColor};
      }
      .${KEY}-logs-color{
         color:${themeConfig.logIconColor};
      }
      .${KEY}-logs-bgcolor{
         background:${themeConfig.logBgColor};
      }
      .${KEY}-collection-color{
         color:${themeConfig.iconCollectionColor};
      }
      .${KEY}-collection-bgcolor{
         background:${themeConfig.collectionBgColor};
      }
      .${KEY}-title-color{
         color:${themeConfig.activeTitleColor};
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
         color:${themeConfig.attTxtColor};
      }
      .${KEY}-dialog-btn-color{
         color:${themeConfig.dialogBtnColor}!important;
      }
      .${KEY}-dialog-btn-bg-color{
         background:${themeConfig.dialogBtnBgColor}!important;
      }
      .${KEY}-dialog-bg-color{
        background:${themeConfig.dialogBgColor};
      }
      .${KEY}-log-title-bg-color{
         background:${themeConfig.logTitleBgColor};
      }
      .${KEY}-log-title-color{
         color:${themeConfig.logTitleColor};
      }
      `;
  style.id = `${KEY}-theme-style`;
  style.setAttribute("type", "text/css");
  oldEl
    ? document.head.replaceChild(style, oldEl)
    : document.head.appendChild(style);
}
export default writeThemeStyle;
