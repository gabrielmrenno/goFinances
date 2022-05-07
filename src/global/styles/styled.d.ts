import 'styled-components';

import theme from './theme';

// Creating a type "ThemeType", with "theme" type (typeof)
declare module 'styled-components' {
    type ThemeType = typeof theme;

    // Adding "ThemeType" to our theme in styled-components
    export interface DefaultTheme extends ThemeType { }
}