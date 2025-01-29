'use client'

import { motion } from 'framer-motion'
import { FaGithub, FaGitlab, FaLinkedin } from 'react-icons/fa'
import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function Contact() {
  const [status, setStatus] = useState<{ success?: boolean; error?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({})

    try {
      const token = recaptchaRef.current?.getValue()
      if (!token) {
        setStatus({ error: 'Please complete the reCAPTCHA verification' })
        setIsSubmitting(false)
        return
      }

      const formData = new FormData(event.currentTarget)
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        recaptchaToken: token,
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      
      if (!response.ok) {
        setStatus({ error: result.error || 'Failed to send email. Please try again later.' })
      } else {
        setStatus({ success: true })
        if (formRef.current) {
          formRef.current.reset()
        }
        if (recaptchaRef.current) {
          recaptchaRef.current.reset()
        }
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setStatus({ error: 'An unexpected error occurred. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Feel free to reach out for collaborations or just a friendly hello
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
            {status.error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {status.error}
              </div>
            )}
            {status.success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                Message sent successfully! I'll get back to you soon.
              </div>
            )}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
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
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-6">Connect With Me</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Social Links</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/Cbaker37"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <FaGithub className="h-6 w-6" />
                  </a>
                  <a
                    href="https://gitlab.com/Cbaker37"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <FaGitlab className="h-6 w-6" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/colin-baker-288975245/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <FaLinkedin className="h-6 w-6" />
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Email</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  colindbaker7@gmail.com
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Location</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Boston, MA
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
