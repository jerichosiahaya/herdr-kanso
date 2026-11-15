import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';

addons.setConfig({
  theme: themes.dark,
  tagBadges: [{ tags: 'In review', badge: { text: 'In review', style: 'yellow' } }],
});
