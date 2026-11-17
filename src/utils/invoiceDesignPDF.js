
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const getInvoiceNumber = (invoice) => {
  return String(
    invoice?.invoice_number ||
    invoice?.id ||
    "Invoice"
  );
};

/**
 * Create a PDF from the visible invoice design.
 * Only the invoice content element is captured.
 */
export const generateInvoiceDesignPDF = async (
  element,
  invoice
) => {
  if (!element) {
    throw new Error("Invoice content is not available.");
  }

  // Capture the actual styled invoice
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: Math.max(
      document.documentElement.clientWidth,
      element.scrollWidth
    ),
  });

  if (!canvas.width || !canvas.height) {
    throw new Error("Unable to capture invoice.");
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 10;
  const printableWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;

  // Canvas pixels that fit on one PDF page
  const pixelsPerPage = Math.floor(
    (printableHeight * canvas.width) / printableWidth
  );

  let sourceY = 0;
  let pageIndex = 0;

  while (sourceY < canvas.height) {
    const sliceHeight = Math.min(
      pixelsPerPage,
      canvas.height - sourceY
    );

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;

    const ctx = pageCanvas.getContext("2d");

    if (!ctx) {
      throw new Error("Unable to prepare invoice PDF.");
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, sliceHeight);

    ctx.drawImage(
      canvas,
      0,
      sourceY,
      canvas.width,
      sliceHeight,
      0,
      0,
      canvas.width,
      sliceHeight
    );

    if (pageIndex > 0) {
      pdf.addPage();
    }

    const imageHeight =
      (sliceHeight * printableWidth) / canvas.width;

    pdf.addImage(
      pageCanvas.toDataURL("image/png"),
      "PNG",
      margin,
      margin,
      printableWidth,
      imageHeight,
      undefined,
      "FAST"
    );

    sourceY += sliceHeight;
    pageIndex += 1;
  }

  const blob = pdf.output("blob");
  const filename = `${getInvoiceNumber(invoice)}.pdf`;

  return {
    blob,
    filename,
  };
};

/**
 * Save the generated PDF to the device.
 */
const savePDFBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 60000);
};

/**
 * Download the invoice with its actual React design.
 */
export const downloadDesignedInvoicePDF = async (
  element,
  invoice
) => {
  const { blob, filename } =
    await generateInvoiceDesignPDF(element, invoice);

  savePDFBlob(blob, filename);
};

/**
 * Share the same designed invoice PDF.
 */
export const shareDesignedInvoicePDF = async (
  element,
  invoice
) => {
  const { blob, filename } =
    await generateInvoiceDesignPDF(element, invoice);

  const file = new File([blob], filename, {
    type: "application/pdf",
  });

  if (
    navigator.share &&
    navigator.canShare?.({ files: [file] })
  ) {
    try {
      await navigator.share({
        files: [file],
        title: `Thomson Casa ${filename}`,
        text: `Invoice ${getInvoiceNumber(invoice)}`,
      });

      return "shared";
    } catch (error) {
      if (error.name === "AbortError") {
        return "cancelled";
      }

      console.warn("Native share unavailable:", error);
    }
  }

  // Fallback for unsupported desktop browsers
  savePDFBlob(blob, filename);

  return "downloaded";
};
