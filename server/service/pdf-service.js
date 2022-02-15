const PDFDocument = require('pdfkit');

  function buildInvoicePDF(dataCallback, endCallback, invoice) {
  const doc = new PDFDocument({ bufferPages: true, size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  doc.end();
  }

  function generateHeader(doc) {
    doc
      .image("logo.png", 50, 45, { height: 40 })
      .fillColor("#444444")
      .fontSize(10)
      .text("Clean4U Montreal", 200, 50, { align: "right" })
      .text("123 Main Street", 200, 65, { align: "right" })
      .text("Montreal, QC, J5V4M1", 200, 80, { align: "right" })
      .moveDown();
  }
  
  function generateCustomerInformation(doc, invoice) {
      var status = "none";
      
      if (invoice.status == 0){
          status = "Unpaid";
      }
      else if(invoice.status ==9){
          status = "Cancelled";
      }
      else if(invoice.status ==1){
        status = "Partially Paid";
    }

    doc
      .fillColor("#444444")
      .fontSize(20)
      .text("Invoice #" + invoice.id, 50, 160)
      .fontSize(13)
      .font("Helvetica-Bold")
      .text(status, 50, 165, { align: "right" })
      ;
  
    generateHr(doc, 185);
  
    const customerInformationTop = 200;
  
    doc
      .fontSize(10)
      .text("Due Date:", 50, customerInformationTop)
      .font("Helvetica-Bold")
      .text(formatDate(invoice.due_date), 150, customerInformationTop)
      .font("Helvetica")
      .text("Invoice Date:", 50, customerInformationTop + 15)
      .text(formatDate(invoice.created_date), 150, customerInformationTop + 15)
      .text("Invoice Total:", 50, customerInformationTop + 30)
      .text(
        formatCurrency(invoice.total),
        150,
        customerInformationTop + 30
      )
  
      .font("Helvetica-Bold")
      .text(invoice.name, 300, customerInformationTop)
      .font("Helvetica")
      .text(invoice.address, 300, customerInformationTop + 15)
      .text(
        invoice.city +
          ", " +
          invoice.province +
          ", " +
          invoice.country,
        300,
        customerInformationTop + 30
      )
      .moveDown();
  
    generateHr(doc, 252);
  }
  
  function generateInvoiceTable(doc, invoice) {
    let i = 0;
    const invoiceTableTop = 330;
  
    doc.font("Helvetica-Bold");
    generateTableRow(
      doc,
      invoiceTableTop,
      "Item",
      "Description",
      "Unit Cost",
      "Quantity",
      "Tax",
      "Line Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    // First row
    if (invoice.product_1){
        i = 1;
        generateTableRow(
            doc,
            invoiceTableTop + (i) * 30,
            invoice.product_1,
            invoice.description_1,
            formatCurrency(invoice.price_1),
            invoice.qty_1,
            invoice.tax_amt_1,
            formatCurrency(invoice.rowtotal_1)
          );
          generateHr(doc,  invoiceTableTop + (i) * 30 + 20);
    }
    
    

      // Second row
    if (invoice.product_2){
        i = 2;
      generateTableRow(
        doc,
        invoiceTableTop + (i) * 30,
        invoice.product_2,
        invoice.description_2,
        formatCurrency(invoice.price_2),
        invoice.qty_2,
        invoice.tax_amt_2,
        formatCurrency(invoice.rowtotal_2)
      );
      generateHr(doc,  invoiceTableTop + (i) * 30 + 20);
  
     


    }

    if (invoice.product_2 && invoice.product_3){
        i = 3;
      generateTableRow(
        doc,
        invoiceTableTop + (i) * 30,
        invoice.product_3,
        invoice.description_3,
        formatCurrency(invoice.price_3),
        invoice.qty_3,
        invoice.tax_amt_3,
        formatCurrency(invoice.rowtotal_3)
      );

      generateHr(doc,  invoiceTableTop + (i) * 30 + 20);
    }

    generateHr(doc, 90 + 20);

    const subtotalPosition = invoiceTableTop + (i) * 30 + 60;
    
    generateTableRow(
      doc,
      subtotalPosition,
      "",
      "",
      "",
      "",
      "Subtotal",
      formatCurrency(invoice.subtotal)
    );
    doc.font("Helvetica");
    generateTableRow(
        doc,
        subtotalPosition + 20,
        "",
        "",
        "",
        "",
        "Tax (" + (invoice.taxTotal / invoice.total * 100).toFixed(2) + "%)" ,
        formatCurrency(invoice.taxTotal)
      );
      doc.font("Helvetica");
  
    // const paidToDatePosition = subtotalPosition + 20;
    // generateTableRow(
    //   doc,
    //   paidToDatePosition,
    //   "",
    //   "",
    //   "Paid To Date",
    //   "",
    //   formatCurrency(invoice.subtotal)
    // );
  
    const duePosition = subtotalPosition + 40;
    
    doc.font("Helvetica-Bold");
    generateTableRow(
      doc,
      duePosition,
      "",
      "",
      "",
      "",
      "Balance Due",
      formatCurrency(invoice.subtotal)
    );
    doc.font("Helvetica");
    
  }
  
  function generateFooter(doc) {
    doc
      .fontSize(10)
      .text(
        "Thank you for your business.",
        50,
        780,
        { align: "center", width: 500 }
      );
  }
  
  function generateTableRow(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    tax,
    lineTotal
  ) {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(description, 160, y)
      .text(unitCost, 260, y, { width: 90, align: "right" })
      .text(quantity, 330, y, { width: 90, align: "right" })
      .text(tax, 370, y, { width: 90, align: "right" })
      .text(lineTotal, 0, y, { align: "right" });
  }
  
  function generateHr(doc, y) {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }
  
  function formatCurrency(cents) {
    return "$" + (cents / 100).toFixed(2);
  }
  
  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
  
    return year + "/" + month + "/" + day;
  }
















module.exports = { buildInvoicePDF };