import {generateDocx, getKeyWords, getSubjects, getTextOfFile, getTitles, readDocxFile} from "./src/docxService.js";
import {getWordExplanation} from "./src/openAi.js";

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

            let explanations = [];
            for (let i = 0; i < subjects.length; i++){
                explanations.push(await getWordExplanation(subjects[i]))
                htmlContent = '<p>' + (i + 1) + '/' + subjects.length + '</p>'
                container.innerHTML = htmlContent;
            }

            let resources = [subjects, explanations];
            console.log(resources);
            generateDocx(resources)
            htmlContent = '<p>Terminé</p>'



        }else {
            htmlContent = '<p>Pas de recherches trouvées</p>'
        }
        container.innerHTML = htmlContent
        form.reset()

    }
}

const container = document.getElementById('container');
const form = document.getElementById('form');
form.addEventListener('submit', GenerateCer);