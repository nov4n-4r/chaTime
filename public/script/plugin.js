function convertDate(date){
    date = new Date(date)
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }

    return (`${dt}-${month}-${year}`)
}

function htmlText(text){
    return String(text).replace(/\W/gi, function(char) {
        return(
            `&#${char.charCodeAt()};`
            )
        })
}
