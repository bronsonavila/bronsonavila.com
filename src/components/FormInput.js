import FormLabel from 'components/FormLabel'
import React from 'react'

const FormInput = ({
  inputClasses = '',
  label = '',
  labelClasses = '',
  name = '',
  onChange = () => {},
  required = true,
  type = '',
  value = ''
}) => {
  switch (type) {
    case 'textarea':
      return (
        <>
          <FormLabel classes={labelClasses} htmlFor={name} label={label} />
          <textarea
            aria-label={label}
            className={`font-sans border border-gray-400 leading-relaxed px-5 py-3 ${inputClasses}`}
            id={name}
            maxLength="65535"
            name={name}
            onChange={onChange}
            required={required}
            rows="4"
            value={value}
          />
        </>
      )
    default:
      return (
        <>
          <FormLabel classes={labelClasses} htmlFor={name} label={label} />
          <input
            aria-label={label}
            className={`font-sans border border-gray-400 mb-6 px-5 py-3 ${inputClasses}`}
            id={name}
            name={name}
            onChange={onChange}
            type={type}
            required={required}
            value={value}
          />
        </>
      )
  }
}

export default FormInput
