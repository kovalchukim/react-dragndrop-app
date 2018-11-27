import React from 'react';

const ErrorValidation = meta => (
    <React.Fragment>
        {meta.error && meta.touched && <span className="error">{meta.error}</span>}
    </React.Fragment>
);
export default ErrorValidation;