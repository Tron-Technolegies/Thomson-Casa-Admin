
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "az", label: "A–Z" },
  { value: "za", label: "Z–A" },
  { value: "high", label: "Amount: High to Low" },
  { value: "low", label: "Amount: Low to High" },
];

const getField = (row, keys = []) => {
  for (const key of keys) {
    const value = row?.[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      return value;
    }
  }

  return null;
};

const toAmount = (value) => {
  const amount = Number(
    String(value ?? 0).replace(/[₹,\s]/g, "")
  );

  return Number.isFinite(amount) ? amount : 0;
};

const toTimestamp = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isFinite(time) ? time : null;
  }

  const text = String(value).trim();

  // YYYY-MM-DD or ISO datetime
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    const time = Date.parse(text);
    return Number.isFinite(time) ? time : null;
  }

  // DD MMM YYYY, e.g. 16 Nov 2026
  const match = text.match(
    /^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/
  );

  if (match) {
    const months = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec",
    ];

    const month = months.indexOf(
      match[2].slice(0, 3).toLowerCase()
    );

    if (month !== -1) {
      const date = new Date(
        Number(match[3]),
        month,
        Number(match[1])
      );

      if (
        date.getFullYear() === Number(match[3]) &&
        date.getMonth() === month &&
        date.getDate() === Number(match[1])
      ) {
        return date.getTime();
      }
    }
  }

  // DD/MM/YYYY or DD-MM-YYYY
  const numeric = text.match(
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
  );

  if (numeric) {
    const date = new Date(
      Number(numeric[3]),
      Number(numeric[2]) - 1,
      Number(numeric[1])
    );

    if (
      date.getFullYear() === Number(numeric[3]) &&
      date.getMonth() === Number(numeric[2]) - 1 &&
      date.getDate() === Number(numeric[1])
    ) {
      return date.getTime();
    }
  }

  return null;
};

export const sortRecords = (
  records = [],
  sortBy = "newest",
  config = {}
) => {
  const {
    nameKeys = ["customer", "customer_name", "name"],
    dateKeys = [
      "created_at",
      "created_date",
      "order_date",
      "date",
      "delivery_date",
      "due_date",
    ],
    amountKeys = [
      "total_outstanding",
      "balance",
      "total_amount",
      "amount",
      "total",
    ],
    idKeys = ["id", "invoice_id", "order_id"],
  } = config;

  const result = [...records];

  const compareText = (a, b) =>
    String(a ?? "").localeCompare(
      String(b ?? ""),
      "en",
      { sensitivity: "base", numeric: true }
    );

  const compareDate = (a, b) => {
    const dateA = toTimestamp(getField(a, dateKeys));
    const dateB = toTimestamp(getField(b, dateKeys));

    if (dateA !== null && dateB !== null) {
      return dateA - dateB;
    }

    if (dateA !== null) return 1;
    if (dateB !== null) return -1;

    return compareText(
      getField(a, idKeys),
      getField(b, idKeys)
    );
  };

  result.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return -compareDate(a, b);

      case "oldest":
        return compareDate(a, b);

      case "az":
        return compareText(
          getField(a, nameKeys),
          getField(b, nameKeys)
        );

      case "za":
        return compareText(
          getField(b, nameKeys),
          getField(a, nameKeys)
        );

      case "high":
        return (
          toAmount(getField(b, amountKeys)) -
          toAmount(getField(a, amountKeys))
        );

      case "low":
        return (
          toAmount(getField(a, amountKeys)) -
          toAmount(getField(b, amountKeys))
        );

      default:
        return 0;
    }
  });

  return result;
};



export const getAvailableSortFields = (
  items = [],
  config = {}
) => {
  const dateKeys = config.dateKeys || [
    "created_at",
    "date",
    "order_date",
    "delivery_date",
    "due_date",
  ];

  const amountKeys = config.amountKeys || [
    "total_amount",
    "total",
    "amount",
    "balance",
  ];

  const getValue = (row, keys) => {
    for (const key of keys) {
      const value = key
        .split(".")
        .reduce((obj, part) => obj?.[part], row);

      if (
        value !== null &&
        value !== undefined &&
        value !== ""
      ) {
        return value;
      }
    }

    return null;
  };

  const hasDate = items.some((item) => {
    const value = getValue(item, dateKeys);

    if (!value) return false;

    const parsed = Date.parse(String(value));

    return !Number.isNaN(parsed);
  });

  const hasAmount = items.some((item) => {
    const value = getValue(item, amountKeys);

    if (
      value === null ||
      value === undefined
    ) {
      return false;
    }

    const amount = Number(
      String(value).replace(/[₹,\s]/g, "")
    );

    return Number.isFinite(amount);
  });

  return {
    allowDate: hasDate,
    allowAmount: hasAmount,
  };
};

export const parseSortDate = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isFinite(time) ? time : null;
  }

  const text = String(value).trim();

  // YYYY-MM-DD or ISO datetime
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    const time = Date.parse(text);
    return Number.isFinite(time) ? time : null;
  }

  // DD MMM YYYY — example: 16 Nov 2026
  const match = text.match(
    /^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/
  );

  if (match) {
    const months = [
      "jan", "feb", "mar", "apr",
      "may", "jun", "jul", "aug",
      "sep", "oct", "nov", "dec",
    ];

    const month = months.indexOf(
      match[2].slice(0, 3).toLowerCase()
    );

    if (month !== -1) {
      const date = new Date(
        Number(match[3]),
        month,
        Number(match[1])
      );

      if (
        date.getFullYear() === Number(match[3]) &&
        date.getMonth() === month &&
        date.getDate() === Number(match[1])
      ) {
        return date.getTime();
      }
    }
  }

  // DD/MM/YYYY or DD-MM-YYYY
  const numeric = text.match(
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
  );

  if (numeric) {
    const date = new Date(
      Number(numeric[3]),
      Number(numeric[2]) - 1,
      Number(numeric[1])
    );

    if (
      date.getFullYear() === Number(numeric[3]) &&
      date.getMonth() === Number(numeric[2]) - 1 &&
      date.getDate() === Number(numeric[1])
    ) {
      return date.getTime();
    }
  }

  return null;
};
