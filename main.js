import {getKeyWords, getSubjects, getTextOfFile, getTitles, readDocxFile} from "./src/docxService.js";

async function GenerateCer(event) {
    event.preventDefault()
    const input = form.children[0]
    if (!input.files[0]) {
        container.innerHTML = '<p>Pas de fichier importé</p>'
    } else {
        let htmlContent = ''
        container.innerHTML = '<p>En cours de traitement</p>'

        const docxFileInJson = await readDocxFile(input.files[0]);
        const fileContent = getTextOfFile(docxFileInJson);
        const keyWords = getKeyWords(fileContent)
        const subjects = getSubjects(fileContent);
        const titles = getTitles(fileContent)
        console.log(titles)
        /*

        if (subjects.length){

            for (let i = 0; i < subjects.length; i++){
                console.log(await getWordExplanation(subjects[i]))
                htmlContent = '<p>' + (i + 1) + '/' + subjects.length + '</p>'
                container.innerHTML = htmlContent;
            }

            addParagraph(input.files[0].name, 'Ceci est un nouveau paragraphe.', function(err) {
                if (err) {
                    console.error('Erreur :', err);
                } else {
                    console.log('Le paragraphe a été ajouté avec succès.');
                }
            });



        }else {
            htmlContent = '<p>Pas de recherches trouvées</p>'
        }

         */
        form.reset()

    }
}

const container = document.getElementById('container');
const form = document.getElementById('form');
form.addEventListener('submit', GenerateCer);