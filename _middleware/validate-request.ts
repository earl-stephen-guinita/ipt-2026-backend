import type e = require("express");

export default validateRequest;

function validateRequest(req: any, next: any, schema: any, data?: any) {
    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    };

    const source = data || req.body;

    const { error, value } = schema.validate(source, options);
    
    if (error) {
        next(`Validation error: ${error.details.map((x: any) => x.message).join(', ')}`);
    } else {
        if (data) {
            Object.assign(data, value);
        } else {
            req.body = value;
        }
        next();
    }
}