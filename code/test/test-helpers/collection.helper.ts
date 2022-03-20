export const except = (obj: Record<string, any>, fields: string[] = []): Record<string, any> => {
    return Object.keys(obj).reduce((result, currentValue, currentIndex) => {
        if (!fields.includes(currentValue)) {
            return {
                ...result,
                [currentValue]: obj[currentValue]
            };
        }
        return result;
    }, {});
};


export const only = (obj: Record<string, any>, fields: string[] = []): Record<string, any> => {
    //it is intentionally implemented differently than except() function, (just for the hell of it) 
    let result = {};
    for (const field in obj) {
        if (fields.includes(field)) {
            result = {
                ...result,
                [field]: obj[field],
            }
        }
    }
    return result;
};