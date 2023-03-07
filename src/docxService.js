/*import JSZip from 'jszip';
import {xmlToJson} from "./xmlToJson.js";
import * as fs from 'fs';
import { Document, Packer, Paragraph } from 'docx'*/

async function readDocxFile(file) {
    // Créer une instance de JSZip et extraire le contenu du fichier
    const zip = new JSZip();
    const docx = await zip.loadAsync(file);
    const contentString = await docx.file('word/document.xml').async('string');

    // Convertit le contenu string en Xml
    const parser = new DOMParser();
    const contentXml = parser.parseFromString(contentString, "application/xml");

    // Convertit le contenu XML en Json
    const  contentJson = xmlToJson(contentXml)

    return contentJson
}

function getTextOfFile(file){
    const paragraphs = file["w:document"]["w:body"]["w:p"];
    let text = "";
    for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        if (paragraph["w:r"]) {
            const runs = paragraph["w:r"];
            let paragraphText = "";
            if (runs.length === undefined && runs["w:t"]){
                paragraphText += runs["w:t"]['#text']
            }
            for (let j = 0; j < runs.length; j++) {
                const run = runs[j];
                if (run["w:t"]) {
                    paragraphText += run["w:t"]['#text'];
                }
            }
            text += paragraphText + "\n";
        }
    }
    return addLineBreaks(text);
}

function addLineBreaks(text) {
    const lines = text.split('\n');
    let result = '';
    const regex = /:$/gm;

    for (let i = 0; i < lines.length; i++) {
        if (regex.test(lines[i])) {
            result += '\n' + lines[i] + '\n';
        } else {
            result += lines[i] + '\n';
        }
    }
    return result.trim();
}

function getSubjects(fileContent) {
    const regex = /Recherches(.+?)Livrable/gs;
    let match;
    while ((match = regex.exec(fileContent)) !== null) {
        return match[1].trim().split('\n')
    }
}

function addParagraph(nomFichier, texte, callback) {
    // Charger le fichier .docx
    //const doc = new Document(fs.readFileSync(nomFichier));
    const doc = new Document();

    // Créer un nouveau paragraphe avec le texte fourni
    const paragraph = new Paragraph(texte);

    // Ajouter le paragraphe au document
    doc.addParagraph(paragraph);

    // Enregistrer les modifications dans le fichier .docx
    Packer.toBuffer(doc).then(buffer => {
        fs.writeFileSync(nomFichier, buffer);
        callback('fini');
    }).catch(err => {
        callback(err);
    });
}

