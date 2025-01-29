'use client'
import React from 'react'
import { useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import PageWrapper from '@/components/animations/PageWrapper'

interface FormState {
  success?: boolean
  error?: string
  isSubmitting: boolean
}

interface FormspreeError {
  code: string
  message: string
  field?: string
}

interface FormspreeResponse {
  ok: boolean
  error?: string
  errors?: FormspreeError[]
  next?: string
}

export default function Contact() {
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const token = recaptchaRef.current?.getValue()
    if (!token) {
      setFormState({ 
        isSubmitting: false,
        error: 'Please complete the reCAPTCHA verification'
      })
      return
    }

    setFormState({ isSubmitting: true })

    try {
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)
      formData.set('g-recaptcha-response', token)

      const response = await fetch('https://formspree.io/f/xwpvoavj', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })

      const data = await response.json() as FormspreeResponse

      if (!response.ok) {
        const errorMessage = data.errors?.map(err => err.message).join(', ') || 
                           data.error || 
                           'Failed to send message'
        setFormState({
          isSubmitting: false,
          error: errorMessage
        })
        return
      }

      setFormState({
        isSubmitting: false,
        success: true
      })

      form.reset()
      recaptchaRef.current?.reset()
    } catch (error) {
      console.error('Form submission error:', error)
      setFormState({
        isSubmitting: false,
        error: 'Failed to send message. Please try again later.'
      })
    }
  }

  return (
    <PageWrapper>
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Feel free to reach out below!
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {formState.error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex flex-col gap-1">
                <div className="font-medium">Unable to send message</div>
                <div className="text-sm">{formState.error}</div>
                <div className="text-sm mt-1">Please try again or contact me directly at <a href="mailto:colindbaker7@gmail.com" className="underline hover:text-red-800">colindbaker7@gmail.com</a></div>
              </div>
            )}
            {formState.success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex flex-col gap-1">
                <div className="font-medium">Message sent successfully!</div>
                <div className="text-sm">Thank you for reaching out. I will get back to you as soon as possible.</div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-colors"
                  />
                </div>
                <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    size="normal"
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                  />
                </div>
                <button
                  type="submit"
                  disabled={formState.isSubmitting}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {formState.isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
