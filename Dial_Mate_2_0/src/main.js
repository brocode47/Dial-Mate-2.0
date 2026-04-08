/* __imports_rewritten__ */
import ReactDOM from 'https://esm.sh/react-dom@19.2.0/client?deps=react@19.2.0';
import { html } from './jsx.js';
import { Providers } from './mainProviders.js';
import { App } from './App.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  html`<${Providers}><${App} /></${Providers}>`
);