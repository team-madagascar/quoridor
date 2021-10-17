export const createElement = ({
  tagName,
  className,
  attributes = {},
}: {
  tagName: string;
  className?: string;
  attributes?: Record<string, string>;
}) => {
  const element = document.createElement(tagName);

  if (className) {
    const classNames = className.split(' ').filter(Boolean);
    element.classList.add(...classNames);
  }

  Object.keys(attributes).forEach(key =>
    element.setAttribute(key, attributes[key])
  );

  return element;
};
