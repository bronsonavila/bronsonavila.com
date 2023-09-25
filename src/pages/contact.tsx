import React, { FC, useEffect, useState, FormEvent } from 'react'
import { WindowLocation } from '@reach/router'
import FormInput, { InputType } from 'components/FormInput'
import Metadata from 'components/Metadata'
import posed from 'react-pose'

// Types

type ContactPageProps = {
  location: WindowLocation
}

enum SubmitStatus {
  DEFAULT = '',
  ERROR = 'error',
  SUBMITTING = 'submitting',
  SUCCESS = 'success'
}

// Constants

const DURATION = 350

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzXeqkR9-JWbTmdhTVPI5ZPfJQokhY9Ev4MnKyqxyiHLyPokvw/exec'

// Components

const AnimatedForm = posed.form({
  visible: { staggerChildren: DURATION / 5 }
})

const AnimatedFormElement = posed.div({
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { ease: 'easeOut' } }
})

const Contact: FC<ContactPageProps> = ({ location }) => {
  const [email, setEmail] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [submitStatus, setSubmitStatus] = useState(SubmitStatus.DEFAULT)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setSubmitStatus(SubmitStatus.SUBMITTING)

    try {
      const response = await fetch(encodeURI(`${WEB_APP_URL}?name=${name}&email=${email}&message=${message}`))
      const { success } = (await response.json()) as { success: boolean }

      setSubmitStatus(response.status === 200 && success ? SubmitStatus.SUCCESS : SubmitStatus.ERROR)
    } catch (error) {
      console.error(error)

      setSubmitStatus(SubmitStatus.ERROR)
    } finally {
      setEmail('')
      setMessage('')
      setName('')
    }
  }

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), DURATION)
  }, [])

  return (
    <>
      <Metadata description="Contact Bronson Avila" pathname={location.pathname} title="Contact" />

      <div className="container mx-auto px-4">
        <h1 className="text-center mb-16 pb-1 pt-8">Contact</h1>

        <div className="global-editor mb-8 pb-1">
          <AnimatedForm className="flex flex-col" onSubmit={handleSubmit} pose={isLoaded ? 'visible' : 'hidden'}>
            <AnimatedFormElement className="mb-10 pb-1">
              <p>Any questions or comments? Feel free to use the form below to get in touch.</p>
            </AnimatedFormElement>

            <AnimatedFormElement className="flex flex-col w-full">
              <FormInput
                label="Name"
                name="name"
                onChange={e => setName(e.target.value)}
                type={InputType.TEXT}
                value={name}
              />
            </AnimatedFormElement>

            <AnimatedFormElement className="flex flex-col w-full">
              <FormInput
                label="Email"
                name="email"
                onChange={e => setEmail(e.target.value)}
                type={InputType.EMAIL}
                value={email}
              />
            </AnimatedFormElement>

            <AnimatedFormElement className="flex flex-col w-full">
              <FormInput
                label="Message"
                name="message"
                onChange={e => setMessage(e.target.value)}
                type={InputType.TEXTAREA}
                value={message}
              />
            </AnimatedFormElement>

            <AnimatedFormElement className="relative text-center mt-m pt-1 w-full">
              <p
                className={`form__feedback absolute font-sans text-center leading-relaxed opacity-0 w-full
                  transition duration-300 ease-in-out ${submitStatus}`}
              >
                {submitStatus === SubmitStatus.ERROR ? (
                  <>
                    Sorry, an error occurred. Please contact me directly at{' '}
                    <a href={`mailto:bronson.avila@gmail.com`}>bronson.avila@gmail.com</a>.
                  </>
                ) : (
                  <>Thanks. I’ll be in touch.</>
                )}
              </p>

              <input
                className={`form__submit cursor-pointer font-sans text-white bg-gray-900 border border-gray-900 mt-12 px-10 py-3
                  transition duration-300 ease-in-out hover:bg-gray-600 hover:border-gray-600 ${submitStatus}`}
                disabled={Boolean(submitStatus)}
                type="submit"
                value={submitStatus ? 'Sending…' : 'Send'}
              />
            </AnimatedFormElement>
          </AnimatedForm>
        </div>
      </div>
    </>
  )
}

export default Contact
