import React, { useEffect, useState } from "react";

import {
  FiTrendingDown,
  FiCheckCircle,
  FiArchive,
  FiTarget,
  FiCalendar,
  FiDownload,
  FiX,
} from "react-icons/fi";

import { api } from "../../services/api";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";


// ============================================================
// LOCAL DATE
// ============================================================

const getLocalDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


// ============================================================
// EMPTY DATA
// ============================================================

const emptyData = {
  received: 0,
  expected_meat: 0,
  meat: 0,
  waste: 0,
  actual_yield_percentage: 0,
  approx_yield_percentage: 0,
};


// ============================================================
// COMPONENT
// ============================================================

export default function DailyYieldCard() {

  // Selected date
  const [selectedDate, setSelectedDate] = useState(
    getLocalDate()
  );

  // Selected category
  // "all" means all categories
  const [selectedCategory, setSelectedCategory] = useState(
    "all"
  );

  // Category list returned from backend
  const [categories, setCategories] = useState([]);

  // Currently displayed production data
  const [yieldData, setYieldData] = useState(
    emptyData
  );

  const [loading, setLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPeriod, setExportPeriod] = useState("date");
  const [exportDate, setExportDate] = useState(selectedDate);
  const [exportMonth, setExportMonth] = useState(
    selectedDate.substring(0, 7)
  );
  const [exportCategory, setExportCategory] = useState("all");
  const [exportLoading, setExportLoading] = useState(false);


  // ============================================================
  // FETCH PRODUCTION DATA
  // ============================================================

  useEffect(() => {
  const fetchProductionData = async () => {
    if (!selectedDate) return;

    try {
      setLoading(true);

      const response = await api.get(
        `/admin/production-yield/?date=${selectedDate}`,
        false
      );

      console.log("Production API response:", response);

      if (!response?.success) {
        setCategories([]);
        setYieldData(emptyData);
        return;
      }

      // Get categories from backend
      const categoryList = Array.isArray(response.categories)
        ? response.categories
        : [];

      console.log("Production categories:", categoryList);

      setCategories(categoryList);

      // ---------------------------------------------
      // ALL CATEGORIES
      // ---------------------------------------------

      if (selectedCategory === "all") {
        const summary = response.summary || {};

        setYieldData({
          received: Number(summary.total_received || 0),
          expected_meat: Number(
            summary.total_expected_meat || 0
          ),
          meat: Number(summary.total_meat || 0),
          waste: Number(summary.total_waste || 0),

          actual_yield_percentage: Number(
            summary.actual_yield_percentage || 0
          ),

          approx_yield_percentage:
            Number(summary.total_received || 0) > 0
              ? (
                  Number(summary.total_expected_meat || 0) /
                  Number(summary.total_received || 0)
                ) * 100
              : 0,
        });

        return;
      }

      // ---------------------------------------------
      // SELECTED CATEGORY
      // ---------------------------------------------

      const selectedCategoryData = categoryList.find(
        (category) =>
          String(category.category).trim() ===
          String(selectedCategory).trim()
      );

      console.log(
        "Selected category:",
        selectedCategory,
        selectedCategoryData
      );

      if (!selectedCategoryData) {
        setYieldData(emptyData);
        return;
      }

      setYieldData({
        received: Number(
          selectedCategoryData.total_received || 0
        ),

        expected_meat: Number(
          selectedCategoryData.total_expected_meat || 0
        ),

        meat: Number(
          selectedCategoryData.total_meat || 0
        ),

        waste: Number(
          selectedCategoryData.total_waste || 0
        ),

        actual_yield_percentage: Number(
          selectedCategoryData.actual_yield_percentage || 0
        ),

        approx_yield_percentage: Number(
          selectedCategoryData.approx_yield_percentage || 0
        ),
      });

    } catch (error) {
      console.error(
        "Failed to load production yield:",
        error
      );

      setCategories([]);
      setYieldData(emptyData);

    } finally {
      setLoading(false);
    }
  };

  fetchProductionData();

}, [selectedDate, selectedCategory]);


  // ============================================================
  // CALCULATIONS
  // ============================================================

  const received =
    Number(yieldData.received || 0);

  const expectedMeat =
    Number(yieldData.expected_meat || 0);

  const actualMeat =
    Number(yieldData.meat || 0);

  const waste =
    Number(yieldData.waste || 0);


  // Expected yield
  const expectedYield =
    received > 0
      ? ((expectedMeat / received) * 100).toFixed(2)
      : "0.00";


  // Actual yield
  const actualYield =
    received > 0
      ? ((actualMeat / received) * 100).toFixed(2)
      : "0.00";


  // Waste %
  const wastePercent =
    received > 0
      ? ((waste / received) * 100).toFixed(2)
      : "0.00";


  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formattedDate = selectedDate
    ? new Date(
        `${selectedDate}T00:00:00`
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

    const fetchExportData = async () => {
      if (exportPeriod === "date") {
        return await api.get(
          `/admin/production-yield/?date=${exportDate}`,
          false
        );
      }

      return await api.get(
        `/admin/production-yield/monthly/?month=${exportMonth}`,
        false
      );
    };

    const exportPDF = async () => {
      try {
        setExportLoading(true);

        const response = await fetchExportData();

        if (!response?.success) {
          alert("Failed to load production data.");
          return;
        }

        const doc = new jsPDF();

        const isMonthly = exportPeriod === "month";

        const reportTitle = isMonthly
          ? "Monthly Production Yield Report"
          : "Daily Production Yield Report";

        const reportPeriod = isMonthly
          ? exportMonth
          : exportDate;

        // --------------------------------------------------
        // HEADER
        // --------------------------------------------------

        doc.setFontSize(18);
        doc.text("THOMSON CASA", 14, 18);

        doc.setFontSize(13);
        doc.text(reportTitle, 14, 28);

        doc.setFontSize(10);
        doc.text(
          `Period: ${reportPeriod}`,
          14,
          36
        );

        doc.text(
          `Category: ${
            exportCategory === "all"
              ? "All Categories"
              : exportCategory
          }`,
          14,
          43
        );

        // --------------------------------------------------
        // SUMMARY
        // --------------------------------------------------

        let summary = response.summary || {};

        if (
          exportCategory !== "all" &&
          response.categories
        ) {
          const categoryData = response.categories.find(
            (item) =>
              item.category === exportCategory
          );

          if (categoryData) {
            summary = {
              total_received:
                categoryData.total_received,

              total_expected_meat:
                categoryData.total_expected_meat,

              total_meat:
                categoryData.total_meat,

              actual_yield_percentage:
                categoryData.actual_yield_percentage,

              total_waste:
                categoryData.total_waste,
            };
          }
        }

        autoTable(doc, {
          startY: 52,

          head: [[
            "Total Raw / Live",
            "Expected Meat",
            "Actual Meat",
            "Actual Yield",
            "Waste",
          ]],

          body: [[
            `${Number(
              summary.total_received || 0
            ).toFixed(2)} KG`,

            `${Number(
              summary.total_expected_meat || 0
            ).toFixed(2)} KG`,

            `${Number(
              summary.total_meat || 0
            ).toFixed(2)} KG`,

            `${Number(
              summary.actual_yield_percentage || 0
            ).toFixed(2)}%`,

            `${Number(
              summary.total_waste || 0
            ).toFixed(2)} KG`,
          ]],

          theme: "grid",

          styles: {
            fontSize: 9,
          },
        });

        // --------------------------------------------------
        // CATEGORY TABLE
        // --------------------------------------------------

        let categories =
          response.categories || [];

        if (exportCategory !== "all") {
          categories = categories.filter(
            (item) =>
              item.category === exportCategory
          );
        }

        const categoryRows = categories
          .filter(
            (item) =>
              Number(item.total_received || 0) > 0
          )
          .map((item) => [
            item.category,

            `${Number(
              item.total_received || 0
            ).toFixed(2)} KG`,

            `${Number(
              item.approx_yield_percentage || 0
            ).toFixed(2)}%`,

            `${Number(
              item.total_expected_meat || 0
            ).toFixed(2)} KG`,

            `${Number(
              item.total_meat || 0
            ).toFixed(2)} KG`,

            `${Number(
              item.actual_yield_percentage || 0
            ).toFixed(2)}%`,

            `${Number(
              item.total_waste || 0
            ).toFixed(2)} KG`,
          ]);

        if (categoryRows.length > 0) {
          autoTable(doc, {
            startY:
              doc.lastAutoTable.finalY + 10,

            head: [[
              "Category",
              "Raw KG",
              "Approx Yield",
              "Expected KG",
              "Actual KG",
              "Actual Yield",
              "Waste KG",
            ]],

            body: categoryRows,

            theme: "grid",

            styles: {
              fontSize: 8,
            },
          });
        }

        // --------------------------------------------------
        // DAILY TABLE FOR MONTHLY REPORT
        // --------------------------------------------------

        if (
          isMonthly &&
          exportCategory === "all" &&
          response.daily?.length > 0
        ) {
          autoTable(doc, {
            startY:
              doc.lastAutoTable.finalY + 10,

            head: [[
              "Date",
              "Raw KG",
              "Expected KG",
              "Actual KG",
              "Actual Yield",
              "Waste KG",
            ]],

            body: response.daily.map((item) => [
              item.date,

              `${Number(
                item.total_received || 0
              ).toFixed(2)}`,

              `${Number(
                item.total_expected_meat || 0
              ).toFixed(2)}`,

              `${Number(
                item.total_meat || 0
              ).toFixed(2)}`,

              `${Number(
                item.actual_yield_percentage || 0
              ).toFixed(2)}%`,

              `${Number(
                item.total_waste || 0
              ).toFixed(2)}`,
            ]),

            theme: "grid",

            styles: {
              fontSize: 8,
            },
          });
        }

        // --------------------------------------------------
        // SAVE
        // --------------------------------------------------

        const filename = isMonthly
          ? `production-report-${exportMonth}.pdf`
          : `production-report-${exportDate}.pdf`;

        doc.save(filename);

        setShowExportModal(false);

      } catch (error) {

        console.error(
          "PDF export failed:",
          error
        );

        alert(
          "Failed to generate PDF."
        );

      } finally {
        setExportLoading(false);
      }
    };


    const exportExcel = async () => {
  try {
    setExportLoading(true);

    const response = await fetchExportData();

    if (!response?.success) {
      alert("Failed to load production data.");
      return;
    }

    const isMonthly =
      exportPeriod === "month";

    // --------------------------------------------------
    // CATEGORY FILTER
    // --------------------------------------------------

    let categories =
      response.categories || [];

    if (exportCategory !== "all") {
      categories = categories.filter(
        (item) =>
          item.category === exportCategory
      );
    }

    categories = categories.filter(
      (item) =>
        Number(item.total_received || 0) > 0
    );

    // --------------------------------------------------
    // SUMMARY
    // --------------------------------------------------

    let summary =
      response.summary || {};

    if (exportCategory !== "all") {

      const categoryData =
        response.categories?.find(
          (item) =>
            item.category === exportCategory
        );

      if (categoryData) {
        summary = {
          total_received:
            categoryData.total_received,

          total_expected_meat:
            categoryData.total_expected_meat,

          total_meat:
            categoryData.total_meat,

          actual_yield_percentage:
            categoryData.actual_yield_percentage,

          total_waste:
            categoryData.total_waste,
        };
      }
    }

    // --------------------------------------------------
    // SUMMARY SHEET
    // --------------------------------------------------

    const summaryRows = [
      ["THOMSON CASA"],
      [
        isMonthly
          ? "Monthly Production Report"
          : "Daily Production Report",
      ],
      [
        isMonthly
          ? `Month: ${exportMonth}`
          : `Date: ${exportDate}`,
      ],
      [
        `Category: ${
          exportCategory === "all"
            ? "All Categories"
            : exportCategory
        }`,
      ],
      [],

      ["Metric", "Value"],

      [
        "Total Raw / Live",
        Number(
          summary.total_received || 0
        ),
      ],

      [
        "Expected Meat",
        Number(
          summary.total_expected_meat || 0
        ),
      ],

      [
        "Actual Meat",
        Number(
          summary.total_meat || 0
        ),
      ],

      [
        "Actual Yield %",
        Number(
          summary.actual_yield_percentage || 0
        ),
      ],

      [
        "Total Waste",
        Number(
          summary.total_waste || 0
        ),
      ],
    ];

    const workbook =
      XLSX.utils.book_new();

    const summarySheet =
      XLSX.utils.aoa_to_sheet(
        summaryRows
      );

    XLSX.utils.book_append_sheet(
      workbook,
      summarySheet,
      "Summary"
    );

    // --------------------------------------------------
    // CATEGORY SHEET
    // --------------------------------------------------

    const categoryRows = [
      [
        "Category",
        "Raw KG",
        "Approx Yield %",
        "Expected Meat KG",
        "Actual Meat KG",
        "Actual Yield %",
        "Waste KG",
      ],

      ...categories.map((item) => [
        item.category,

        Number(
          item.total_received || 0
        ),

        Number(
          item.approx_yield_percentage || 0
        ),

        Number(
          item.total_expected_meat || 0
        ),

        Number(
          item.total_meat || 0
        ),

        Number(
          item.actual_yield_percentage || 0
        ),

        Number(
          item.total_waste || 0
        ),
      ]),
    ];

    const categorySheet =
      XLSX.utils.aoa_to_sheet(
        categoryRows
      );

    XLSX.utils.book_append_sheet(
      workbook,
      categorySheet,
      "Categories"
    );

    // --------------------------------------------------
    // DAILY SHEET FOR MONTHLY REPORT
    // --------------------------------------------------

    if (
      isMonthly &&
      response.daily?.length > 0
    ) {
      const dailyRows = [
        [
          "Date",
          "Raw KG",
          "Expected Meat KG",
          "Actual Meat KG",
          "Actual Yield %",
          "Waste KG",
        ],

        ...response.daily.map((item) => [
          item.date,

          Number(
            item.total_received || 0
          ),

          Number(
            item.total_expected_meat || 0
          ),

          Number(
            item.total_meat || 0
          ),

          Number(
            item.actual_yield_percentage || 0
          ),

          Number(
            item.total_waste || 0
          ),
        ]),
      ];

      const dailySheet =
        XLSX.utils.aoa_to_sheet(
          dailyRows
        );

      XLSX.utils.book_append_sheet(
        workbook,
        dailySheet,
        "Daily"
      );
    }

    // --------------------------------------------------
    // SAVE
    // --------------------------------------------------

    const filename = isMonthly
      ? `production-report-${exportMonth}.xlsx`
      : `production-report-${exportDate}.xlsx`;

    XLSX.writeFile(
      workbook,
      filename
    );

    setShowExportModal(false);

  } catch (error) {

    console.error(
      "Excel export failed:",
      error
    );

    alert(
      "Failed to generate Excel."
    );

  } finally {
    setExportLoading(false);
  }
};


  // ============================================================
  // UI
  // ============================================================

  return (

    <div className="bg-white border border-[#00000026] rounded-xl p-6 shadow-sm flex flex-col justify-between h-full">


      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col gap-4 mb-6">

        <div className="flex justify-between items-start gap-4">

        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Production Yield
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            {selectedCategory === "all"
              ? "All Categories"
              : selectedCategory}
            {" • "}
            {formattedDate}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setExportDate(selectedDate);
            setExportMonth(
              selectedDate.substring(0, 7)
            );
            setExportCategory(selectedCategory);
            setShowExportModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#465C8F] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition"
        >
          <FiDownload size={16} />
          Export
        </button>

      </div>


        {/* ======================================================
            FILTERS
        ====================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">


          {/* DATE FILTER */}

          <div className="relative">

            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Production Date
            </label>

            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">

              <FiCalendar
                size={15}
                className="text-[#465C8F]"
              />

              <input
                type="date"
                value={selectedDate}
                onChange={(event) => {
                  setSelectedDate(
                    event.target.value
                  );

                  // When date changes, reset category
                  // to All Categories.
                  setSelectedCategory("all");
                }}
                className="w-full bg-transparent text-gray-700 text-sm font-medium outline-none cursor-pointer"
              />

            </div>

          </div>


          {/* CATEGORY FILTER */}

         <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">
        Category
      </label>

      <select
        value={selectedCategory}
        onChange={(event) => {
          setSelectedCategory(event.target.value);
        }}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none cursor-pointer"
      >
        <option value="all">
          All Categories
        </option>

        {categories.length > 0 ? (
          categories.map((category, index) => (
            <option
              key={`${category.category}-${index}`}
              value={category.category}
            >
              {category.category}
            </option>
          ))
        ) : (
          <option disabled>
            No categories for this date
          </option>
        )}
      </select>
    </div>

        </div>

      </div>


      {/* ========================================================
          LOADING
      ======================================================== */}

      {loading ? (

        <div className="flex items-center justify-center min-h-[250px]">

          <span className="text-sm text-gray-500">
            Loading production data...
          </span>

        </div>

      ) : (

        <>


          {/* ====================================================
              PRODUCTION CARDS
          ==================================================== */}

          <div className="grid grid-cols-2 gap-4 mb-6">


            {/* RAW / LIVE */}

            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">

              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">

                <FiArchive size={18} />

              </div>

              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                Raw / Live
              </span>

              <span className="text-xl font-bold text-gray-900">

                {received.toFixed(2)}

                <span className="text-sm font-medium text-gray-500">
                  {" "}kg
                </span>

              </span>

            </div>


            {/* EXPECTED MEAT */}

            <div className="flex flex-col items-center p-3 bg-yellow-50 rounded-xl">

              <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mb-2">

                <FiTarget size={18} />

              </div>

              <span className="text-xs text-yellow-700 font-medium uppercase tracking-wider mb-1">
                Expected Meat
              </span>

              <span className="text-xl font-bold text-yellow-700">

                {expectedMeat.toFixed(2)}

                <span className="text-sm font-medium">
                  {" "}kg
                </span>

              </span>

            </div>


            {/* ACTUAL MEAT */}

            <div className="flex flex-col items-center p-3 bg-green-50 rounded-xl">

              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">

                <FiCheckCircle size={18} />

              </div>

              <span className="text-xs text-green-700 font-medium uppercase tracking-wider mb-1">
                Actual Meat
              </span>

              <span className="text-xl font-bold text-green-700">

                {actualMeat.toFixed(2)}

                <span className="text-sm font-medium">
                  {" "}kg
                </span>

              </span>

            </div>


            {/* WASTE */}

            <div className="flex flex-col items-center p-3 bg-red-50 rounded-xl">

              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2">

                <FiTrendingDown size={18} />

              </div>

              <span className="text-xs text-red-700 font-medium uppercase tracking-wider mb-1">
                Waste
              </span>

              <span className="text-xl font-bold text-red-700">

                {waste.toFixed(2)}

                <span className="text-sm font-medium">
                  {" "}kg
                </span>

              </span>

            </div>

          </div>


          {/* ====================================================
              YIELD DETAILS
          ==================================================== */}

          <div className="space-y-3">


            {/* Approximate Yield */}

            <div className="flex justify-between items-center text-sm">

              <span className="text-gray-500">
                Approx. Yield
              </span>

              <span className="font-semibold text-gray-700">

                {Number(
                  yieldData.approx_yield_percentage || 0
                ).toFixed(2)}
                %

              </span>

            </div>


            {/* Expected Yield */}

            <div className="flex justify-between items-center text-sm">

              <span className="text-gray-500">
                Expected Yield
              </span>

              <span className="font-semibold text-yellow-600">
                {expectedYield}%
              </span>

            </div>


            {/* Actual Yield */}

            <div className="flex justify-between items-center text-sm">

              <span className="text-gray-500">
                Actual Yield
              </span>

              <span className="font-bold text-[#465C8F]">
                {actualYield}%
              </span>

            </div>


            {/* Waste */}

            <div className="flex justify-between items-center text-sm">

              <span className="text-gray-500">
                Waste
              </span>

              <span className="font-semibold text-red-600">
                {wastePercent}%
              </span>

            </div>


            {/* ==================================================
                PROGRESS BAR
            ================================================== */}

            <div className="pt-2">

              <div className="flex justify-between text-xs text-gray-500 mb-1">

                <span>
                  Actual Meat
                </span>

                <span>
                  Waste
                </span>

              </div>

              <div className="w-full h-3 flex rounded-full overflow-hidden bg-gray-100">

                {/* Actual Meat */}

                <div
                  className="bg-green-500 h-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        Number(actualYield)
                      )
                    )}%`,
                  }}
                />

                {/* Waste */}

                <div
                  className="bg-red-500 h-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        Number(wastePercent)
                      )
                    )}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </>

      )}

      {showExportModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Export Production Report
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Choose report period and format
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowExportModal(false)
          }
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <FiX size={18} />
        </button>

      </div>

      {/* REPORT PERIOD */}

      <div className="mb-5">

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Report Period
        </label>

        <div className="grid grid-cols-2 gap-3">

          <button
            type="button"
            onClick={() =>
              setExportPeriod("date")
            }
            className={`px-4 py-3 rounded-lg border text-sm font-semibold ${
              exportPeriod === "date"
                ? "border-[#465C8F] bg-[#465C8F] text-white"
                : "border-gray-200 text-gray-700"
            }`}
          >
            Selected Date
          </button>

          <button
            type="button"
            onClick={() =>
              setExportPeriod("month")
            }
            className={`px-4 py-3 rounded-lg border text-sm font-semibold ${
              exportPeriod === "month"
                ? "border-[#465C8F] bg-[#465C8F] text-white"
                : "border-gray-200 text-gray-700"
            }`}
          >
            Monthly
          </button>

        </div>

      </div>

      {/* DATE / MONTH */}

      <div className="mb-5">

        {exportPeriod === "date" ? (
          <>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Production Date
            </label>

            <input
              type="date"
              value={exportDate}
              onChange={(event) =>
                setExportDate(
                  event.target.value
                )
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
            />
          </>
        ) : (
          <>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Production Month
            </label>

            <input
              type="month"
              value={exportMonth}
              onChange={(event) =>
                setExportMonth(
                  event.target.value
                )
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
            />
          </>
        )}

      </div>

      {/* CATEGORY */}

      <div className="mb-6">

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Category
        </label>

        <select
          value={exportCategory}
          onChange={(event) =>
            setExportCategory(
              event.target.value
            )
          }
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
        >

          <option value="all">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              key={category.category}
              value={category.category}
            >
              {category.category}
            </option>
          ))}

        </select>

      </div>

      {/* EXPORT BUTTONS */}

      <div className="grid grid-cols-2 gap-3">

        <button
          type="button"
          disabled={exportLoading}
          onClick={exportPDF}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
        >
          <FiDownload size={16} />

          {exportLoading
            ? "Exporting..."
            : "PDF"}
        </button>

        <button
          type="button"
          disabled={exportLoading}
          onClick={exportExcel}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
        >
          <FiDownload size={16} />

          {exportLoading
            ? "Exporting..."
            : "Excel"}
        </button>

      </div>

    </div>

  </div>
)}

    </div>
  );
}