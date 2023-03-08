import JSZip from 'jszip';
import {xmlToJson} from "./xmlToJson.js";
import * as docx from 'docx'
import { saveAs } from 'file-saver';

export async function readDocxFile(file) {
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

export function getTextOfFile(file){
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

export function addLineBreaks(text) {
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

export function getSubjects(fileContent) {
    const regex = /(Recherches|Recherche)(.+?)Livrable/gs;
    let match;
    while ((match = regex.exec(fileContent)) !== null) {
        const subjects = match[0].trim().split('\n')
        subjects.shift()
        subjects.pop()
        return subjects
    }
}

export function getKeyWords(fileContent){
    const regex = /(Mots-clés:|Mots-clés :|Mots-clés|Mots-clef:|Mots-clef :|Mots-clefs :|Mots-clefs:)(.+?)\n\n/gs;
    let match;
    while ((match = regex.exec(fileContent)) !== null) {
        const keyword = match[0].trim().split('\n')
        keyword.shift()
        return keyword
    }
}

export function getTitles(fileContent){
    const regex = /\n\n(.+?)\n/gs;
    const matches = fileContent.match(regex);
    return matches.map((match) => match.trim());
}

function addParagraph(title, text) {
    return new docx.Paragraph({
        text: title,
        break: 1,
        children: [
            new docx.TextRun({
                text: text,
                break: 1,
            }),
        ]
    });
}



export function generateDocx(content) {
    const doc = new docx.Document({
        sections: [
            {
                properties: {},
                children: [
                    content[0].forEach((element, index) => addParagraph(content[0][index], content[1][index])),
                ]
            }
        ]
    });

    doc.addParagraph(new docx.Paragraph("Parameters"));

    docx.Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "example.docx");
        console.log("Document created successfully");
    });
}

