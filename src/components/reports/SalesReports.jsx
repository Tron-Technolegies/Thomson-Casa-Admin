
import React, { useEffect, useMemo, useState } from "react";

import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiShoppingCart,
  FiAlertCircle,
  FiDownload,
} from "react-icons/fi";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { api } from "../../services/api";
import { exportTableToPDF } from "../../utils/pdfGenerator";
import SortDropdown from "../common/SortDropdown";

import {
  sortRecords,
  getAvailableSortFields,
  parseSortDate,
} from "../../utils/sortUtils";

// ======================================================
// HELPERS
// ======================================================

const number = (value) => {
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
};

const money = (value, digits = 2) =>
  number(value).toLocaleString("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const emptyTotals = () => ({
  quantity: 0,
  total_amount: 0,
  paid_amount: 0,
  balance_amount: 0,
});

const addTotals = (a, b) => ({
  quantity:
    number(a?.quantity) + number(b?.quantity),
  total_amount:
    number(a?.total_amount) + number(b?.total_amount),
  paid_amount:
    number(a?.paid_amount) + number(b?.paid_amount),
  balance_amount:
    number(a?.balance_amount) + number(b?.balance_amount),
});

const sumCustomers = (customers = []) =>
  customers.reduce(
    (total, customer) => addTotals(total, customer),
    emptyTotals()
  );

const todayString = () => {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
};

const SORT_CONFIG = {
  nameKeys: ["customer_name", "customer_code"],
  dateKeys: ["report_sort_date"],
  amountKeys: ["total_amount"],
  idKeys: ["customer_code"],
};

const prepareCustomers = (customers = []) =>
  customers.map((customer) => {
    const dates = [
      customer.last_invoice_date,
      customer.invoice_date,
      ...(customer.items || []).flatMap((item) => [
        item.invoice_date,
        item.created_at,
        item.date,
      ]),
    ];

    const validDates = dates
      .map(parseSortDate)
      .filter((date) => date !== null);

    const latestDate = validDates.length
      ? Math.max(...validDates)
      : null;

    return {
      ...customer,
      report_sort_date:
        latestDate === null
          ? null
          : new Date(latestDate).toISOString(),
    };
  });

// ======================================================
// COMBINE LIVE AND MEAT PURCHASES CUSTOMER-WISE
// ======================================================

const buildCombinedCustomers = (
  liveCustomers = [],
  meatCustomers = []
) => {
  const customerMap = new Map();

  const addGroups = (groups, type) => {
    groups.forEach((group) => {
      const key = String(
        group.customer_code ?? group.customer_name
      );

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          customer_code: group.customer_code,
          customer_name: group.customer_name,
          report_sort_date: null,
          live: null,
          meat: null,
        });
      }

      const customer = customerMap.get(key);
      customer[type] = group;

      const incoming = parseSortDate(
        group.report_sort_date
      );

      const existing = parseSortDate(
        customer.report_sort_date
      );

      if (
        incoming !== null &&
        (existing === null || incoming > existing)
      ) {
        customer.report_sort_date =
          group.report_sort_date;
      }
    });
  };

  addGroups(liveCustomers, "live");
  addGroups(meatCustomers, "meat");

  return [...customerMap.values()].map((customer) => ({
    ...customer,
    ...addTotals(customer.live, customer.meat),
  }));
};

// ======================================================
// TOTAL ROW — SEVEN COLUMNS
// ======================================================

