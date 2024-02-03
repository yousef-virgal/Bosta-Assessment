
export const DEFAULT_DATE_REG_EXP: RegExp = /^\d{4}-\d{2}-\d{2}$/;

export const getDateFromString = (date: string, format: RegExp = DEFAULT_DATE_REG_EXP) : [boolean, Date | null]=> {
    if(!date.match(format))
        return [false, null];

    const dateObject = new Date(date);
    if(!dateObject.getTime() && dateObject.getTime() !== 0)
        return [false, null];

    if(dateObject.toISOString().slice(0,10) !== date)
        return [false, null];

    return [true, dateObject];
};
