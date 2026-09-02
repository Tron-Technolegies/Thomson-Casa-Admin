import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Utility function to export a simple table to PDF
 * 
 * @param {string} title - The title of the document
 * @param {Array<string>} headers - Array of string headers for the table
 * @param {Array<Array<any>>} data - 2D array of row data
 * @param {string} filename - Output filename (e.g., 'report.pdf')
 */
export const exportTableToPDF = (title, headers, data, filename = "report.pdf") => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  
  // Add date
  doc.setFontSize(10);
  const dateStr = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
  doc.text(`Generated on: ${dateStr}`, 14, 28);
  
  // Add Table
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 35,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [70, 92, 143] }, // Matches Thomson Casa primary color (#465C8F)
  });
  
  doc.save(filename);
};

/**
 * Utility function to export an individual invoice to PDF
 */
export const exportInvoiceToPDF = (invoice) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(70, 92, 143);
  doc.text("INVOICE", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Invoice Number: ${invoice.id || invoice.invoice_number}`, 14, 32);
  doc.text(`Date: ${invoice.date || new Date().toLocaleDateString()}`, 14, 38);
  doc.text(`Status: ${invoice.status}`, 14, 44);

  // Bill To
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("Bill To:", 14, 56);
  doc.setFontSize(11);
  doc.setTextColor(80);
  doc.text(invoice.customer || "Walk-in Customer", 14, 64);

  // Table
  const headers = ["Item / Description", "Amount"];
  const data = [
    ["Subtotal (Net Amount)", `Rs. ${parseFloat(invoice.amount || 0).toFixed(2)}`],
    ["Tax (GST)", `Rs. ${parseFloat(invoice.tax || invoice.gst_amount || 0).toFixed(2)}`],
    ["Total Amount", `Rs. ${parseFloat(invoice.total || invoice.total_amount || 0).toFixed(2)}`],
    ["Advance Used", `Rs. ${parseFloat(invoice.advance_used || 0).toFixed(2)}`],
    ["Balance Due", `Rs. ${parseFloat(invoice.balance || 0).toFixed(2)}`]
  ];

  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 75,
    theme: 'grid',
    headStyles: { fillColor: [70, 92, 143] },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 'auto', halign: 'right' }
    }
  });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("Thank you for your business!", 14, doc.lastAutoTable.finalY + 20);

  doc.save(`Invoice_${invoice.id || invoice.invoice_number}.pdf`);
};
