const KEY = "active-exhibition";
function humpToUnderline(str) {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}
function writeThemeStyle(themeConfig) {
  const styleArr = [];
  for (let key in themeConfig) {
    styleArr.push(
      `.${KEY}-${humpToUnderline(key)}${JSON.stringify(
        themeConfig[key]
      ).replace(/\"/gi, "")}`
    );
  }
  const oldEl = document.getElementById(`${KEY}-theme-style`);
  const style = document.createElement("style");
  style.innerText = styleArr.join(";");
  style.id = `${KEY}-theme-style`;
  style.setAttribute("type", "text/css");
  oldEl
    ? document.head.replaceChild(style, oldEl)
    : document.head.appendChild(style);
}
export default writeThemeStyle;
