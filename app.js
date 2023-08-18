let btn = document.querySelector('button');
let resultParagraph = document.querySelector('#result');

let url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

btn.addEventListener("click", async ()=>{
    let word = document.querySelector("input").value.trim();
    if(word) {
        try{
            let definition = await getDefinition(word);
            if(definition) {
                resultParagraph.textContent = `Definition of '${word}' : ${definition}`;
            }else{
                resultParagraph.textContent = `No definition found for '${word}'.`;
            }
        }catch(e) {
            resultParagraph.textContent = e.message;
        }
    }else{
        resultParagraph.textContent = "Please enter a word to search.";
    }
})

async function getDefinition(word) {
    try{
        let res = await axios.get(url + word);
        console.log(res);
        let definition = res.data[0]?.meanings[0]?.definitions[0]?.definition;
        return definition;
    }catch(e) {
        console.log("ERR: ", e);
        throw new Error(`Error fetching definition: ${e.message}`);
    }
}
