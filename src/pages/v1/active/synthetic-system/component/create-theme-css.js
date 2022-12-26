const KEY = "synthesis";
function writeThemeStyle(themeConfig) {

  const oldEl = document.getElementById(`${KEY}-theme-style`);
  const style = document.createElement("style");
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
          color: ${themeConfig.activeTxtColor};
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
      `;
  style.id = `${KEY}-theme-style`;
  style.setAttribute("type", "text/css");
  oldEl
    ? document.head.replaceChild(style, oldEl)
    : document.head.appendChild(style);
}
export default writeThemeStyle