# YouVersion Highlight Transposer

This is a tool that enables you to transpose your highlighted verses from one translation to another in the YouVersion Bible app. Bear in mind that this tool is still being worked on and is far from perfect. But I do hope that this tool enables you to finally enjoy other translations with your highlighted verses intact.

### How to Use

1. Get the latest version of [npm](https://www.npmjs.com/get-npm)
2. Clone the repo
3. Add your authorization token to `secret.js`, as shown in [this demo](https://user-images.githubusercontent.com/25396169/112420514-5410d000-8cfb-11eb-88c5-906566a89e12.mp4)
4. `cd` to the repo's root directory, using the terminal
5. Type `npm i` in the terminal to install the requisite package(s)
6. Type `node TransferHighlights.js <source_translation> <dest_translation>` in the terminal
7. Wait for your highlights to transpose

**Note:** `<source_translation>` is the translation that you wish to copy your highlights from and `<dest_translation>` is the translation that you wish to copy your highlights to, e.g., `node TransferHighlights.js hcsb niv`