function TotalRow({
  label,
  totals,
  highlight = false,
  firstColumn = false,
}) {
  return (
    <tr
      className={`border-t font-bold ${
        highlight
          ? "bg-[#DCEBFF] text-[#1E3A8A]"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {firstColumn ? (
        <>
          <td colSpan={2} className="px-3 py-3">
            {label}
          </td>
        </>
      ) : (
        <>
          <td className="px-3 py-3" />
          <td className="px-3 py-3">
            {label}
          </td>
        </>
      )}

      <td className="px-3 py-3 text-right">
        {money(totals?.quantity, 3)}
      </td>

      <td className="px-3 py-3" />

      <td className="px-3 py-3 text-right">
        ₹{money(totals?.total_amount)}
      </td>

      <td className="px-3 py-3 text-right">
        ₹{money(totals?.paid_amount)}
      </td>

      <td className="px-3 py-3 text-right">
        ₹{money(totals?.balance_amount)}
      </td>
    </tr>
  );
}

// ======================================================
// COMBINED REPORT
// ONE CUSTOMER -> LIVE ITEMS -> MEAT ITEMS ->
// LIVE TOTAL -> MEAT TOTAL -> CUSTOMER TOTAL
// ======================================================

function CombinedReportTable({
  customers = [],
  liveTotals,
  meatTotals,
  grandTotals,
}) {
  const headers = [
    "Customer Code & Name",
    "Meat Category",
    "Qty (kg)",
    "Rate (Rs/kg)",
    "Amount (Rs)",
    "Paid (Rs)",
    "Balance (Rs)",
  ];

  return (
    <section className="mb-8">
      <h3 className="mb-4 text-lg font-bold text-gray-900">
        Combined Customer Purchase Report
      </h3>

      <p className="mb-4 text-xs text-gray-500">
        Customer-wise Live Rate and Meat Rate purchases
        with category details and separate totals.
      </p>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={header}
                  className={`px-3 py-4 font-bold text-gray-700 ${
                    index >= 2 ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-gray-500"
                >
                  No purchases found.
                </td>
              </tr>
            ) : (
              customers.map((customer, index) => {
                const live = customer.live;
                const meat = customer.meat;

                const purchaseRows = [
                  ...(live?.items || []).map((item) => ({
                    ...item,
                    rateType: "Live",
                  })),
                  ...(meat?.items || []).map((item) => ({
                    ...item,
                    rateType: "Meat",
                  })),
                ];

                return (
                  <React.Fragment
                    key={`${customer.customer_code}-${index}`}
                  >
                    {/* Customer name once */}
                    <tr className="bg-gray-100 border-t-2 border-gray-300">
                      <td
                        colSpan={7}
                        className="px-3 py-3 font-bold text-gray-900"
                      >
                        {customer.customer_code} -{" "}
                        {customer.customer_name}
                      </td>
                    </tr>

                    {/* Live and Meat item details */}
                    {purchaseRows.map((item, itemIndex) => (
                      <tr
                        key={`${item.rateType}-${itemIndex}`}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-3 py-3" />

                        <td className="px-3 py-3">
                          <span
                            className={
                              item.rateType === "Live"
                                ? "font-semibold text-green-700"
                                : "font-semibold text-purple-700"
                            }
                          >
                            {item.rateType}
                          </span>
                          {" - "}
                          {item.item_name || "—"}
                        </td>

                        <td className="px-3 py-3 text-right">
                          {money(item.quantity, 3)}
                        </td>

                        <td className="px-3 py-3 text-right">
                          {money(item.rate)}
                        </td>

                        <td className="px-3 py-3 text-right">
                          {money(item.amount)}
                        </td>

                        <td className="px-3 py-3" />
                        <td className="px-3 py-3" />
                      </tr>
                    ))}

                    {live && (
                      <TotalRow
                        label="Live Rate Total"
                        totals={live}
                      />
                    )}

                    {meat && (
                      <TotalRow
                        label="Meat Rate Total"
                        totals={meat}
                      />
                    )}

                    <TotalRow
                      label={`${customer.customer_name} Grand Total`}
                      totals={customer}
                      highlight
                    />
                  </React.Fragment>
                );
              })
            )}
          </tbody>

          <tfoot className="border-t-2 border-gray-400">
            <TotalRow
              label="OVERALL LIVE TOTAL"
              totals={liveTotals}
              firstColumn
            />

            <TotalRow
              label="OVERALL MEAT TOTAL"
              totals={meatTotals}
              firstColumn
            />

            <TotalRow
              label="OVERALL GRAND TOTAL"
              totals={grandTotals}
              highlight
              firstColumn
            />
          </tfoot>
        </table>
      </div>
    </section>
  );
}

// ======================================================
// SEPARATE LIVE / MEAT REPORT
// IMPORTANT: THIS COMPONENT WAS MISSING
// ======================================================

