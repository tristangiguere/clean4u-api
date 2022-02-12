const PDFDocument = require("pdfkit");


function buildPDF(data, dataCallback, endCallback){
    const doc = new PDFDocument();
    doc.on(data, dataCallback, endCallback);
    doc.text("James here.");
    doc.end();

}

module.exports = { buildPDF };

// const pdfService = require('../service/pdf-service');