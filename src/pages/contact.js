import FormInput from 'components/FormInput'
import Metadata from 'components/Metadata'
import posed from 'react-pose'
import React, { useEffect, useState } from 'react'

const duration = 350

const AnimatedForm = posed.form({
  visible: { staggerChildren: duration / 5 }
})

const AnimatedFormElement = posed.div({
  visible: { y: 0, opacity: 1, transition: { ease: 'easeOut' } },
  hidden: { y: 50, opacity: 0 }
})

export default ({ location }) => {
  const [email, setEmail] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [required, setRequired] = useState('') // Not actually required; acts as a honey pot.
  const [submitStatus, setSubmitStatus] = useState('')

  const webAppUrl = 'https://script.google.com/macros/s/AKfycbzXeqkR9-JWbTmdhTVPI5ZPfJQokhY9Ev4MnKyqxyiHLyPokvw/exec'

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitStatus('submitting')

    try {
      const response = await fetch(
        encodeURI(`${webAppUrl}?name=${name}&email=${email}&message=${message}&required=${required}`)
      )
      const { success } = await response.json()
      setSubmitStatus(response.status === 200 && success ? 'success' : 'error')
    } catch (err) {
      setSubmitStatus('error')
      console.error(err)
    } finally {
      setEmail('')
      setMessage('')
      setName('')
      setRequired('')
    }
  }

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), duration)
  }, [])

  return (
    <>
      <Metadata description="Contact Bronson Avila" pathname={location.pathname} title="Contact" />
      <div className="container mx-auto px-4">
        <h1 className="text-center mb-16 pb-1 pt-8">Contact</h1>
        <div className="global-editor mb-8 pb-1">
          <AnimatedForm className="flex flex-col" onSubmit={handleSubmit} pose={isLoaded ? 'visible' : 'hidden'}>
            {/* Honey pot */}
            <FormInput
              inputClasses="absolute bottom-0 h-0 w-0 opacity-0 overflow-hidden"
              label="Required"
              labelClasses="absolute bottom-0 h-0 w-0 opacity-0 overflow-hidden"
              name="required"
              onChange={e => setRequired(e.target.value)}
              required={false}
              type="text"
              value={required}
            />
            <AnimatedFormElement className="mb-10 pb-1">
              <p>Any questions or comments? Feel free to use the form below to get in touch.</p>
            </AnimatedFormElement>
            <AnimatedFormElement className="flex flex-col w-full">
              <FormInput label="Name" name="name" onChange={e => setName(e.target.value)} type="text" value={name} />
            </AnimatedFormElement>
            <AnimatedFormElement className="flex flex-col w-full">
              <FormInput
                label="Email"
                name="email"
                onChange={e => setEmail(e.target.value)}
                type="email"
                value={email}
              />
            </AnimatedFormElement>
            <AnimatedFormElement className="flex flex-col w-full">
              <FormInput
                label="Message"
                name="message"
                onChange={e => setMessage(e.target.value)}
                type="textarea"
                value={message}
              />
            </AnimatedFormElement>
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
                  <>Thanks. I'll be in touch.</>
                )}
              </p>
              <input
                aria-label="submit"
                className={`form__submit cursor-pointer font-sans text-white bg-gray-900 border border-gray-900 mt-12 px-10 py-3
                  transition duration-300 ease-in-out hover:bg-gray-600 hover:border-gray-600 ${submitStatus}`}
                disabled={submitStatus}
                type="submit"
                value={submitStatus ? 'Sending...' : 'Send'}
              />
            </AnimatedFormElement>
          </AnimatedForm>
        </div>
      </div>
    </>
  )
}
