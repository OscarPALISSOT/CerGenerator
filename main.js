import {generateDocx, getKeyWords, getSubjects, getTextOfFile, getTitles, readDocxFile} from "./src/docxService.js";

async function GenerateCer(event) {
    event.preventDefault()
    const input = form.children[0]
    if (!input.files[0]) {
        container.innerHTML = '<p>Pas de fichier importé</p>'
    } else {
        let htmlContent = '<p>En cours de traitement</p>'
        container.innerHTML = htmlContent

        const docxFileInJson = await readDocxFile(input.files[0]);
        const fileContent = getTextOfFile(docxFileInJson);
        const keyWords = getKeyWords(fileContent)
        const subjects = getSubjects(fileContent);
        const titles = getTitles(fileContent)

        if (subjects.length){

            /*

            for (let i = 0; i < subjects.length; i++){
                console.log(await getWordExplanation(subjects[i]))
                htmlContent = '<p>' + (i + 1) + '/' + subjects.length + '</p>'
                container.innerHTML = htmlContent;
            }

             */

            generateDocx()



        }else {
            htmlContent = '<p>Pas de recherches trouvées</p>'
        }
        container.innerHTML = ''
        form.reset()

    }
}

const container = document.getElementById('container');
const form = document.getElementById('form');
form.addEventListener('submit', GenerateCer);