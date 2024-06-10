import {LwzConverter} from "./classes";
import {TabulatorFull as Tabulator} from 'tabulator-tables';

function buildTable(data) {
    let table = new Tabulator('#table-test', {
        data: data,
        height: "100%",
        layout:"fitDataStretch",
        columns:[ //Define Table Columns
            {title: "S with address", field: "S", headerSort: false},
            {title: "z", field: "z", hozAlign: "left", headerSort: false},
            {title: "New Entry", field: "newEntry", headerSort: false},
        ],
    });
}

function compress(textareaText) {
    let compressionResult = lzwConverter.compressText(textareaText);
    dictionaryTextarea.value = lzwConverter.stringifyDictionary();
    compressedTextarea.value = compressionResult.compressedText;
    buildTable(compressionResult.steps);
}

function decompress(textareaText) {
    let decompression = lzwConverter.splitCompressedText(textareaText);
    let compressionResult = lzwConverter.decompressText(decompression);
    dictionaryTextarea.value = lzwConverter.stringifyDictionary();
    decompressedTextarea.value = compressionResult.decompressedText;
    buildTable(compressionResult.steps);
}

function clearAll() {
    decompressedTextarea.value = "";
    compressedTextarea.value = "";
    dictionaryTextarea.value = "";
    buildTable([]);
}

function clearDictionary() {
    dictionaryTextarea.value = "";
    buildTable([]);
}

let lzwConverter = new LwzConverter();

const compressButton = document.getElementById("compress-button");
const decompressButton = document.getElementById("decompress-button");
const clearAllButton = document.getElementById("clear-all-button");
const clearDictButton = document.getElementById("clear-dict-button");

let compressedTextarea = document.getElementById("compressed-text");
let decompressedTextarea = document.getElementById("decompressed-text");
let dictionaryTextarea = document.getElementById("dictionary");

buildTable([]);
compressButton.addEventListener("click", callback => compress(decompressedTextarea.value));
decompressButton.addEventListener("click", callback => decompress(compressedTextarea.value));

clearAllButton.addEventListener("click", clearAll);
clearDictButton.addEventListener("click", clearDictionary);




