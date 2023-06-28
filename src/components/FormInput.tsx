import React, { ChangeEvent, FC } from 'react'
import FormLabel from 'components/FormLabel'

export enum InputType {
  EMAIL = 'email',
  TEXTAREA = 'textarea',
  TEXT = 'text'
}

type FormInputProps = {
  inputClasses?: string
  label?: string
  labelClasses?: string
  name?: string
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  required?: boolean
  type?: InputType
  value?: string
}

const FormInput: FC<FormInputProps> = ({
  inputClasses = '',
  label = '',
  labelClasses = '',
  name = '',
  onChange = () => undefined,
  required = true,
  type = InputType.TEXT,
  value = ''
}) => {
  const commonProps = {
    'aria-label': label,
    className: `font-sans border border-gray-400 px-5 py-3 ${inputClasses}`,
    id: name,
    name,
    onChange,
    required,
    value
  }

  return (
    <>
      <FormLabel classes={labelClasses} htmlFor={name} label={label} />

      {type === InputType.TEXTAREA ? (
        <textarea {...commonProps} maxLength={65535} rows={4} />
      ) : (
        <input {...commonProps} type={type} className={`${commonProps.className} mb-6`} />
      )}
    </>
  )
}

export default FormInput
