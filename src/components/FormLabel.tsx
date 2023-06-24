import React, { FC } from 'react'

type FormLabelProps = {
  classes?: string
  htmlFor?: string
  label?: string
}

const FormLabel: FC<FormLabelProps> = ({ classes = '', htmlFor = '', label = '' }) => (
  <label className={`pb-3 ${classes}`} htmlFor={htmlFor}>
    <div className="form__label-bullet inline-block bg-red-600 rounded-full mr-3"></div>

    <span className="font-sans text-sm text-gray-900">{label}</span>
  </label>
)

export default FormLabel
