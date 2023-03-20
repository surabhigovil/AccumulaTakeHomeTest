function isHoliday(date) {
    
    // static holidays
    const isDate = (d, month, date) => {
        return d.getMonth() == (month - 1) && d.getDate() == date;
    };
    if (isDate(date, 1, 1)) { return "New Year"; }
    else if (isDate(date, 7, 4)) { return "Independence Day"; }
    else if (isDate(date, 11, 11)) { return "Veterans Day"; }
    else if (isDate(date, 12, 25)) { return "Christmas Day"; }

    // dynamic holidays
    const isDay = (d, month, day, occurance) => {
        if (d.getMonth() == (month - 1) && d.getDay() == day) {
            if (occurance > 0) {
                return occurance == Math.ceil(d.getDate() / 7);
            } else {
                // check last occurance
                let _d = new Date(d);
                _d.setDate(d.getDate() + 7);
                return _d.getMonth() > d.getMonth();
            }
        }
        return false;
    };
    if (isDay(date, 1, 1, 3)) { return "MLK Day"; }
    else if (isDay(date, 2, 1, 3)) { return "Presidents Day"; }
    else if (isDay(date, 5, 1, -1)) { return "Memorial Day"; }
    else if (isDay(date, 9, 1, 1)) { return "Labor Day"; }
    else if (isDay(date, 10, 1, 2)) { return "Columbus Day"; }
    else if (isDay(date, 11, 4, 4)) { return "Thanksgiving Day"; }

    // not a holiday
    return "";
}

function getFinalShipDate(d1, maxDaysToShip) {
    
    while ( maxDaysToShip > 0) {
        var day = d1.getDay();
        if(!(isHoliday(d1) || (day === 6 || day === 0))) {
            maxDaysToShip--;
        }

        d1.setDate(d1.getDate() + 1);
    }

    d1.setDate(d1.getDate() - 1); // Since we want to count the first date
    return d1;
}

export function findDaysToShip(product, date) {
    let maxDaysToShip = product.maxBusinessDaysToShip

    const selectedDate = new Date(date);
    selectedDate.setDate(selectedDate.getDate() + 1);

    let approxShipDate = new Date();
    
    if (!product.shipOnWeekends) {
        approxShipDate = getFinalShipDate(selectedDate, maxDaysToShip);
    } else {
        approxShipDate = new Date(approxShipDate.setDate(selectedDate.getDate() + maxDaysToShip - 1));
    }
    
    return approxShipDate;
}

export function getLocalDate(date) {
    var tzoffset = new Date(date).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(date - tzoffset)).toISOString().slice(0, -1);
  
    return localISOTime;   
}