import type { lightTheme } from "./styles/theme";

type Theme = typeof lightTheme;

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
