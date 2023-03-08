import JSZip from 'jszip';
import {xmlToJson} from "./xmlToJson.js";
import * as docx from 'docx'
import { saveAs } from 'file-saver';
import {AlignmentType, HeadingLevel} from "docx";

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

export function getKeyWord(fileContent){
    const regex = /(Mots-clés:|Mots-clés :|Mots-clés)(.+?)\n\n/gs;
    let match;
    while ((match = regex.exec(fileContent)) !== null) {
        const keyword = match[0].trim().split('\n')
        keyword.shift()
        return keyword
    }
}

export function addParagraph() {
    console.log('test')
}

export function generateDocx() {
    const doc = new docx.Document({
        sections: [
            {
                properties: {},
                children: [
                    new docx.Paragraph({
                        text: "To whom it may concern:",
                        heading: HeadingLevel.HEADING_2,
                        alignment: AlignmentType.CENTER,
                        break: 1,
                        children: [
                            new docx.TextRun("Hello World"),
                            new docx.TextRun({
                                text: "Foo Bar",
                                bold: true,
                                break: 1,
                            }),
                            new docx.TextRun({
                                text: "\tGithub is the best",
                                bold: true
                            })
                        ]
                    })
                ]
            }
        ]
    });

    docx.Packer.toBlob(doc).then((blob) => {
        console.log(blob);
        saveAs(blob, "example.docx");
        console.log("Document created successfully");
    });
}

