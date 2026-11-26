
import React, { useState, useEffect, useMemo } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiShoppingCart,
  FiAlertCircle,
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

const money = (value, digits = 2) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const emptyTotals = () => ({
  quantity: 0,
  total_amount: 0,
  paid_amount: 0,
  balance_amount: 0,
});

const sumCustomers = (customers = []) =>
  customers.reduce(
    (total, customer) => ({
      quantity:
        total.quantity + Number(customer.quantity || 0),
      total_amount:
        total.total_amount +
        Number(customer.total_amount || 0),
      paid_amount:
        total.paid_amount +
        Number(customer.paid_amount || 0),
      balance_amount:
        total.balance_amount +
        Number(customer.balance_amount || 0),
    }),
    emptyTotals()
  );

const addTotals = (a, b) => ({
  quantity:
    Number(a.quantity || 0) + Number(b.quantity || 0),
  total_amount:
    Number(a.total_amount || 0) +
    Number(b.total_amount || 0),
  paid_amount:
    Number(a.paid_amount || 0) +
    Number(b.paid_amount || 0),
  balance_amount:
    Number(a.balance_amount || 0) +
    Number(b.balance_amount || 0),
});

const REPORT_HEADERS = [
  "Customer Code & Name",
  "Meat Category",
  "Qty (kg)",
  "Rate (Rs/kg)",
  "Amount (Rs)",
  "Paid (Rs)",
  "Balance (Rs)",
];

// Used only to obtain a valid customer-group sort date.
// We never change the actual invoice/payment amounts.
const prepareCustomers = (customers = []) =>
  customers.map((customer) => {
    const candidates = [
      customer.last_invoice_date,
      customer.invoice_date,
      ...(customer.items || []).flatMap((item) => [
        item.invoice_date,
        item.created_at,
        item.date,
      ]),
    ];

    const validDates = candidates
      .map(parseSortDate)
      .filter((value) => value !== null);

    const latestDate = validDates.length
      ? Math.max(...validDates)
      : null;

    return {
      ...customer,
      report_sort_date:
        latestDate !== null
          ? new Date(latestDate).toISOString()
          : null,
    };
  });

const REPORT_SORT_CONFIG = {
  nameKeys: ["customer_name", "customer_code"],
  dateKeys: ["report_sort_date"],
  amountKeys: ["total_amount"],
  idKeys: ["customer_code"],
};

