import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  body {
    @apply bg-black;
  }
`;

export default GlobalStyles;