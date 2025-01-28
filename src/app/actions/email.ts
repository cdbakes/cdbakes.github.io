'use server'

import nodemailer from 'nodemailer'

async function verifyRecaptcha(token: string) {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  })

  const data = await response.json()
  return data.success
}

export async function sendEmail(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string
  const recaptchaToken = formData.get('recaptchaToken') as string

  if (!name || !email || !message) {
    return {
      error: 'All fields are required'
    }
  }

  if (!recaptchaToken) {
    return {
      error: 'Please complete the reCAPTCHA verification'
    }
  }

  // Verify reCAPTCHA token
  const isValidRecaptcha = await verifyRecaptcha(recaptchaToken)
  if (!isValidRecaptcha) {
    return {
      error: 'Invalid reCAPTCHA. Please try again.'
    }
  }

  // Log environment variables (without sensitive data)
  console.log('SMTP Configuration:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER ? 'Set' : 'Not set',
    pass: process.env.SMTP_PASS ? 'Set' : 'Not set'
  })

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  try {
    // Verify transporter configuration
    await transporter.verify()
    console.log('SMTP connection verified successfully')

    // Send the email
    const info = await transporter.sendMail({
      from: `"${name} via Personal Website" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: 'colindbaker7@gmail.com',
      subject: `New Contact Form Message from ${name}`,
      text: `From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Message</h3>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    console.log('Message sent successfully:', info.messageId)
    return { success: true }
  } catch (error) {
    console.error('Detailed error sending email:', error)
    return {
      error: 'Failed to send email. Please try again later.'
    }
  }
}
