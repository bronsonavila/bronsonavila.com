import React from 'react'

const FormLabel = ({ htmlFor = '', label = '', classes = '' }) => (
  <label htmlFor={htmlFor} className={`pb-3 ${classes}`}>
    <div className="form__label-bullet inline-block bg-red-600 rounded-full mr-3"></div>
    <span className="font-sans text-sm text-gray-900">{label}</span>
  </label>
)

export default FormLabel
