/**
 * Inserts a given value into a given array at the given index
 * @param array {*[]} Array where value is inserted into.
 * @param index {number} Index at which new value is inserted.
 * @param value {Any} New value to be inserted into the array.
 * @returns {*[]} New array with the inserted value at the given index.
 */
function insertAtIndex(array, index, value) {
    return [
        ...array.slice(0, index),
        value,
        ...array.slice(index)
    ];
}

export class LwzConverter {
    constructor() {
        this.#dictionary = new Map();
        this.#stepCollection = [];
    }

    #dictionary = new Map();
    #stepCollection = [];

    /**
     * Utility function to empty the dictionary and step collection after/before use.
     */
    emptyArrays() {
        this.#dictionary.clear();
        this.#stepCollection.length = 0;
    }

    buildStep(string, z, newEntry) {
        let entry = "";

        if (newEntry === undefined) entry = "-";
        else entry = `${newEntry[1]} => ${newEntry[0]}`;

        return {S: string, z: z, newEntry: entry};
    }

    /**
     * Utility function for working with single strings and compound entries in the dictionary.
     * @param {String} string A string which can be a single character or a composed character, e.g. <265>A or whitespace
     * @returns {*|string} String itself, a character representing the whitespace or the respective address for that string.
     */
    getStringFromDictionary(string) {
        switch (true) {
            case string === " ":
                return "_";

            case string === "\n":
                return "/";

            case string === "":
                return string;

            case string.length === 1:
                return string;

            default:
                return `<${this.#dictionary.get(string)}>`;
        }
    }

    /**
     * Utility function to access a string from the dictionary, as the addresses are the values in the dictionary.
     * @param {String} address Address to be accessed in the format 265 (three-digit number)
     * @returns {string} String associated with the address, or an error.
     */
    getStringByAddress(address) {
        let string = "";
        for (let entry of this.#dictionary.entries()) {
            if (entry[1].toString() === address) {
                string = entry[0];
                break;
            }
        }
        if (string !== "") return string;
        else throw `Address '${address}' not found in dictionary.`;
    }

    /**
     * Utility function to turn the dictionary into a string to print or add to text areas.
     * @returns {string} The dictionary as a string in the form of address: string
     */
    stringifyDictionary() {
        let string = "";
        for (const entry of this.#dictionary.entries()) {
            string += `${entry[1]}: ${entry[0]}`;
            string += "\n";
        }
        return string;
    }

    /**
     * Turns a compressed text into an array, splitting it into single letters and addresses
     * @param compressedText A LZW compressed text containing letters and addresses
     * @returns {*[]} Text split up into an array by letter and address, e.g. ['A', 'B', '<256>']
     */
    splitCompressedText(compressedText) {
        let splitText = [];
        let i = 0;
        while (i < compressedText.length) {
            const character = compressedText[i];
            if (character !== "<") {
                splitText.push(character);
                ++i;
            } else {
                const address = [character, compressedText[i + 1], compressedText[i + 2], compressedText[i + 3], compressedText[i + 4]].join("");
                splitText.push(address);
                i += 5;
            }
        }
        return splitText;
    }

    /**
     * Compresses a string using the LZW algorithm.
     * @param {String} decompressedText The text to be compressed.
     * @returns {{dictionary: Map<any, any>, compressedText: string, steps: []}} An object containing the resulting dictionary from the compression and the compressed text.
     */
    compressText(decompressedText) {
        // empty dictionary before use
        this.emptyArrays();
        let string = ""; // S from the lecture
        let currentSymbol = "";
        let compressedText = ""; // z from the lecture

        // iterates over all letters of the decompressed text
        for (let letter of decompressedText) {
            currentSymbol = letter;
            // auxiliary variables for building a step
            const _currentSymbol = currentSymbol;
            const _string = string;

            let sz = [this.getStringFromDictionary(string), currentSymbol].join(""); // joins S and z
            let nextFreeAddress = this.#dictionary.size + 256;

            // check whether Sz is already in dictionary
            if (!this.#dictionary.has(sz) && string !== "") {
                // add string or compound string (address) to compressed text
                compressedText += this.getStringFromDictionary(string);
                // add string or compound string (address) to dictionary
                this.#dictionary.set([this.getStringFromDictionary(string), currentSymbol].join(""), nextFreeAddress);
                string = currentSymbol;
            } else {
                string = [this.getStringFromDictionary(string), currentSymbol].join("");
            }
            this.#stepCollection.push(this.buildStep(_string, _currentSymbol, Array.from(this.#dictionary).pop()));
        }
        // add string or compound string (address) to compressed text at the end of the process
        if (string !== "") compressedText += this.getStringFromDictionary(string);
        return {compressedText: compressedText, dictionary: this.#dictionary, steps: this.#stepCollection};
    }

    /**
     * Decompresses a compressed string using the LZW algorithm
     * @param compressedArray An array containing the single letters and addresses of the text to be decompressed.
     * @returns {{decompressedText: string, dictionary: Map<any, any>, steps: []}} An object containing the resulting dictionary from the decompression and the decompressed text.
     */
    decompressText(compressedArray) {
        // empty dictionary before use
        this.emptyArrays();
        let string = "";
        let currentSymbol = "";
        let decompressedText = "";

        for (let i = 0; i < compressedArray.length; ++i) {
            currentSymbol = compressedArray[i];
            // auxiliary variables to build a step
            const _string = string;
            const _currentSymbol = currentSymbol;

            let nextFreeAddress = this.#dictionary.size + 256;
            // while entry is an address
            while (currentSymbol.length > 1) {
                // extract address from whole string: <256> -> 256
                const address = currentSymbol.substring(1, 4);
                // remove address from array to replace with respective substring
                compressedArray.splice(i, 1);
                // get respective substring from dictionary
                const partString = this.getStringByAddress(address);
                const partArray = this.splitCompressedText(partString);
                // add substring as array to the array holding the compressed text
                for (const entry of partArray.reverse()) {
                    compressedArray = insertAtIndex(compressedArray, i, entry);
                }
                // set current symbol to first symbol of added substring
                currentSymbol = compressedArray[i];
            }
            // add current symbol to the uncompressed text
            decompressedText += currentSymbol;
            // update Sz
            let sz = [this.getStringFromDictionary(string), currentSymbol].join("");
            // check whether Sz is in dictionary and add it if necessary
            if (!this.#dictionary.has(sz) && string !== "") {
                this.#dictionary.set([this.getStringFromDictionary(string), currentSymbol].join(""), nextFreeAddress);
                string = "";
            }
            // update S
            string = [this.getStringFromDictionary(string), currentSymbol].join("");
            this.#stepCollection.push(this.buildStep(_string, _currentSymbol, Array.from(this.#dictionary).pop()));
        }
        return {decompressedText: decompressedText, dictionary: this.#dictionary, steps: this.#stepCollection};
    }

}