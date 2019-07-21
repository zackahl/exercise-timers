// Tell TypeScript what .vue files will look like when they're imported

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}