// Same table UI is used for Live Rate and Meat Rate.
function PurchaseSection({ section, totals }) {
  return (
    <section className="mb-8 last:mb-0">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
        {section.title}
      </h3>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full min-w-[950px] text-left text-sm text-gray-700">

          <thead className="bg-gray-50">
            <tr className="border-b border-gray-300">
              {REPORT_HEADERS.map((header, index) => (
                <th
                  key={header}
                  className={`py-3 px-3 ${
                    index >= 2 ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {section.customers.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-5 text-center text-gray-500"
                >
                  No purchases in this section for the
                  selected period.
                </td>
              </tr>
            )}

            {section.customers.map(
              (customer, customerIndex) => {
                const items = customer.items?.length
                  ? customer.items
                  : [null];

                const customerKey =
                  `${section.key}-${customer.customer_code}-${customerIndex}`;

                return (
                  <React.Fragment key={customerKey}>

                    {/* Individual item rows */}
                    {items.map((item, index) => (
                      <tr
                        key={`${customerKey}-item-${index}`}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        {index === 0 && (
                          <td
                            rowSpan={items.length}
                            className="px-3 py-3 align-top font-semibold text-gray-900"
                          >
                            {customer.customer_code}
                            <span className="block">
                              {customer.customer_name}
                            </span>
                          </td>
                        )}

                        <td className="px-3 py-3">
                          {item?.item_name || "—"}
                        </td>

                        <td className="px-3 py-3 text-right">
                          {item
                            ? money(item.quantity, 3)
                            : "—"}
                        </td>

                        <td className="px-3 py-3 text-right">
                          {item
                            ? money(item.rate)
                            : "—"}
                        </td>

                        <td className="px-3 py-3 text-right">
                          {item
                            ? money(item.amount)
                            : money(customer.total_amount)}
                        </td>

                        {index === 0 && (
                          <>
                            <td
                              rowSpan={items.length}
                              className="px-3 py-3 align-top text-right font-semibold"
                            >
                              {money(customer.paid_amount)}
                            </td>

                            <td
                              rowSpan={items.length}
                              className="px-3 py-3 align-top text-right font-semibold"
                            >
                              {money(customer.balance_amount)}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}

                    {/* Shop total stays below its customer */}
                    <tr className="bg-[#DCEBFF] text-[#1E3A8A] font-bold border-y border-blue-200">

                      <td
                        colSpan={2}
                        className="px-3 py-3"
                      >
                        Shop Total (
                        {customer.customer_code} -{" "}
                        {customer.customer_name})
                      </td>

                      <td className="px-3 py-3 text-right">
                        {money(customer.quantity, 3)}
                      </td>

                      <td className="px-3 py-3" />

                      <td className="px-3 py-3 text-right">
                        ₹{money(customer.total_amount)}
                      </td>

                      <td className="px-3 py-3 text-right">
                        ₹{money(customer.paid_amount)}
                      </td>

                      <td className="px-3 py-3 text-right">
                        ₹{money(customer.balance_amount)}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              }
            )}
          </tbody>

          {/* Section Total — never sorted into customer rows */}
          <tfoot className="bg-gray-100 font-bold text-gray-900">
            <tr className="border-t-2 border-gray-400">
              <td colSpan={2} className="px-3 py-3">
                SECTION TOTAL
              </td>

              <td className="px-3 py-3 text-right">
                {money(totals.quantity, 3)}
              </td>

              <td />

              <td className="px-3 py-3 text-right">
                ₹{money(totals.total_amount)}
              </td>

              <td className="px-3 py-3 text-right">
                ₹{money(totals.paid_amount)}
              </td>

              <td className="px-3 py-3 text-right">
                ₹{money(totals.balance_amount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

export default function SalesReports({
  period = "Daily",
}) {
  // Dashboard data
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Purchase data
  const [livePurchases, setLivePurchases] = useState([]);
  const [meatPurchases, setMeatPurchases] = useState([]);
  const [legacyPurchases, setLegacyPurchases] = useState([]);

  const [reportSummary, setReportSummary] = useState(null);
  const [reportError, setReportError] = useState("");

  // Date filters
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Sorting
  const [sortBy, setSortBy] = useState("az");

  const reportDateLabel =
    fromDate && toDate
      ? `${fromDate}_to_${toDate}`
      : selectedDate;

  // Fetch existing dashboard and sales APIs
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setReportError("");

      try {
        const query = new URLSearchParams(
          fromDate && toDate
            ? {
                from_date: fromDate,
                to_date: toDate,
                period,
              }
            : {
                period,
                date: selectedDate,
              }
        );

        const [
          statsResult,
          chartsResult,
          salesResult,
        ] = await Promise.allSettled([
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

        // Dashboard stats
        if (
          statsResult.status === "fulfilled" &&
          statsResult.value.success
        ) {
          setStats({
            revenue: Number(
              statsResult.value.revenue || 0
            ),
            orders: Number(
              statsResult.value.orders || 0
            ),
          });
        }

        // Revenue chart
        if (
          chartsResult.status === "fulfilled" &&
          chartsResult.value.success
        ) {
          setChartData(
            chartsResult.value.chartData || []
          );
        }

        // Sales report
        if (salesResult.status === "rejected") {
          throw salesResult.reason;
        }

        const salesRes = salesResult.value;

        if (!salesRes.success) {
          throw new Error(
            salesRes.message ||
            "Could not load sales report"
          );
        }

        if (
          !Array.isArray(salesRes.live_rate_purchases) ||
          !Array.isArray(salesRes.meat_rate_purchases)
        ) {
          throw new Error(
            "The backend does not return the required purchase groups. Check the sales report API."
          );
        }

        setLivePurchases(
          salesRes.live_rate_purchases
        );

        setMeatPurchases(
          salesRes.meat_rate_purchases
        );

        setLegacyPurchases(
          salesRes.legacy_purchases || []
        );

        setReportSummary(
          salesRes.summary || null
        );
      } catch (err) {
        if (!active) return;

        console.error(
          "Sales report fetching error:",
          err
        );

        setReportError(
          err?.message ||
          "Could not load sales report"
        );

        setLivePurchases([]);
        setMeatPurchases([]);
        setLegacyPurchases([]);
        setReportSummary(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [period, selectedDate, fromDate, toDate]);

  // Prepare customer groups without changing amounts
  const preparedLive = useMemo(
    () => prepareCustomers(livePurchases),
    [livePurchases]
  );

  const preparedMeat = useMemo(
    () => prepareCustomers(meatPurchases),
    [meatPurchases]
  );

  const availableSort = useMemo(
    () =>
      getAvailableSortFields(
        [...preparedLive, ...preparedMeat],
        REPORT_SORT_CONFIG
      ),
    [preparedLive, preparedMeat]
  );

  // These sorted sections drive BOTH UI and exports
  const sections = useMemo(
    () => [
      {
        key: "live_rate",
        title: "Live Rate Purchases",
        customers: sortRecords(
          preparedLive,
          sortBy,
          REPORT_SORT_CONFIG
        ),
      },
      {
        key: "meat_rate",
        title: "Meat Rate Purchases",
        customers: sortRecords(
          preparedMeat,
          sortBy,
          REPORT_SORT_CONFIG
        ),
      },
    ],
    [preparedLive, preparedMeat, sortBy]
  );

  const sectionTotals = (section) => {
    const fromApi = reportSummary?.[section.key];

    if (fromApi) {
      return fromApi;
    }

    return sumCustomers(section.customers);
  };

  // Grand Total = Live Rate + Meat Rate
  const grandTotals = sections.reduce(
    (total, section) =>
      addTotals(total, sectionTotals(section)),
    emptyTotals()
  );

  // Create rows for both PDF and CSV
  const exportRows = () => {
    const rows = [];

    sections.forEach((section) => {
      // Section title
      rows.push([
        section.title,
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      section.customers.forEach((customer) => {
        const items = customer.items || [];

        // Item rows
        items.forEach((item, index) => {
          rows.push([
            index === 0
              ? `${customer.customer_code} - ${customer.customer_name}`
              : "",
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

        // Customer with no item details
        if (!items.length) {
          rows.push([
            `${customer.customer_code} - ${customer.customer_name}`,
            "",
            "",
            "",
            money(customer.total_amount),
            money(customer.paid_amount),
            money(customer.balance_amount),
          ]);
        }

        // Shop total always follows customer items
        rows.push([
          `Shop Total (${customer.customer_code} - ${customer.customer_name})`,
          "",
          money(customer.quantity, 3),
          "",
          money(customer.total_amount),
          money(customer.paid_amount),
          money(customer.balance_amount),
        ]);
      });

      // Section total never moves
      const total = sectionTotals(section);

      rows.push([
        "SECTION TOTAL",
        "",
        money(total.quantity, 3),
        "",
        money(total.total_amount),
        money(total.paid_amount),
        money(total.balance_amount),
      ]);

      rows.push(["", "", "", "", "", "", ""]);
    });

    // Grand total always remains last
    rows.push([
      "GRAND TOTAL",
      "",
      money(grandTotals.quantity, 3),
      "",
      money(grandTotals.total_amount),
      money(grandTotals.paid_amount),
      money(grandTotals.balance_amount),
    ]);

    return rows;
  };

  // Sorted PDF export
  const handleDownloadPDF = () => {
    if (loading || reportError) return;

    exportTableToPDF(
      `${period} Sales Report - ${reportDateLabel}`,
      REPORT_HEADERS,
      exportRows(),
      `Sales_Report_${period}_${reportDateLabel}.pdf`
    );
  };

  // Sorted Excel-compatible CSV export
  const handleDownloadCSV = () => {
    if (loading || reportError) return;

    const lines = [
      REPORT_HEADERS,
      ...exportRows(),
    ];

    const content = lines
      .map((row) =>
        row
          .map((value) => {
            let text = String(value ?? "");

            // Prevent spreadsheet formula injection
            if (/^[\s]*[=+\-@]/.test(text)) {
              text = "'" + text;
            }

            return `"${text.replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(
      ["\uFEFF", content],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download =
      `Sales_Report_${period}_${reportDateLabel}.csv`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-w-0">

      {/* DASHBOARD STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">

        {/* Total Revenue */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 gap-2">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              TOTAL REVENUE
            </span>

            <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
              <FiDollarSign size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
              ₹{stats.revenue.toLocaleString("en-IN")}
            </h3>

            <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
              <FiTrendingUp />
              Validated
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 gap-2">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              ORDERS
            </span>

            <div className="bg-green-100 p-2 rounded-lg text-green-600 shrink-0">
              <FiShoppingCart size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {stats.orders}
            </h3>

            <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
              <FiTrendingUp />
              Validated
            </div>
          </div>
        </div>

        {/* Returns */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 gap-2">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              RETURNS
            </span>

            <div className="bg-red-100 p-2 rounded-lg text-red-500 shrink-0">
              <FiAlertCircle size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              0
            </h3>

            <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
              <FiTrendingDown />
              No returns
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4 gap-2">
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              AVG ORDER VALUE
            </span>

            <div className="bg-purple-100 p-2 rounded-lg text-purple-600 shrink-0">
              <FiTrendingUp size={20} />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
              ₹
              {stats.orders > 0
                ? (
                    stats.revenue / stats.orders
                  ).toFixed(0)
                : 0}
            </h3>

            <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
              <FiTrendingUp />
              Validated
            </div>
          </div>
        </div>
      </div>

      {/* REVENUE CHART */}
      <div className="bg-white border border-[#00000026] rounded-xl p-4 sm:p-6 shadow-sm mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-5 sm:mb-6">
          Revenue Overview
        </h2>

        <div className="h-64 sm:h-72 w-full min-w-0">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Loading chart...
            </div>
          ) : (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="colorUv2"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#4B5EAA"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="#4B5EAA"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#9CA3AF",
                    fontSize: 11,
                  }}
                  dy={10}
                  interval="preserveStartEnd"
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#9CA3AF",
                    fontSize: 11,
                  }}
                  width={55}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4B5EAA"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUv2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* CUSTOMER PURCHASE REPORT */}
      <div className="bg-white border border-[#00000026] rounded-xl shadow-sm p-4 sm:p-6 mb-6">

        {/* Report Header */}
        <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Customer Purchase Report
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {period} report for {reportDateLabel}
            </p>
          </div>

          {/* Filters, Sorting, Exports */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">

            {/* From Date */}
            <div className="w-full sm:w-auto">
              <label
                htmlFor="sales-from-date"
                className="block text-xs font-semibold text-gray-600 mb-1"
              >
                From Date
              </label>

              <input
                id="sales-from-date"
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) =>
                  setFromDate(e.target.value)
                }
                className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* To Date */}
            <div className="w-full sm:w-auto">
              <label
                htmlFor="sales-to-date"
                className="block text-xs font-semibold text-gray-600 mb-1"
              >
                To Date
              </label>

              <input
                id="sales-to-date"
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) =>
                  setToDate(e.target.value)
                }
                className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* Clear Date Filters */}
            <button
              type="button"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Clear
            </button>

            {/* Common Sorting */}
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              allowDate={availableSort.allowDate}
              allowAmount={availableSort.allowAmount}
              className="w-full sm:w-auto"
            />

            {/* Excel CSV */}
            <button
              type="button"
              onClick={handleDownloadCSV}
              disabled={loading || !!reportError}
              className="w-full sm:w-auto bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-200 disabled:opacity-50"
            >
              Excel (CSV)
            </button>

            {/* PDF */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={loading || !!reportError}
              className="w-full sm:w-auto bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 disabled:opacity-50"
            >
              PDF
            </button>
          </div>
        </div>

        {/* Error / Loading */}
        {loading ? (
          <p className="text-center py-8 text-gray-500">
            Loading purchase details...
          </p>
        ) : reportError ? (
          <p
            role="alert"
            className="text-center py-8 text-red-600"
          >
            {reportError}
          </p>
        ) : (
          <>
            {/* Sorted Live and Meat sections */}
            {sections.map((section) => (
              <PurchaseSection
                key={section.key}
                section={section}
                totals={sectionTotals(section)}
              />
            ))}

            {/* Grand Total stays at the bottom */}
            <div className="overflow-x-auto border-t-2 border-gray-700 pt-3">
              <table className="w-full min-w-[950px] text-sm font-bold text-gray-900">
                <tbody>
                  <tr>
                    <td colSpan={2} className="px-3 py-3">
                      GRAND TOTAL (LIVE RATE + MEAT RATE)
                    </td>

                    <td className="px-3 py-3 text-right">
                      {money(grandTotals.quantity, 3)} kg
                    </td>

                    <td />

                    <td className="px-3 py-3 text-right">
                      ₹{money(grandTotals.total_amount)}
                    </td>

                    <td className="px-3 py-3 text-right">
                      ₹{money(grandTotals.paid_amount)}
                    </td>

                    <td className="px-3 py-3 text-right">
                      ₹{money(grandTotals.balance_amount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Note: Total amounts include invoice-level
              tax and adjustments where applicable.
              Paid and balance values represent current
              invoice payment records.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
