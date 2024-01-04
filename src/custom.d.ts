// declare module "*.svg" {
//   import React = require("react");
//   export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
// }
declare module "*.svg" {
  const content: string;
  export default content;
}
declare module "*.png" {
  const content: string;
  export default content;
}
declare module "*.csv" {
  const content: string;
  export default content;
}
// declare global {
//   interface NodeRequire {
//     context: (
//       directory: string,
//       useSubdirectories: boolean,
//       regExp: RegExp
//     ) => any;
//   }
// }
