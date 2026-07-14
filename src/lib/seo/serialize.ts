
// /**
//  * Safely serialize JSON for embedding inside a <script> tag.
//  * Prevents characters from breaking the HTML or JavaScript.
//  */
// export function serializeJsonLd(data: unknown): string {
//   return JSON.stringify(data)
//     .replace(/</g, "\\u003c")
//     .replace(/>/g, "\\u003e")
//     .replace(/&/g, "\\u0026")
//     .replace(/\u2028/g, "\\u2028")
//     .replace(/\u2029/g, "\\u2029");
// }

export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .split(String.fromCharCode(0x2028))
    .join("\\u2028")
    .split(String.fromCharCode(0x2029))
    .join("\\u2029");
}