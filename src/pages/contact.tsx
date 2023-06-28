import FormInput, { InputType } from 'components/FormInput'
import Metadata from 'components/Metadata'
import posed from 'react-pose'
import React, { useEffect, useReducer, useState, FormEvent, FC } from 'react'
import { PageProps } from 'gatsby'

// Types

type FieldProps = {
  onValueChange: (field: string, value: string) => void
  value: string
  label?: string
  type?: InputType
}

type FormAction = { type: 'SET_FIELD'; field: string; value: string } | { type: 'RESET' }

type FormState = {
  email: string
  message: string
  name: string
  required: string
}

type SubmitButtonProps = {
  submitStatus: string
}

// Constants

const DURATION = 350

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzXeqkR9-JWbTmdhTVPI5ZPfJQokhY9Ev4MnKyqxyiHLyPokvw/exec'

// Reducer

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'RESET':
      return { email: '', message: '', name: '', required: '' }
    default:
      return state
  }
}

// Components

const AnimatedForm = posed.form({
  visible: { staggerChildren: DURATION / 5 }
})

const AnimatedFormElement = posed.div({
  visible: { y: 0, opacity: 1, transition: { ease: 'easeOut' } },
  hidden: { y: 50, opacity: 0 }
})

const Contact: FC<PageProps> = ({ location }) => {
  const [formState, dispatch] = useReducer(formReducer, { email: '', message: '', name: '', required: '' })
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [submitStatus, setSubmitStatus] = useState<string>('')

  const { email, message, name, required } = formState

  const handleInputChange = (field: string, value: string) => dispatch({ type: 'SET_FIELD', field, value })

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitStatus('submitting')

    try {
      const response = await fetch(
        encodeURI(`${WEB_APP_URL}?name=${name}&email=${email}&message=${message}&required=${required}`)
      )
      const { success } = (await response.json()) as { success: boolean }
      setSubmitStatus(response.status === 200 && success ? 'success' : 'error')
    } catch (err) {
      setSubmitStatus('error')
      console.error(err)
    } finally {
      dispatch({ type: 'RESET' })
    }
  }

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), DURATION)
  }, [])

  return (
    <>
      <Metadata description="Contact Bronson Avila" pathname={location.pathname} title="Contact" />

      <div className="container mx-auto px-4">
        <h1 className="text-center mb-16 text-5xl">Contact</h1>

        <div className="flex flex-col items-center">
          <AnimatedForm
            action={WEB_APP_URL}
            className="relative"
            method="post"
            onSubmit={handleSubmit}
            pose={isLoaded ? 'visible' : 'hidden'}
          >
            <HoneyPotField onValueChange={handleInputChange} value={required} />

            <FormInputField label="Name" onValueChange={handleInputChange} value={name} />

            <FormInputField label="Email" onValueChange={handleInputChange} value={email} type={InputType.EMAIL} />

            <FormInputField
              label="Message"
              onValueChange={handleInputChange}
              value={message}
              type={InputType.TEXTAREA}
            />

            <SubmitButton submitStatus={submitStatus} />
          </AnimatedForm>
        </div>
      </div>
    </>
  )
}

const HoneyPotField: FC<FieldProps> = ({ onValueChange, value }) => (
  <FormInput
    inputClasses="absolute bottom-0 h-0 w-0 opacity-0 overflow-hidden"
    label="Required"
    labelClasses="absolute bottom-0 h-0 w-0 opacity-0 overflow-hidden"
    name="required"
    onChange={event => onValueChange('required', event.target.value)}
    type={InputType.TEXT}
    value={value}
  />
)

const FormInputField: FC<FieldProps> = ({ label = '', onValueChange, value, type = InputType.TEXT }) => (
  <AnimatedFormElement className="flex flex-col w-full">
    <FormInput
      label={label}
      name={label.toLowerCase()}
      onChange={event => onValueChange(label.toLowerCase(), event.target.value)}
      type={type}
      value={value}
    />
  </AnimatedFormElement>
)

const SubmitButton: FC<SubmitButtonProps> = ({ submitStatus }) => (
  <AnimatedFormElement className="relative text-center mt-m pt-1 w-full">
    <p
      className={`form__feedback absolute font-sans text-center leading-relaxed opacity-0 w-full
        transition duration-300 ease-in-out ${submitStatus}`}
    >
      {submitStatus === 'error' ? (
        <>
          Sorry, an error occurred. Please contact me directly at{' '}
          <a href={`mailto:bronson.avila@gmail.com`}>bronson.avila@gmail.com</a>.
        </>
      ) : (
        <>Thanks. I’ll be in touch.</>
      )}
    </p>

    <input
      aria-label="submit"
      className={`form__submit cursor-pointer font-sans text-white bg-gray-900 border border-gray-900 mt-12 px-10 py-3
        transition duration-300 ease-in-out hover:bg-gray-600 hover:border-gray-600 ${submitStatus}`}
      disabled={Boolean(submitStatus)}
      type="submit"
      value={submitStatus ? 'Sending...' : 'Send'}
    />
  </AnimatedFormElement>
)

export default Contact
