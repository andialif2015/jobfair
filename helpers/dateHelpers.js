module.exports = {
    dateFormat: (date) => {
        const dateTime = new Date(date);
        const day = (dateTime.getDate() < 10) ? '0'+dateTime.getDate() : dateTime.getDate();
        const mouth = (dateTime.getMonth()+1 < 10) ? '0'+(dateTime.getMonth()+1) : dateTime.getMonth()+1;
        const year = dateTime.getFullYear();
            
        // const hour = (dateTime.getHours() < 10) ? '0'+ dateTime.getHours() : dateTime.getHours();
        // const minute = (dateTime.getMinutes() < 10) ? '0'+dateTime.getMinutes() : dateTime.getMinutes();
        // const second = (dateTime.getSeconds() < 10) ? '0'+dateTime.getSeconds() : dateTime.getSeconds();

        const sekarang = day + '-' + mouth + '-' + year;
        return sekarang;
    }
}