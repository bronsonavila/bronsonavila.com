import React, { useEffect, useRef, useState } from 'react';
import posed from 'react-pose';

import FormInput from '../components/FormInput';
import Metadata from '../components/Metadata';

const duration = 350;

const handleSubmit = (e, refs, setSubmitStatus) => {
  e.preventDefault();
  setSubmitStatus('submitting');

  const { name, email, message, required } = {
    name: encodeURI(refs.inputs.name.current.value),
    email: encodeURI(refs.inputs.email.current.value),
    message: encodeURI(refs.inputs.message.current.value),
    required: encodeURI(refs.inputs.required.current.value),
  };

  const webAppURL =
    'https://script.google.com/macros/s/AKfycbzXeqkR9-JWbTmdhTVPI5ZPfJQokhY9Ev4MnKyqxyiHLyPokvw/exec';

  // Using `GET` with `onreadystatechange` rather than `POST` with `onload` because
  // the latter fails to process a response in the browser (yet `POST` works via Postman).
  const xhr = new XMLHttpRequest();
  xhr.onerror = () => {
    setSubmitStatus('error');
    console.log(xhr.responseText);
  };
  xhr.ontimeout = () => {
    setSubmitStatus('error');
    console.log(xhr.responseText);
  };
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200 && JSON.parse(xhr.responseText).success) {
        setSubmitStatus('success');
        // Clear inputs.
        Object.keys(refs.inputs).forEach(item => (refs.inputs[item].current.value = ''));
      } else {
        setSubmitStatus('error');
        console.log(xhr.responseText);
      }
    }
  };
  xhr.open(
    'GET',
    `${webAppURL}?name=${name}&email=${email}&message=${message}&required=${required}`
  );
  xhr.send();
};

const PosedForm = posed.form({
  visible: { staggerChildren: duration / 4 },
});

const PosedFormChild = posed.div({
  visible: { y: 0, opacity: 1, transition: { ease: 'easeOut' } },
  hidden: { y: 50, opacity: 0 },
});

export default ({ location }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const refs = {
    inputs: {
      name: useRef(null),
      email: useRef(null),
      message: useRef(null),
      required: useRef(null),
    },
    submitButton: useRef(null),
  };

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), duration);
  }, []);

  return (
    <>
      <Metadata
        description="Contact Bronson Avila"
        pathname={location.pathname}
        title="Contact"
      />
      <div className="container mx-auto px-4">
        <h1 className="text-center mb-16 pb-1 pt-8">Contact</h1>
        <div className="global-editor mb-8 pb-1">
          <div className="mb-10 pb-1">
            <p>
              Please include your name, email address, and a brief message in the form
              below.
            </p>
          </div>
          <PosedForm
            className="flex flex-col"
            onSubmit={e => {
              handleSubmit(e, refs, setSubmitStatus);
            }}
            pose={isLoaded ? 'visible' : 'hidden'}
          >
            {/* Honey pot */}
            <FormInput
              inputClasses="absolute bottom-0 h-0 w-0 opacity-0 overflow-hidden"
              label="Required"
              labelClasses="absolute bottom-0 h-0 w-0 opacity-0 overflow-hidden"
              name="required"
              ref={refs.inputs.required}
              required={false}
              type="text"
            />
            <PosedFormChild className="flex flex-col w-full">
              <FormInput label="Name" name="name" ref={refs.inputs.name} type="text" />
            </PosedFormChild>
            <PosedFormChild className="flex flex-col w-full">
              <FormInput
                label="Email"
                name="email"
                ref={refs.inputs.email}
                type="email"
              />
            </PosedFormChild>
            <PosedFormChild className="flex flex-col w-full">
              <FormInput
                label="Message"
                name="message"
                ref={refs.inputs.message}
                type="textarea"
              />
            </PosedFormChild>

            <PosedFormChild className="relative text-center mt-m pt-1 w-full">
              <p
                className={`form__feedback absolute font-sans text-center leading-relaxed opacity-0 w-full
                  transition duration-300 ease-in-out ${submitStatus}`}
              >
                {submitStatus === 'error' ? (
                  <>
                    Sorry, an error occurred. Please contact me directly at{' '}
                    <a href={`mailto:bronson.avila@gmail.com`}>bronson.avila@gmail.com</a>
                    .
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
                ref={refs.submitButton}
                type="submit"
                value={submitStatus ? 'Sending...' : 'Send'}
              />
            </PosedFormChild>
          </PosedForm>
        </div>
      </div>
    </>
  );
};
