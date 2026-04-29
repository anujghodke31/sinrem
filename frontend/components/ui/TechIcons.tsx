
import React from 'react';

export const TechIconSVG = ({ name, className }: { name: string; className?: string }) => {
  const base = `${className || ''} object-contain`;
  const dark = `${base} dark:invert`;

  const icons: Record<string, { src: string; cls?: string }> = {
    'React':            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    'Next.js':          { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', cls: dark },
    'TypeScript':       { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    'Node.js':          { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    'Express':          { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', cls: dark },
    'Python':           { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    'Golang':           { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
    'FastAPI':          { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
    'MongoDB':          { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    'PostgreSQL':       { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    'Firebase':         { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
    'AWS':              { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', cls: dark },
    'Azure':            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
    'Google Cloud':     { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
    'Docker':           { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    'Vercel':           { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg', cls: dark },
    'Git':              { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    'GitHub Actions':   { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', cls: dark },
    'TensorFlow':       { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
    'PyTorch':          { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg' },
    'OpenCV':           { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg' },
    'Selenium':         { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg' },
    'OpenAI':           { src: 'https://cdn.simpleicons.org/openai', cls: dark },
    'LangChain':        { src: 'https://cdn.simpleicons.org/langchain', cls: dark },
    'WordPress':        { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg', cls: dark },
    'Android Studio':   { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg' },
    'Android':          { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg' },
    'Tailwind':         { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
    'Tailwind CSS':     { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
    'Slack':            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg' },
    'Jira':             { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg' },
    'Hugging Face':     { src: 'https://cdn.simpleicons.org/huggingface', cls: dark },
    'Google Gemini':    { src: 'https://cdn.simpleicons.org/googlegemini', cls: dark },
  };

  const icon = icons[name];
  if (!icon) {
    // Fallback: render name as text chip
    return (
      <span className={`${className || ''} inline-flex items-center justify-center text-[8px] font-black uppercase text-foreground/50`}>
        {name.charAt(0)}
      </span>
    );
  }

  return <img src={icon.src} alt={name} loading="lazy" className={icon.cls || base} />;
};
