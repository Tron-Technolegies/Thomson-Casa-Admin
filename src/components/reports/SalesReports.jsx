
import React, { useState, useEffect } from "react";
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

export default function SalesReports({ period = "Daily" }) {
  const [stats, setStats] = useState({ revenue: 0, orders: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [livePurchases, setLivePurchases] = useState([]);
  const [meatPurchases, setMeatPurchases] = useState([]);
  const [legacyPurchases, setLegacyPurchases] = useState([]);
  const [reportSummary, setReportSummary] = useState(null);
  const [reportError, setReportError] = useState("");

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });


  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");


  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setReportError("");

      try {
        const [statsResult, chartsResult, salesResult] =
          await Promise.allSettled([
            api.get(`/admin/dashboard/stats/?period=${period}`, false),
            api.get(`/admin/dashboard/charts/?period=${period}`, false),

            api.get(
              `/accounts/reports/sales/?${new URLSearchParams(
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
              ).toString()}`,
              false
            ),

          ]);

        if (!active) return;

        if (
          statsResult.status === "fulfilled" &&
          statsResult.value.success
        ) {
          setStats({
            revenue: Number(statsResult.value.revenue || 0),
            orders: Number(statsResult.value.orders || 0),
          });
        }

        if (
          chartsResult.status === "fulfilled" &&
          chartsResult.value.success
        ) {
          setChartData(chartsResult.value.chartData || []);
        }

        if (salesResult.status === "rejected") {
          throw salesResult.reason;
        }

        const salesRes = salesResult.value;

        if (!salesRes.success) {
          throw new Error(
            salesRes.message || "Could not load sales report"
          );
        }

        if (
          !Array.isArray(salesRes.live_rate_purchases) ||
          !Array.isArray(salesRes.meat_rate_purchases)
        ) {
          throw new Error(
            "The backend does not return the new purchase groups. Check the sales report API."
          );
        }

        setLivePurchases(salesRes.live_rate_purchases);
        setMeatPurchases(salesRes.meat_rate_purchases);
        setLegacyPurchases(salesRes.legacy_purchases || []);
        setReportSummary(salesRes.summary || null);
      } catch (err) {
        if (!active) return;

        console.error("Sales report fetching error:", err);
        setReportError(
          err?.message || "Could not load sales report"
        );
        setLivePurchases([]);
        setMeatPurchases([]);
        setLegacyPurchases([]);
        setReportSummary(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [period, selectedDate, fromDate, toDate]);

  const number = (value, digits = 2) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });


  const sections = [
    {
      key: "live_rate",
      title: "Live Rate Purchases",
      customers: livePurchases,
    },
    {
      key: "meat_rate",
      title: "Meat Rate Purchases",
      customers: meatPurchases,
    },
  ];

  const emptyTotals = () => ({
    quantity: 0,
    total_amount: 0,
    paid_amount: 0,
    balance_amount: 0,
  });


  const sectionTotals = (section) => {
    const fromApi = reportSummary?.[section.key];

    if (fromApi) return fromApi;

    return section.customers.reduce(
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
  };

  const grandTotals = sections.reduce((total, section) => {
    const sectionTotal = sectionTotals(section);

    return {
      quantity:
        total.quantity +
        Number(sectionTotal.quantity || 0),
      total_amount:
        total.total_amount +
        Number(sectionTotal.total_amount || 0),
      paid_amount:
        total.paid_amount +
        Number(sectionTotal.paid_amount || 0),
      balance_amount:
        total.balance_amount +
        Number(sectionTotal.balance_amount || 0),
    };
  }, emptyTotals());

  const reportHeaders = [
    "Customer Code & Name",
    "Meat Category",
    "Qty (kg)",
    "Rate (Rs/kg)",
    "Amount (Rs)",
    "Paid (Rs)",
    "Balance (Rs)",
  ];

  const exportRows = () => {
    const rows = [];

    sections.forEach((section) => {
      rows.push([
        section.title, "", "", "", "", "", "",
      ]);

      section.customers.forEach((customer) => {
        const items = customer.items || [];

        items.forEach((item, index) => {
          rows.push([
            index === 0
              ? `${customer.customer_code} - ${customer.customer_name}`
              : "",
            item.item_name || "",
            number(item.quantity, 3),
            number(item.rate),
            number(item.amount),
            index === 0
              ? number(customer.paid_amount)
              : "",
            index === 0
              ? number(customer.balance_amount)
              : "",
          ]);
        });

        if (!items.length) {
          rows.push([
            `${customer.customer_code} - ${customer.customer_name}`,
            "",
            "",
            "",
            number(customer.total_amount),
            number(customer.paid_amount),
            number(customer.balance_amount),
          ]);
        }
      });

      const totals = sectionTotals(section);

      rows.push([
        "SECTION TOTAL",
        "",
        number(totals.quantity, 3),
        "",
        number(totals.total_amount),
        number(totals.paid_amount),
        number(totals.balance_amount),
      ]);

      rows.push(["", "", "", "", "", "", ""]);
    });

    rows.push([
      "GRAND TOTAL",
      "",
      number(grandTotals.quantity, 3),
      "",
      number(grandTotals.total_amount),
      number(grandTotals.paid_amount),
      number(grandTotals.balance_amount),
    ]);

    return rows;
  };

  const handleDownloadPDF = () => {
    if (loading || reportError) return;

    exportTableToPDF(
      `${period} Sales Report - ${selectedDate}`,
      reportHeaders,
      exportRows(),
      `Sales_Report_${period}_${selectedDate}.pdf`
    );
  };

  // Excel-compatible CSV download
  const handleDownloadCSV = () => {
    if (loading || reportError) return;

    const lines = [reportHeaders, ...exportRows()];

    const content = lines
      .map((row) =>
        row
          .map((value) => {
            let text = String(value ?? "");

            // Prevent spreadsheet formula injection.
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
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download =
      `Sales_Report_${period}_${selectedDate}.csv`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  const PurchaseSection = ({ section }) => {
    const totals = sectionTotals(section);

    return (
      <section className="mb-8 last:mb-0">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
          {section.title}
        </h3>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full min-w-[950px] text-left text-sm text-gray-700">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-300">
                {reportHeaders.map((header, index) => (
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
                    No purchases in this section for the selected period.
                  </td>
                </tr>
              )}

              {section.customers.map((customer) => {
                const items = customer.items?.length
                  ? customer.items
                  : [null];

                return items.map((item, index) => (
                  <tr
                    key={`${section.key}-${customer.customer_code}-${index}`}
                    className="border-b border-gray-200"
                  >
                    {index === 0 && (
                      <td
                        rowSpan={items.length}
                        className="px-3 py-3 align-top font-semibold text-gray-900"
                      >
                        {customer.customer_code}
                        <br />
                        {customer.customer_name}
                      </td>
                    )}

                    <td className="px-3 py-3">
                      {item?.item_name || "—"}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {item
                        ? number(item.quantity, 3)
                        : "—"}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {item
                        ? number(item.rate)
                        : "—"}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {item
                        ? number(item.amount)
                        : number(customer.total_amount)}
                    </td>

                    {index === 0 && (
                      <>
                        <td
                          rowSpan={items.length}
                          className="px-3 py-3 align-top text-right font-semibold"
                        >
                          {number(customer.paid_amount)}
                        </td>

                        <td
                          rowSpan={items.length}
                          className="px-3 py-3 align-top text-right font-semibold"
                        >
                          {number(customer.balance_amount)}
                        </td>
                      </>
                    )}
                  </tr>
                ));
              })}
            </tbody>

            <tfoot className="bg-gray-100 font-bold text-gray-900">
              <tr className="border-t-2 border-gray-400">
                <td colSpan={2} className="px-3 py-3">
                  SECTION TOTAL
                </td>

                <td className="px-3 py-3 text-right">
                  {number(totals.quantity, 3)}
                </td>

                <td />

                <td className="px-3 py-3 text-right">
                  ₹{number(totals.total_amount)}
                </td>

                <td className="px-3 py-3 text-right">
                  ₹{number(totals.paid_amount)}
                </td>

                <td className="px-3 py-3 text-right">
                  ₹{number(totals.balance_amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    );
  };

  return (
    <div className="w-full min-w-0">
      {/* Dashboard Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">

        {/* Revenue */}
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
              ₹{stats.revenue.toLocaleString()}
            </h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
              <FiTrendingUp /> Validated
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
              <FiTrendingUp /> Validated
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
              <FiTrendingDown /> No returns
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
                ? (stats.revenue / stats.orders).toFixed(0)
                : 0}
            </h3>
            <div className="flex items-center text-green-600 text-xs font-semibold gap-1">
              <FiTrendingUp /> Validated
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
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

      {/* Customer Purchase Report */}
      <div className="bg-white border border-[#00000026] rounded-xl shadow-sm p-4 sm:p-6 mb-6">

        {/* Report Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Customer Purchase Report
            </h2>
            <p className="text-sm text-gray-500">
              {period} report for {selectedDate}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">

            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  max={toDate || undefined}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                }}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium"
              >
                Clear
              </button>
            </div>


            <button
              onClick={handleDownloadCSV}
              disabled={loading || !!reportError}
              className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              Excel (CSV)
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={loading || !!reportError}
              className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              PDF
            </button>
          </div>
        </div>

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
            {/* Live Rate / Meat Rate / Legacy */}
            {sections.map((section) => (
              <PurchaseSection
                key={section.key}
                section={section}
              />
            ))}

            {/* Grand Total */}
            <div className="overflow-x-auto border-t-2 border-gray-700 pt-3">
              <table className="w-full min-w-[950px] text-sm font-bold text-gray-900">
                <tbody>
                  <tr>
                    <td
                      colSpan={2}
                      className="px-3 py-3"
                    >
                      GRAND TOTAL (LIVE RATE + MEAT RATE)
                    </td>

                    <td className="px-3 py-3 text-right">
                      {number(grandTotals.quantity, 3)} kg
                    </td>

                    <td />

                    <td className="px-3 py-3 text-right">
                      ₹{number(grandTotals.total_amount)}
                    </td>

                    <td className="px-3 py-3 text-right">
                      ₹{number(grandTotals.paid_amount)}
                    </td>

                    <td className="px-3 py-3 text-right">
                      ₹{number(grandTotals.balance_amount)}
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
