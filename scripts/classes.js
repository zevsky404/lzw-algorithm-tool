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
    }

    #dictionary = new Map();

    emptyDictionary() {
        this.#dictionary.clear();
    }

    getStringFromDictionary(string) {
        if (string === "" || string.length === 1) {
            return string;
        }
        else {
            return `<${this.#dictionary.get(string)}>`;
        }
    }

    getStringByAddress(address) {
        let string = "";
        for (let entry of this.#dictionary.entries()) {
            if (entry[1].toString() === address) {
                string = entry[0];
                break;
            }
        }
        console.log(`entered address: ${address}, returned string: ${string}`)
        if (string !== "") return string;
        else throw `Address '${address}' not found in dictionary.`;
    }

    stringifyDictionary() {
        let string = "";
        for (const entry of this.#dictionary.entries()) {
            string += `${entry[1]}: ${entry[0]}`;
            string += "\n";
        }
        return string;
    }

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

    compressText(decompressedText) {
        this.emptyDictionary();
        let string = "";
        let currentSymbol = "";
        let compressedText = "";

        for (let letter of decompressedText) {
            currentSymbol = letter;
            let sz = [this.getStringFromDictionary(string), currentSymbol].join("");
            let nextFreeAddress = this.#dictionary.size + 256;

            if (!this.#dictionary.has(sz) && string !== "") {
                compressedText += this.getStringFromDictionary(string);
                this.#dictionary.set([this.getStringFromDictionary(string), currentSymbol].join(""), nextFreeAddress);
                string = currentSymbol;
            } else {
                string = [this.getStringFromDictionary(string), currentSymbol].join("");
            }
        }
        if (string !== "") compressedText += this.getStringFromDictionary(string);
        return {compressedText: compressedText, dictionary: this.#dictionary};
    }

    decompressText(compressedArray) {
        this.emptyDictionary();
        let string = "";
        let currentSymbol = "";
        let decompressedText = "";

        for (let i = 0; i < compressedArray.length; ++i) {
            currentSymbol = compressedArray[i];
            let nextFreeAddress = this.#dictionary.size + 256;
            console.log(`string = ${string}: ${this.getStringFromDictionary(string)}, current symbol: ${currentSymbol}`)
            while (currentSymbol.length > 1) {
                // entry is address
                console.log(compressedArray)
                const address = currentSymbol.substring(1, 4);
                compressedArray.splice(i, 1);
                const partString = this.getStringByAddress(address);
                const partArray = this.splitCompressedText(partString);
                console.log(partArray)
                for (const entry of partArray.reverse()) {
                    compressedArray = insertAtIndex(compressedArray, i, entry);
                }
                currentSymbol = compressedArray[i];
            }
            decompressedText += currentSymbol;
            let sz = [string, currentSymbol].join("");
            if (!this.#dictionary.has(sz) && string !== "") {
                this.#dictionary.set([this.getStringFromDictionary(string), currentSymbol].join(""), nextFreeAddress);
                string = "";
            }
            string = [string, currentSymbol].join("");
        }
        console.log(this.#dictionary)
        return {decompressedText: decompressedText, dictionary: this.#dictionary};
    }

}