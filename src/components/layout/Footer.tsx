import Link from 'next/link';
import { FaGithub, FaLinkedin, FaGitlab } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="flex space-x-6 mb-6">
            <a
              href="https://github.com/Cbaker37"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">GitHub</span>
              <FaGithub className="h-6 w-6" />
            </a>
            <a
              href="https://gitlab.com/Cbaker37"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">GitLab</span>
              <FaGitlab className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/colin-baker-288975245/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">LinkedIn</span>
              <FaLinkedin className="h-6 w-6" />
            </a>
          </div>
          <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-gray-900 dark:hover:text-gray-300">
              Contact
            </Link>
          </div>
          <p className="mt-4 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Colin Baker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
