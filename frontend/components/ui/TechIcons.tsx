
import React from 'react';

export const TechIconSVG = ({ name, className }: { name: string; className?: string }) => {
  // Common props to ensure images fit the container correctly
  const commonProps = {
    className: `${className} object-contain`,
    alt: name,
    loading: "lazy" as const
  };

  switch (name) {
    case 'React':
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" {...commonProps} />;
    case 'Next.js':
      // Invert color in dark mode so the black logo is visible
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" {...commonProps} className={`${className} object-contain dark:invert`} />;
    case 'TypeScript':
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" {...commonProps} />;
    case 'Node.js':
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" {...commonProps} />;
    case 'Python':
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" {...commonProps} />;
    case 'Golang':
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" {...commonProps} />;
    case 'AWS':
      // AWS wordmark is dark, invert in dark mode
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" {...commonProps} className={`${className} object-contain dark:invert`} />;
    case 'Google Cloud':
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" {...commonProps} />;
    case 'Docker':
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" {...commonProps} />;
    case 'Vercel':
      // Vercel logo is black, invert in dark mode
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg" {...commonProps} className={`${className} object-contain dark:invert`} />;
    case 'Git':
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" {...commonProps} />;
    case 'PostgreSQL':
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" {...commonProps} />;
    case 'MongoDB':
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" {...commonProps} />;
    case 'TensorFlow':
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" {...commonProps} />;
    case 'PyTorch':
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" {...commonProps} />;
    case 'OpenCV':
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" {...commonProps} />;
    case 'FastAPI':
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" {...commonProps} />;
    case 'Selenium':
      return <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg" {...commonProps} />;
    case 'OpenAI':
      return <img src="https://cdn.simpleicons.org/openai" {...commonProps} className={`${className} object-contain dark:invert`} />;
    case 'LangChain':
      return <img src="https://cdn.simpleicons.org/langchain" {...commonProps} className={`${className} object-contain dark:invert`} />;
    default:
      return null;
  }
};
