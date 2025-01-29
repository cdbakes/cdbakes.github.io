'use client'

import { motion } from 'framer-motion'
import { FaGithub, FaGitlab, FaLinkedin } from 'react-icons/fa'
import { useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

interface FormState {
  error?: string
  success?: boolean
  isSubmitting: boolean
}

export default function Contact() {
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState({ isSubmitting: true })

    try {
      const token = recaptchaRef.current?.getValue()
      if (!token) {
        setFormState({ 
          isSubmitting: false,
          error: 'Please complete the reCAPTCHA verification'
        })
        return
      }

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

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.errors?.map((err: any) => err.message).join(', ') || 
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-center gap-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Feel free to reach out!
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
          {formState.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex flex-col gap-1"
            >
              <div className="font-medium">Unable to send message</div>
              <div className="text-sm">{formState.error}</div>
              <div className="text-sm mt-1">Please try again or contact me directly at <a href="mailto:colindbaker7@gmail.com" className="underline hover:text-red-800">colindbaker7@gmail.com</a></div>
            </motion.div>
          )}
          {formState.success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex flex-col gap-1"
            >
              <div className="font-medium">Message sent successfully!</div>
              <div className="text-sm">Thank you for reaching out. I will get back to you as soon as possible.</div>
            </motion.div>
          )}
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
              ></textarea>
            </div>
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                size="normal"
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
        </motion.div>
      </div>
    </div>
  )
}
