import { FaFileInvoiceDollar, FaReceipt, FaDollarSign, FaWallet } from "react-icons/fa";

const icons = {
  invoice: <FaFileInvoiceDollar size={20} />,
  tax: <FaReceipt size={20} />,
  gross: <FaDollarSign size={20} />,
  paid: <FaWallet size={20} />,
};

const colors = {
  invoice: "bg-blue-100 text-blue-600",
  tax: "bg-yellow-100 text-yellow-600",
  gross: "bg-green-100 text-green-600",
  paid: "bg-purple-100 text-purple-600",
};

function InvoiceStatCard({ title, value, subtitle, type }) {
  return (
    <div className="bg-white border border-[#00000026] rounded-2xl p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="uppercase text-sm text-gray-500 font-medium">{title}</h4>

          <h2 className="text-4xl font-bold mt-6 text-gray-800">{value}</h2>

          <p className="mt-5 text-sm text-green-600">{subtitle}</p>
        </div>

        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors[type]}`}>
          {icons[type]}
        </div>
      </div>
    </div>
  );
}

export default InvoiceStatCard;