function SeparatePurchaseTable({
  title,
  sectionKey,
  customers = [],
  totals,
}) {
  const headers = [
    "Customer Code & Name",
    "Meat Category",
    "Qty (kg)",
    "Rate (Rs/kg)",
    "Amount (Rs)",
    "Paid (Rs)",
    "Balance (Rs)",
  ];

  return (
    <section className="mb-8">
      <h3 className="mb-4 text-lg font-bold text-gray-900">
        {title}
      </h3>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={header}
                  className={`px-3 py-4 font-bold text-gray-700 ${
                    index >= 2 ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  No purchases found.
                </td>
              </tr>
            ) : (
              customers.map((customer, customerIndex) => {
                const items =
                  customer.items?.length > 0
                    ? customer.items
                    : [null];

                return (
                  <React.Fragment
                    key={`${sectionKey}-${customer.customer_code}-${customerIndex}`}
                  >
                    {items.map((item, itemIndex) => (
                      <tr
                        key={`${customerIndex}-${itemIndex}`}
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        {itemIndex === 0 && (
                          <td
                            rowSpan={items.length}
                            className="px-3 py-4 align-top font-semibold text-gray-900"
                          >
                            {customer.customer_code}
                            <span className="block">
                              {customer.customer_name}
                            </span>
                          </td>
                        )}

                        <td className="px-3 py-4">
                          {item?.item_name || "—"}
                        </td>

                        <td className="px-3 py-4 text-right">
                          {item
                            ? money(item.quantity, 3)
                            : "—"}
                        </td>

                        <td className="px-3 py-4 text-right">
                          {item ? money(item.rate) : "—"}
                        </td>

                        <td className="px-3 py-4 text-right">
                          {item
                            ? money(item.amount)
                            : money(customer.total_amount)}
                        </td>

                        {itemIndex === 0 && (
                          <>
                            <td
                              rowSpan={items.length}
                              className="px-3 py-4 align-top text-right font-semibold"
                            >
                              {money(customer.paid_amount)}
                            </td>

                            <td
                              rowSpan={items.length}
                              className="px-3 py-4 align-top text-right font-semibold"
                            >
                              {money(customer.balance_amount)}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}

                    <TotalRow
                      label={`Shop Total (${customer.customer_code} - ${customer.customer_name})`}
                      totals={customer}
                      highlight
                      firstColumn
                    />
                  </React.Fragment>
                );
              })
            )}
          </tbody>

          <tfoot>
            <TotalRow
              label="SECTION TOTAL"
              totals={totals || emptyTotals()}
              firstColumn
            />
          </tfoot>
        </table>
      </div>
    </section>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function SalesReports({
  period = "Daily",
}) {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportError, setReportError] = useState("");

  const [livePurchases, setLivePurchases] = useState([]);
  const [meatPurchases, setMeatPurchases] = useState([]);
  const [reportSummary, setReportSummary] = useState(null);

  const [selectedDate] = useState(todayString);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [sortBy, setSortBy] = useState("az");

  // Default view: Combined
  const [reportView, setReportView] = useState("combined");

  const isCompleteRange = Boolean(fromDate && toDate);

  const isIncompleteRange = Boolean(
    (fromDate && !toDate) ||
    (!fromDate && toDate)
  );

  const isInvalidRange = Boolean(
    isCompleteRange && fromDate > toDate
  );

  const reportDateLabel = isCompleteRange
    ? `${fromDate}_to_${toDate}`
    : selectedDate;

  // ====================================================
  // FETCH DATA
  // ====================================================

  useEffect(() => {
    let active = true;

    const fetchReport = async () => {
      if (isIncompleteRange || isInvalidRange) {
        setLoading(false);

        setReportError(
          isInvalidRange
            ? "From Date cannot be after To Date."
            : "Select both From Date and To Date."
        );

        return;
      }

      setLoading(true);
      setReportError("");

      const query = new URLSearchParams(
        isCompleteRange
          ? {
              from_date: fromDate,
              to_date: toDate,
              period,
            }
          : {
              date: selectedDate,
              period,
            }
      );

      try {
        const [statsRes, chartRes, salesRes] =
          await Promise.allSettled([
            api.get(
              `/admin/dashboard/stats/?period=${period}`,
              false
            ),
            api.get(
              `/admin/dashboard/charts/?period=${period}`,
              false
            ),
            api.get(
              `/accounts/reports/sales/?${query.toString()}`,
              false
            ),
          ]);

        if (!active) return;

        if (
          statsRes.status === "fulfilled" &&
          statsRes.value?.success
        ) {
          setStats({
            revenue: number(statsRes.value.revenue),
            orders: number(statsRes.value.orders),
          });
        }

        if (
          chartRes.status === "fulfilled" &&
          chartRes.value?.success
        ) {
          setChartData(
            chartRes.value.chartData ||
            chartRes.value.revenue_trend ||
            []
          );
        }

        if (salesRes.status === "rejected") {
          throw salesRes.reason;
        }

        const response = salesRes.value;

        if (!response?.success) {
          throw new Error(
            response?.message ||
            "Failed to load sales report."
          );
        }

        if (
          !Array.isArray(response.live_rate_purchases) ||
          !Array.isArray(response.meat_rate_purchases)
        ) {
          throw new Error(
            "Live Rate and Meat Rate data missing from API."
          );
        }

        setLivePurchases(
          response.live_rate_purchases
        );

        setMeatPurchases(
          response.meat_rate_purchases
        );

        setReportSummary(response.summary || null);
      } catch (error) {
        if (!active) return;

        console.error("Sales Report Error:", error);

        setReportError(
          error?.message || "Unable to load report."
        );

        setLivePurchases([]);
        setMeatPurchases([]);
        setReportSummary(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchReport();

    return () => {
      active = false;
    };
  }, [
    period,
    selectedDate,
    fromDate,
    toDate,
    isCompleteRange,
    isIncompleteRange,
    isInvalidRange,
  ]);

  // ====================================================
  // SORTING
  // ====================================================

  const preparedLive = useMemo(
    () => prepareCustomers(livePurchases),
    [livePurchases]
  );

  const preparedMeat = useMemo(
    () => prepareCustomers(meatPurchases),
    [meatPurchases]
  );

  const availableSort = getAvailableSortFields(
    [...preparedLive, ...preparedMeat],
    SORT_CONFIG
  );

  const sortedLive = useMemo(
    () =>
      sortRecords(preparedLive, sortBy, SORT_CONFIG),
    [preparedLive, sortBy]
  );

  const sortedMeat = useMemo(
    () =>
      sortRecords(preparedMeat, sortBy, SORT_CONFIG),
    [preparedMeat, sortBy]
  );

  const combinedCustomers = useMemo(() => {
    const combined = buildCombinedCustomers(
      preparedLive,
      preparedMeat
    );

    return sortRecords(combined, sortBy, SORT_CONFIG);
  }, [preparedLive, preparedMeat, sortBy]);

  // ====================================================
  // TOTALS
  // ====================================================

  const liveTotals =
    reportSummary?.live_rate ||
    sumCustomers(sortedLive);

  const meatTotals =
    reportSummary?.meat_rate ||
    sumCustomers(sortedMeat);

  const grandTotals = addTotals(
    liveTotals,
    meatTotals
  );

  const showLive =
    reportView === "both" ||
    reportView === "live_rate";

  const showMeat =
    reportView === "both" ||
    reportView === "meat_rate";

  // ====================================================
  // EXPORT HEADERS
  // ====================================================

  const reportHeaders = [
    "Customer Code & Name",
    "Meat Category",
    "Qty (kg)",
    "Rate (Rs/kg)",
    "Amount (Rs)",
    "Paid (Rs)",
    "Balance (Rs)",
  ];

  // ====================================================
  // EXPORT ROWS
  // ====================================================

  const getExportRows = () => {
    const rows = [];

    if (reportView === "combined") {
      const addTotal = (label, totals) => {
        rows.push([
          "",
          label,
          money(totals?.quantity, 3),
          "",
          money(totals?.total_amount),
          money(totals?.paid_amount),
          money(totals?.balance_amount),
        ]);
      };

      combinedCustomers.forEach((customer) => {
        const customerName =
          `${customer.customer_code} - ${customer.customer_name}`;

        rows.push([
          customerName, "", "", "", "", "", "",
        ]);

        const purchases = [
          ...(customer.live?.items || []).map((item) => ({
            ...item,
            rateType: "Live",
          })),
          ...(customer.meat?.items || []).map((item) => ({
            ...item,
            rateType: "Meat",
          })),
        ];

        purchases.forEach((item) => {
          rows.push([
            "",
            `${item.rateType} - ${item.item_name || ""}`,
            money(item.quantity, 3),
            money(item.rate),
            money(item.amount),
            "",
            "",
          ]);
        });

        if (customer.live) {
          addTotal("Live Rate Total", customer.live);
        }

        if (customer.meat) {
          addTotal("Meat Rate Total", customer.meat);
        }

        addTotal(
          `${customer.customer_name} Grand Total`,
          customer
        );
      });

      addTotal("OVERALL LIVE TOTAL", liveTotals);
      addTotal("OVERALL MEAT TOTAL", meatTotals);
      addTotal("OVERALL GRAND TOTAL", grandTotals);

      return rows;
    }

    const sections = [];

    if (showLive) {
      sections.push({
        title: "LIVE RATE PURCHASES",
        customers: sortedLive,
        totals: liveTotals,
      });
    }

    if (showMeat) {
      sections.push({
        title: "MEAT RATE PURCHASES",
        customers: sortedMeat,
        totals: meatTotals,
      });
    }

    sections.forEach((section) => {
      rows.push([
        section.title, "", "", "", "", "", "",
      ]);

      section.customers.forEach((customer) => {
        const name =
          `${customer.customer_code} - ${customer.customer_name}`;

        const items = customer.items || [];

        items.forEach((item, index) => {
          rows.push([
            index === 0 ? name : "",
            item.item_name || "",
            money(item.quantity, 3),
            money(item.rate),
            money(item.amount),
            index === 0
              ? money(customer.paid_amount)
              : "",
            index === 0
              ? money(customer.balance_amount)
              : "",
          ]);
        });

        if (!items.length) {
          rows.push([
            name,
            "",
            "",
            "",
            money(customer.total_amount),
            money(customer.paid_amount),
            money(customer.balance_amount),
          ]);
        }

        rows.push([
          `Shop Total (${name})`,
          "",
          money(customer.quantity, 3),
          "",
          money(customer.total_amount),
          money(customer.paid_amount),
          money(customer.balance_amount),
        ]);
      });

      rows.push([
        "SECTION TOTAL",
        "",
        money(section.totals.quantity, 3),
        "",
        money(section.totals.total_amount),
        money(section.totals.paid_amount),
        money(section.totals.balance_amount),
      ]);

      rows.push(["", "", "", "", "", "", ""]);
    });

    if (reportView === "both") {
      rows.push([
        "GRAND TOTAL",
        "",
        money(grandTotals.quantity, 3),
        "",
        money(grandTotals.total_amount),
        money(grandTotals.paid_amount),
        money(grandTotals.balance_amount),
      ]);
    }

    return rows;
  };

  // ====================================================
  // EXPORT PDF AND CSV
  // ====================================================

  const viewLabel = {
    combined: "Combined",
    both: "Separate",
    live_rate: "Live_Rate",
    meat_rate: "Meat_Rate",
  }[reportView];

  const handleDownloadPDF = () => {
    if (loading || reportError) return;

    exportTableToPDF(
      `${period} ${viewLabel} Sales Report - ${reportDateLabel}`,
      reportHeaders,
      getExportRows(),
      `Sales_Report_${viewLabel}_${reportDateLabel}.pdf`
    );
  };

  const handleDownloadCSV = () => {
    if (loading || reportError) return;

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = [
      reportHeaders,
      ...getExportRows(),
    ];

    const csv = rows
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(
      ["\uFEFF", csv],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
      `Sales_Report_${viewLabel}_${reportDateLabel}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  // ====================================================
  // DASHBOARD CARDS
  // ====================================================

  const statsCards = [
    {
      title: "TOTAL REVENUE",
      value: `₹${money(stats.revenue)}`,
      description: "Total revenue",
      icon: <FiDollarSign size={20} />,
      color: "bg-blue-100 text-blue-600",
      trend: <FiTrendingUp />,
    },
    {
      title: "TOTAL ORDERS",
      value: stats.orders,
      description: "Total orders",
      icon: <FiShoppingCart size={20} />,
      color: "bg-green-100 text-green-600",
      trend: <FiTrendingUp />,
    },
    {
      title: "TOTAL RETURNS",
      value: 0,
      description: "No returns",
      icon: <FiAlertCircle size={20} />,
      color: "bg-red-100 text-red-500",
      trend: <FiTrendingDown />,
    },
    {
      title: "AVG ORDER VALUE",
      value:
        stats.orders > 0
          ? `₹${money(stats.revenue / stats.orders)}`
          : "₹0.00",
      description: "Per order",
      icon: <FiTrendingUp size={20} />,
      color: "bg-purple-100 text-purple-600",
      trend: <FiTrendingUp />,
    },
  ];

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="w-full min-w-0">

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {statsCards.map((card) => (
          <div
            key={card.title}
            className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm"
          >
            <div className="flex justify-between items-start gap-3 mb-5">
              <span className="text-xs font-bold text-gray-400">
                {card.title}
              </span>

              <span className={`${card.color} p-2 rounded-lg`}>
                {card.icon}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              {card.value}
            </h3>

            <div className="flex items-center gap-1 text-xs text-green-600 mt-3">
              {card.trend}
              {card.description}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-5">
          Revenue Overview
        </h2>

        <div className="w-full h-64 sm:h-72 min-w-0">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              Loading chart...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                />

                <YAxis
                  tick={{ fontSize: 11 }}
                  width={55}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4B5EAA"
                  strokeWidth={2}
                  fill="#4B5EAA"
                  fillOpacity={0.12}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Customer Purchase Report */}
      <div className="bg-white border border-[#00000026] rounded-xl shadow-sm p-4 sm:p-6 mb-6">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Customer Purchase Report
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {period} report for {reportDateLabel}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">

            {/* Date range */}
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                From Date
              </label>

              <input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                To Date
              </label>

              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
              className="border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Clear
            </button>

            {/* Report view filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Report View
              </label>

              <select
                value={reportView}
                onChange={(e) =>
                  setReportView(e.target.value)
                }
                className="w-full bg-white border border-gray-300 px-3 py-2 rounded-lg text-sm"
              >
                <option value="combined">
                  Combined Report
                </option>

                <option value="both">
                  Separate Live + Meat
                </option>

                <option value="live_rate">
                  Live Rate Only
                </option>

                <option value="meat_rate">
                  Meat Rate Only
                </option>
              </select>
            </div>

            {/* Sorting */}
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              allowDate={availableSort.allowDate}
              allowAmount={availableSort.allowAmount}
            />

            {/* CSV */}
            <button
              type="button"
              onClick={handleDownloadCSV}
              disabled={loading || !!reportError}
              className="flex items-center justify-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-200 disabled:opacity-50"
            >
              <FiDownload />
              Excel (CSV)
            </button>

            {/* PDF */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={loading || !!reportError}
              className="flex items-center justify-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 disabled:opacity-50"
            >
              <FiDownload />
              PDF
            </button>
          </div>
        </div>

        {/* Report content */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading purchase details...
          </div>
        ) : reportError ? (
          <div
            role="alert"
            className="text-center py-10 text-red-600"
          >
            {reportError}
          </div>
        ) : (
          <>
            {reportView === "combined" && (
              <CombinedReportTable
                customers={combinedCustomers}
                liveTotals={liveTotals}
                meatTotals={meatTotals}
                grandTotals={grandTotals}
              />
            )}

            {showLive && (
              <SeparatePurchaseTable
                title="Live Rate Purchases"
                sectionKey="live_rate"
                customers={sortedLive}
                totals={liveTotals}
              />
            )}

            {showMeat && (
              <SeparatePurchaseTable
                title="Meat Rate Purchases"
                sectionKey="meat_rate"
                customers={sortedMeat}
                totals={meatTotals}
              />
            )}

            {reportView === "both" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-bold text-blue-900 mb-3">
                  GRAND TOTAL — LIVE + MEAT
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Quantity",
                      value: `${money(grandTotals.quantity, 3)} kg`,
                    },
                    {
                      label: "Amount",
                      value: `₹${money(grandTotals.total_amount)}`,
                    },
                    {
                      label: "Paid",
                      value: `₹${money(grandTotals.paid_amount)}`,
                    },
                    {
                      label: "Balance",
                      value: `₹${money(grandTotals.balance_amount)}`,
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-gray-500">
                        {item.label}
                      </p>

                      <p className="font-bold text-blue-900 mt-1">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-4 text-xs text-gray-500">
              Totals use the current invoice report data.
              Live Rate and Meat Rate are calculated separately,
              then combined for customer and overall totals.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
