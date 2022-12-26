import { dataJson } from "./dataJson";
const KEY = "children-art";
function writeThemeStyle(themeConfig) {
  const oldEl = document.getElementById(`${KEY}-theme-style`);
  const style = document.createElement("style");
  style.innerText = `
      .${KEY}-rule-color{
         color:${themeConfig.homeRouleColor};
      }
      .${KEY}-rule-bg-color{
         background:${themeConfig.homeRuleBgColor};
      }
      .${KEY}-bg-color{
         background:${themeConfig.bgColor};
      }
      .${KEY}-introduce-bg-color{
         background:${themeConfig.goodsIntroduceBgColor};
      }
      .${KEY}-introduce-color{
         color:${themeConfig.goodsIntroduceColor};
      }
      `;
  style.id = `${KEY}-theme-style`;
  style.setAttribute("type", "text/css");
  oldEl
    ? document.head.replaceChild(style, oldEl)
    : document.head.appendChild(style);
}
async function getActiveConfig(app, uuid) {
  const res = await app.$api.service.voterActivity_detailo({
    uuid,
  });
  let config = {};
  let resObj = {
    data: {},
  };
  resObj.code = res.data.code;
  console.log(resObj);
  if (res.data.code == 200) {
    resObj.data = res.data.data;
    try {
      config = {
        ...dataJson,
        ...JSON.parse(resObj.data.dataJson),
      };
      resObj.data.dataJson = config;

      writeThemeStyle(config);
    } catch (error) {
      resObj.data.dataJson = dataJson;
      writeThemeStyle(dataJson);
    }
  } else {
    resObj.message = res.data.message;
  }
  return resObj;
}
export default getActiveConfig;
