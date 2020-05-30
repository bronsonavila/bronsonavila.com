import React from 'react';

const FormInput = React.forwardRef(
  ({ inputClasses = '', label, labelClasses = '', name, required = true, type }, ref) => {
    switch (type) {
      case 'textarea':
        return (
          <>
            <FormLabel label={label} labelClasses={labelClasses} name={name} />
            <textarea
              className={`font-sans border border-gray-400 leading-relaxed px-5 py-3 ${inputClasses}`}
              name={name}
              maxLength="65535"
              ref={ref}
              required={required}
              rows="4"
            ></textarea>
          </>
        );
      default:
        return (
          <>
            <FormLabel label={label} labelClasses={labelClasses} name={name} />
            <input
              className={`font-sans border border-gray-400 mb-6 px-5 py-3 ${inputClasses}`}
              type={type}
              name={name}
              ref={ref}
              required={required}
            />
          </>
        );
    }
  }
);

const FormLabel = ({ label, labelClasses, name }) => (
  <label htmlFor={name} className={`pb-3 ${labelClasses}`}>
    <div className="form__label-bullet inline-block bg-red-600 rounded-full mr-3"></div>
    <span className="font-sans text-sm text-gray-900">{label}</span>
  </label>
);

export default FormInput;
