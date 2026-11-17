
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Export a table to PDF.
 *
 * Used by Sales Reports and other report pages.
 */
export const exportTableToPDF = (
  title,
  headers,
  data,
  filename = "report.pdf"
) => {
  const doc = new jsPDF();

  // PDF title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(title, 14, 20);

  // Generated date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);

  const now = new Date();
  const dateStr =
    now.toLocaleDateString("en-IN") +
    " " +
    now.toLocaleTimeString("en-IN");

  doc.text(`Generated on: ${dateStr}`, 14, 28);

  // Check whether this is the Sales Report format.
  // This prevents payment highlighting in unrelated reports.
  const isSalesReport =
    headers.length === 7 &&
    String(headers[0]).includes("Customer") &&
    String(headers[5]).includes("Paid") &&
    String(headers[6]).includes("Balance");

  // Convert formatted numbers such as "12,000.00" to numbers.
  const parseAmount = (value) => {
    const cleaned = String(value ?? "")
      .replace(/[₹,\s]/g, "");

    if (!cleaned) return NaN;

    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : NaN;
  };

  // Determine payment status from paid and balance amounts.
  const getPaymentStatus = (paid, balance) => {
    if (!Number.isFinite(paid) || !Number.isFinite(balance)) {
      return null;
    }

    if (balance <= 0) return "paid";
    if (paid <= 0) return "unpaid";
    return "partial";
  };

  // Each customer may have several meat category rows.
  // Remember the customer's status until the next customer.
  let currentCustomerStatus = null;

  const rowStatuses = data.map((row) => {
    if (!isSalesReport || !Array.isArray(row)) return null;

    const firstCell = String(row[0] ?? "").trim();

    if (
      firstCell === "SECTION TOTAL" ||
      firstCell === "GRAND TOTAL"
    ) {
      currentCustomerStatus = null;
      return null;
    }

    // Live Rate / Meat Rate section heading
    if (
      firstCell === "Live Rate Purchases" ||
      firstCell === "Meat Rate Purchases" ||
      firstCell === "Legacy / Unclassified Purchases"
    ) {
      currentCustomerStatus = null;
      return null;
    }

    // Blank separator row
    if (row.every((cell) => String(cell ?? "").trim() === "")) {
      currentCustomerStatus = null;
      return null;
    }

    // Customer rows have the customer code and name in
    // the first column, and payment details in columns 5 and 6.
    if (firstCell) {
      currentCustomerStatus = getPaymentStatus(
        parseAmount(row[5]),
        parseAmount(row[6])
      );
    }

    return currentCustomerStatus;
  });

  // Create PDF table
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 35,
    theme: "grid",

    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      valign: "middle",
      overflow: "linebreak",
    },

    headStyles: {
      fillColor: [70, 92, 143],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },

    // Right-align numeric columns in the Sales Report.
    ...(isSalesReport
      ? {
          columnStyles: {
            0: { cellWidth: 42 },
            1: { cellWidth: 27 },
            2: { cellWidth: 23, halign: "right" },
            3: { cellWidth: 23, halign: "right" },
            4: { cellWidth: 26, halign: "right" },
            5: { cellWidth: 26, halign: "right" },
            6: { cellWidth: 26, halign: "right" },
          },
        }
      : {}),

    didParseCell: (cellData) => {
      if (!isSalesReport || cellData.section !== "body") {
        return;
      }

      const row = cellData.row.raw;
      const firstCell = String(row?.[0] ?? "").trim();

      const styles = cellData.cell.styles;

      // Section headings
      if (
        firstCell === "Live Rate Purchases" ||
        firstCell === "Meat Rate Purchases"
      ) {
        styles.fillColor = [235, 239, 250];
        styles.textColor = [45, 65, 125];
        styles.fontStyle = "bold";
        return;
      }

      // SECTION TOTAL - Light blue
      if (firstCell === "SECTION TOTAL") {
        styles.fillColor = [213, 230, 255];
        styles.textColor = [25, 55, 110];
        styles.fontStyle = "bold";
        styles.lineWidth = 0.3;
        styles.lineColor = [120, 150, 200];
        return;
      }

      // GRAND TOTAL - Dark blue
      if (firstCell === "GRAND TOTAL") {
        styles.fillColor = [65, 85, 155];
        styles.textColor = [255, 255, 255];
        styles.fontStyle = "bold";
        styles.lineWidth = 0.3;
        styles.lineColor = [65, 85, 155];
        return;
      }

      // Highlight all item rows belonging to the same customer.
      const paymentStatus = rowStatuses[cellData.row.index];


      // Customer payment status highlighting

      if (paymentStatus === "unpaid") {
        // UNPAID - Light Red
        styles.fillColor = [255, 220, 220];
        styles.textColor = [160, 30, 30];

      } else if (paymentStatus === "partial") {
        // PARTIALLY PAID - Light Yellow
        styles.fillColor = [255, 245, 190];
        styles.textColor = [120, 85, 0];

      } else if (paymentStatus === "paid") {
        // FULLY PAID - Normal White
        styles.fillColor = [255, 255, 255];
        styles.textColor = [40, 40, 40];
      }

    },

    // Page numbers
    didDrawPage: (hookData) => {
      const pageCount = doc.getNumberOfPages();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFontSize(9);
      doc.setTextColor(130, 130, 130);

      doc.text(
        `Page ${pageCount}`,
        pageWidth - 14,
        pageHeight - 10,
        { align: "right" }
      );
    },

    margin: {
      top: 35,
      right: 10,
      bottom: 20,
      left: 10,
    },
  });

  doc.save(filename);
};

