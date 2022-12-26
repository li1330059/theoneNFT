module.exports =  {
    getNowTime(){
        let yy = new Date().getFullYear();
        let mm = new Date().getMonth()+1;
        let dd = new Date().getDate();
        let hh = new Date().getHours();
        let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
        let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
        return yy+'-'+mm+'-'+dd+' '+hh+':'+mf+':'+ss;
    },
    getNowMinutes(){
        let yy = new Date().getFullYear();
        let mm = new Date().getMonth()+1<10?'0'+(new Date().getMonth()+1) : new Date().getMonth()+1;
        let dd = new Date().getDate()<10?'0'+new Date().getDate() : new Date().getDate();
        let hh = new Date().getHours();
        let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
        let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
        return yy+'-'+mm+'-'+dd+' '+hh+':'+mf;
    },
    getDateDiff(startTime,endTime,diffType){
        diffType = diffType.toLowerCase();
        const sTime = startTime;
        const eTime = endTime;
        let divNum = 1;
        if(diffType === 'second'){
            divNum = 1000;
        }else if(diffType === 'minute'){
            divNum = 1000 * 60;
        }else if(diffType === 'hour'){
            divNum = 1000 * 3600;
        }else{
            divNum = 1000 * 3600 * 24;
        };
        return parseInt((new Date(eTime).getTime() - new Date(sTime).getTime())/parseInt(divNum));
    },
    dateFormat: function (time) {
        var date = new Date(time);
        var year = date.getFullYear();
        /* 在日期格式中，月份是从0开始的，因此要加0
            * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
            * */
        var month =
            date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        // 拼接
        return year + "/" + month + "/" + day + " " + hours + ":" + minutes + ":" + seconds;
    },
}