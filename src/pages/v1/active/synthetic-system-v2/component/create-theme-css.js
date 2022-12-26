const KEY = "synthesis";
const bgImgKeys = ["shike-yy", "shike-wy", "shikehu-tiger"];
function writeThemeStyle(themeConfig) {
  const oldEl = document.getElementById(`${KEY}-theme-style`);
  const style = document.createElement("style");
  const isBgImg = bgImgKeys.find((item) => {
    return item == themeConfig.key;
  });

  style.innerText = `
      .${KEY}-btn-border{
         color:${themeConfig.btnBorderFontColor};
         border-color:${themeConfig.btnBorderColor} !important;
      }
      .${KEY}-btn-bg{
         color:${themeConfig.btnBgFontColor};
         background:${themeConfig.btnBgColor};
      } 
      .${KEY}-btn-selected{
         color:${themeConfig.btnSelectedFontColor};
         background:${themeConfig.btnSelectedBgColor};
      }
      .${KEY}-base-color{
         color:${themeConfig.baseFontColor}
      }
      .${KEY}-body-bg-color{
        background: ${themeConfig.themeBgColor};
      }
      .${KEY}-content-bg-img{
        background: url("${themeConfig.contentBgImg}") no-repeat center;
        background-size: cover;
      }
      .${KEY}-active-txt-color{
          ${
            themeConfig.activeTxtColor
              ? ` color:${themeConfig.activeTxtColor}`
              : ""
          };
      }
      .${KEY}-tab-color{
        color:${themeConfig.tabColor}
      }
      .btn-disabled {
         background: #cccccc;
         color: #666666;
         border-color:#cccccc !important;
       }
       .${KEY}-icon-direction-color{
         color:${themeConfig.iconDirectionColor}

       }
       .${KEY}-icon-collection-color{
        color:${themeConfig.iconCollectionColor}
       }
       .${KEY}-collection-bgcolor{
        background:${themeConfig.collectionBgColor}
       }
       .${KEY}-log-icon-color{
        color:${
          themeConfig.logIconColor
            ? themeConfig.logIconColor
            : themeConfig.iconCollectionColor
        }
       }
       .${KEY}-log-bgcolor{
        background:${
          themeConfig.logBgColor
            ? themeConfig.logBgColor
            : themeConfig.collectionBgColor
        }
       }
       .${KEY}-select-border-color{
        border-color:${themeConfig.materialSelectColor} !important;
       }
       .${KEY}-select-icon-color{
        color:${themeConfig.materialSelectColor} ;
       }
       .${KEY}-select-close{
        color:${themeConfig.materialCloseColor} ;
       }
       .${KEY}-animate-content-bgcolor{
         background:${themeConfig.animateContentBgcolor} ;
       }
       .${KEY}-dialog-content-bgcolor{
        ${isBgImg ? "" : `background:${themeConfig.animateContentBgcolor} ;`}
      
      }

       .${KEY}-log-title-bgcolor{
        background:${themeConfig.logTitleBgColor} ;
      }
      .${KEY}-log-title-color{
        color:${themeConfig.logTitleColor} ;
      }
      .${KEY}-log-btn-bgcolor{
        background:${themeConfig.logBtnBgColor} ;
      }
      .${KEY}-log-btn-color{
        color:${themeConfig.logBtnColor} ;
      }

      .${KEY}-log-detail-destroy-bgcolor{
        background:${themeConfig.logDetailDestroyBgColor} ;
      }
      .${KEY}-log-detail-destroy-color{
        color:${themeConfig.logDetailDestroyColor} ;
      }

      .${KEY}-number-btn-bgcolor{
        background:${themeConfig.numberBtnBgColor} ;
      }
      .${KEY}-number-btn-color{
        color:${themeConfig.numberBtnColor} ;
      }
      .${KEY}-warning-txt-color{
        color:${themeConfig.warningTxtColor} !important;
      }
      .${KEY}-message-bg-color{
        background:${themeConfig.messageBgColor};
      }
      .${KEY}-message-color{
        color:${themeConfig.messageColor};
      }
      .${KEY}-active-title-color{
        color:${themeConfig.activeTitleColor || "#fff"};
      }
 
      .${KEY}-selected-checkbox-color .el-checkbox__input.is-checked+.el-checkbox__label{
        color:${themeConfig.selectedCheckboxColor} !important;
      }
      .${KEY}-selected-checkbox-color .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
        background-color:${themeConfig.selectedCheckboxColor} !important;
        border-color:${themeConfig.selectedCheckboxColor} !important;
      }

      .${KEY}-number-btn-border-color{
        border-color:${themeConfig.numberBtnBorderColor} ;
      }
      .${KEY}-number-btn-font-color{
        color:${themeConfig.numberBtnFontColor} !important;
      }
      .${KEY}-available-color{
        color:${themeConfig.availableColor} !important;
      }
      .${KEY}-available-num-color{
        color:${themeConfig.availableNumColor} !important;
      }
      .${KEY}-message-link-color a{
        color:${themeConfig.messageLinkColor} !important;
        background-color:transparent  !important;
        background:transparent  !important;
      }
      `;
  style.id = `${KEY}-theme-style`;
  style.setAttribute("type", "text/css");
  oldEl
    ? document.head.replaceChild(style, oldEl)
    : document.head.appendChild(style);
}
export default writeThemeStyle;
