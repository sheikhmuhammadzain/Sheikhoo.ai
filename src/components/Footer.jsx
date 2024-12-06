import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram, FaGlobe } from "react-icons/fa";

export function Footer() {
  const socialLinks = [
    {
      icon: FaGithub,
      href: "https://github.com/sheikhmuhammadzain",
      label: "GitHub",
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/in/muhammad-zain-afzal-649209227/",
      label: "LinkedIn",
    },
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/zainshayykh/",
      label: "Instagram",
    },
    {
      icon: FaGlobe,
      href: "https://zain-sheikh.vercel.app/",
      label: "Website",
    },
  ];

  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-black text-zinc-500 py-3 px-6 border-t border-zinc-800/50"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <motion.p
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="text-xs"
        >
          &copy; {new Date().getFullYear()} Made with ❤️ by Zain Sheikh
        </motion.p>
        <div className="flex items-center gap-3">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.1, color: "#525252" }}
              className="transition-colors duration-200 hover:text-zinc-400 text-sm"
              aria-label={social.label}
            >
              <social.icon size={16} />
            </motion.a>
          ))}
        </div>
      </div>
    </motion.footer>
  );
}
