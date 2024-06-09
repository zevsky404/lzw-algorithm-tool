import {LwzConverter} from "./classes";

function compress(textareaText) {
    let compressionResult = lzwConverter.compressText(textareaText);
    dictionaryTextarea.value = lzwConverter.stringifyDictionary();
    compressedTextarea.value = compressionResult.compressedText;
}

function decompress(textareaText) {
    let decompression = lzwConverter.splitCompressedText(textareaText);
    let compressionResult = lzwConverter.decompressText(decompression);
    dictionaryTextarea.value = lzwConverter.stringifyDictionary();
    decompressedTextarea.value = compressionResult.decompressedText;

}

let lzwConverter = new LwzConverter();
const compressButton = document.getElementById("compress-button");
const decompressButton = document.getElementById("decompress-button");
let compressedTextarea = document.getElementById("compressed-text");
let decompressedTextarea = document.getElementById("decompressed-text");
let dictionaryTextarea = document.getElementById("dictionary");

compressButton.addEventListener("click", callback => {
    const decompressedText = document.getElementById("decompressed-text").value;
    compress(decompressedText);
});

decompressButton.addEventListener("click", callback => decompress(compressedTextarea.value))




