let btn = document.querySelector('button');
let resultParagraph = document.querySelector('#result');

let url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

btn.addEventListener("click", async () => {
    let word = document.querySelector("input").value.trim();
    if (word) {
        try {
            let wordData = await getDefinition(word);
            if (wordData) {
                // Display the word and its definition
                resultParagraph.textContent = `Definition of '${word}': ${wordData.definition}`;

                // Phonetic pronunciation
                document.querySelector("#phonetic").textContent = `Phonetic: ${wordData.phonetic}`;

                // Phonetic audio
                if (wordData.audio) {
                    document.querySelector("#audio").src = wordData.audio;
                    document.querySelector("#audio").style.opacity = "1";
                }

                // Word origin
                document.querySelector("#origin").textContent = `Origin: ${wordData.origin || 'Not available'}`;

                // Meanings
                let meaningsHTML = "";
                wordData.meanings.forEach((meaning) => {
                    meaningsHTML += `<h3>${meaning.partOfSpeech}</h3>`;
                    let definitionCount = 0; // Counter to limit definitions

                    meaning.definitions.forEach((def) => {
                        if (definitionCount < 3) { // Limit to 3 definitions
                            meaningsHTML += `<p><strong>Definition:</strong> ${def.definition}</p>`;
                            if (def.example) { // Display example if available
                                meaningsHTML += `<p><strong>Example:</strong> ${def.example}</p>`;
                            }
                            definitionCount++;
                        }
                    });
                });
                document.querySelector("#meanings").innerHTML = meaningsHTML;

            } else {
                resultParagraph.textContent = `No definition found for '${word}'.`;
            }
        } catch (e) {
            resultParagraph.textContent = e.message;
        }
    } else {
        resultParagraph.textContent = "Please enter a word to search.";
    }
});

async function getDefinition(word) {
    try {
        let res = await axios.get(url + word);
        let data = res.data[0];
        let wordData = {
            definition: data.meanings[0]?.definitions[0]?.definition,
            phonetic: data.phonetic || data.phonetics[0]?.text,
            audio: data.phonetics[0]?.audio,
            origin: data.origin,
            meanings: data.meanings
        };
        return wordData;
    } catch (e) {
        console.log("ERR: ", e);
        throw new Error(`Error fetching definition: ${e.message}`);
    }
}