/**
 * Export an individual invoice to PDF.
 *
 * Kept separate from the Sales Report highlighting.
 */
export const exportInvoiceToPDF = (invoice) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(70, 92, 143);
  doc.text("INVOICE", 14, 22);

  // Invoice details
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);

  doc.text(
    `Invoice Number: ${invoice.id || invoice.invoice_number}`,
    14,
    32
  );

  doc.text(
    `Date: ${invoice.date || new Date().toLocaleDateString()}`,
    14,
    38
  );

  doc.text(
    `Status: ${invoice.status || "Unpaid"}`,
    14,
    44
  );

  // Customer details
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Bill To:", 14, 56);

  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);

  doc.text(
    invoice.customer || "Walk-in Customer",
    14,
    64
  );

  // Invoice summary
  const headers = ["Item / Description", "Amount"];

  const data = [
    [
      "Subtotal (Net Amount)",
      `Rs. ${parseFloat(invoice.amount || 0).toFixed(2)}`,
    ],
    [
      "Tax (GST)",
      `Rs. ${parseFloat(
        invoice.tax || invoice.gst_amount || 0
      ).toFixed(2)}`,
    ],
    [
      "Total Amount",
      `Rs. ${parseFloat(
        invoice.total || invoice.total_amount || 0
      ).toFixed(2)}`,
    ],
    [
      "Advance Used",
      `Rs. ${parseFloat(invoice.advance_used || 0).toFixed(2)}`,
    ],
    [
      "Balance Due",
      `Rs. ${parseFloat(invoice.balance || 0).toFixed(2)}`,
    ],
  ];

  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 75,
    theme: "grid",

    styles: {
      fontSize: 10,
      cellPadding: 4,
    },

    headStyles: {
      fillColor: [70, 92, 143],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },

    columnStyles: {
      0: {
        cellWidth: 120,
      },
      1: {
        cellWidth: "auto",
        halign: "right",
      },
    },

    didParseCell: (cellData) => {
      if (cellData.section !== "body") return;

      const firstCell = String(
        cellData.row.raw?.[0] || ""
      ).trim();

      if (firstCell === "Total Amount") {
        cellData.cell.styles.fillColor = [225, 235, 255];
        cellData.cell.styles.fontStyle = "bold";
        cellData.cell.styles.textColor = [35, 65, 150];
      }

      if (firstCell === "Balance Due") {
        cellData.cell.styles.fillColor = [240, 240, 245];
        cellData.cell.styles.fontStyle = "bold";
      }
    },
  });

  // Footer
  const footerY = Math.min(
    doc.lastAutoTable.finalY + 20,
    doc.internal.pageSize.getHeight() - 15
  );

  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Thank you for your business!",
    14,
    footerY
  );

  doc.save(
    `Invoice_${invoice.id || invoice.invoice_number}.pdf`
  );
};
