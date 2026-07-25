import type { Preview } from '@storybook/react-vite';
import './preview.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    a11y: {
      // Report violations without failing the run — a11y findings on shared
      // primitives are usually a design conversation, not a build break.
      test: 'todo',
    },
  },

  globalTypes: {
    theme: {
      description: 'Colour scheme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: { theme: 'light' },

  decorators: [
    // The tokens switch on a `.dark` ancestor (see @custom-variant in
    // preview.css), so toggling the class is all a theme switch needs to be.
    (Story, context) => {
      const dark = context.globals.theme === 'dark';
      return (
        <div className={dark ? 'dark' : ''}>
          <div className="bg-background text-foreground p-6">
            <Story />
          </div>
        </div>
      );
    },
  ],
};

export default preview;
