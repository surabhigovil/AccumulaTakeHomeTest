function isBankHoliday(date) {
    
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

export function findDaysToShip(product, date) {
    let maxDaysToShip = product.maxBusinessDaysToShip

    let days = 0;

    if (!product.shipOnWeekends) {
        days = getFinalShipDate(date, maxDaysToShip);
        console.log(`day: ${days}`);
        return days;
    }
    
    let approxShipDate = new Date();
    approxShipDate = new Date(approxShipDate.setDate(date.getDate() + maxDaysToShip - 1));

    // const stringDate = `${current.getDate()}-${current.getMonth()+1}-${current.getFullYear()}`;
                
        
    return approxShipDate;
}

function getFinalShipDate(d1, maxDaysToShip) {
    let d2 = new Date(d1);
    d2 = new Date(d2.setDate(d2.getUTCDate()));
    let dayCount = 0;
    let holidayCount = 0;
    
    while ( maxDaysToShip > 0) {
        var day = d1.getDay();
        if(isBankHoliday(d1) || (day === 6 || day === 0)) {
            ++holidayCount
        } else {
            dayCount++;
            maxDaysToShip--;
        }
        d1.setDate(d1.getUTCDate() + 1);
    }

    d2 = new Date(d2.setDate(d2.getUTCDate() + holidayCount + dayCount - 1));
    return d2;
}