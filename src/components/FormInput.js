import React from 'react';

/**
 * Form Input
 *
 * @param {String} inputClasses - Classes applied to input/textarea element
 * @param {String} label - Label assigned to the input
 * @param {String} labelClasses - Classes applied to the label
 * @param {String} name - Name of the input form control
 * @param {Object} ref - React ref
 * @param {Boolean} required - Indicates whether the input/textarea is required
 * @param {String} type - Type of input form control
 */
const FormInput = React.forwardRef(
  ({ inputClasses = '', label, labelClasses = '', name, required = true, type }, ref) => {
    switch (type) {
      case 'textarea':
        return (
          <>
            <FormLabel htmlFor={name} label={label} labelClasses={labelClasses} />
            <textarea
              aria-label={label}
              className={`font-sans border border-gray-400 leading-relaxed px-5 py-3 ${inputClasses}`}
              id={name}
              maxLength="65535"
              name={name}
              ref={ref}
              required={required}
              rows="4"
            ></textarea>
          </>
        );
      default:
        return (
          <>
            <FormLabel htmlFor={name} label={label} labelClasses={labelClasses} />
            <input
              aria-label={label}
              className={`font-sans border border-gray-400 mb-6 px-5 py-3 ${inputClasses}`}
              id={name}
              name={name}
              type={type}
              ref={ref}
              required={required}
            />
          </>
        );
    }
  }
);

/**
 * Form Label
 *
 * @param {String} htmlFor - The `id` of the form-related element
 * @param {String} label - Inner text
 * @param {String} labelClasses - Classes applied to the label
 */
const FormLabel = ({ htmlFor, label, labelClasses }) => (
  <label htmlFor={htmlFor} className={`pb-3 ${labelClasses}`}>
    <div className="form__label-bullet inline-block bg-red-600 rounded-full mr-3"></div>
    <span className="font-sans text-sm text-gray-900">{label}</span>
  </label>
);

export default FormInput;
