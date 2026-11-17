
import { BASE_URL, api } from "../services/api";

// Get invoice number, not database primary key.
export const getInvoiceNumber = (invoice) => {
  const value = invoice?.invoice_number || invoice?.id;

  if (
    typeof value !== "string" ||
    !/^INV-[A-Za-z0-9-]+$/.test(value)
  ) {
    throw new Error("Valid invoice number not found.");
  }

  return value;
};

// Fetch the actual PDF from Django.
export const fetchInvoicePDF = async (invoice) => {
  const invoiceNumber = getInvoiceNumber(invoice);

  const response = await fetch(
    `${BASE_URL}/accounts/invoices/${encodeURIComponent(
      invoiceNumber
    )}/pdf/`,
    {
      method: "GET",
      headers: {
        ...api.getHeaders(),
      },
    }
  );

  if (!response.ok) {
    let message = `PDF request failed (${response.status})`;

    try {
      const error = await response.json();
      message = error.message || error.detail || message;
    } catch {
      // Keep the HTTP error message.
    }

    throw new Error(message);
  }

  const blob = await response.blob();

  if (
    !blob.size ||
    !blob.type.toLowerCase().includes("pdf")
  ) {
    throw new Error(
      "The server did not return a valid PDF."
    );
  }

  return blob;
};

// Download a PDF blob.
export const saveInvoicePDF = (invoice, blob) => {
  const invoiceNumber = getInvoiceNumber(invoice);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${invoiceNumber}.pdf`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 60000);
};

// Direct PDF download.
export const downloadInvoicePDF = async (invoice) => {
  const blob = await fetchInvoicePDF(invoice);
  saveInvoicePDF(invoice, blob);
};

// Share the actual PDF where native file sharing is supported.
export const shareInvoicePDF = async (invoice) => {
  const invoiceNumber = getInvoiceNumber(invoice);
  const blob = await fetchInvoicePDF(invoice);

  const file = new File(
    [blob],
    `${invoiceNumber}.pdf`,
    { type: "application/pdf" }
  );

  if (
    navigator.share &&
    navigator.canShare?.({ files: [file] })
  ) {
    try {
      await navigator.share({
        files: [file],
        title: `Invoice ${invoiceNumber}`,
        text: `Thomson Casa Invoice ${invoiceNumber}`,
      });

      return "shared";
    } catch (error) {
      if (error.name === "AbortError") {
        return "cancelled";
      }

      console.warn("Native sharing failed:", error);
    }
  }

  // Desktop fallback: download PDF for manual attachment.
  saveInvoicePDF(invoice, blob);
  return "downloaded";
};

// Open WhatsApp with the invoice message.
// WhatsApp Web links cannot attach a private PDF automatically.
export const shareInvoiceWhatsApp = (invoice) => {
  const invoiceNumber = getInvoiceNumber(invoice);

  const message =
    `Thomson Casa\n` +
    `Invoice: ${invoiceNumber}\n` +
    `Customer: ${invoice.customer || ""}\n` +
    `Total: Rs. ${Number(
      invoice.total || invoice.total_amount || 0
    ).toFixed(2)}\n\n` +
    `Please find the invoice PDF attached separately.`;

  window.open(
    `https://wa.me/?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  );
};
