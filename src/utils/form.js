function createForm(linkObj, is_blank) {
    if (linkObj) {
        linkObj = JSON.parse(linkObj);
        const params = linkObj.reqParams
        let oForm = document.createElement("form"); //表单提交
        oForm.method = "post";
        oForm.action = linkObj.reqUrl; //action路径
        if (is_blank) {
            oForm.target = "_blank";
        }
        if (params && params.length > 0) {
            for (let i = 0; i < params.length; i++) {
                const _info = params[i];
                let hasitemsids_input = document.createElement("input");
                hasitemsids_input.type = "hidden";
                hasitemsids_input.name = _info.paramName;
                hasitemsids_input.value = _info.paramValue; //待传参数
                oForm.appendChild(hasitemsids_input);
            }
        }
        document.body.appendChild(oForm);
        oForm.submit();

        oForm.remove();

    }
}

function ParseURL(url) {
    const _arr = url.split('?');
    const link = _arr[0];
    const params_str = _arr[1];
    let params = [];
    if (params_str) {
        const paramsArr = params_str.split('&');
        for (let i = 0; i < paramsArr.length; i++) {
            const _str = paramsArr[i];
            const keyArr = _str.split('=');
            const key = keyArr[0];
            const val = keyArr[1]
            params.push({
                key,
                val
            });
        }
    }
    return [link, params]
}



export default createForm