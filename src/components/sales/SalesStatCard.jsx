function SalesStatCard({ title, value, growth, positive }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h4 className="uppercase text-gray-500 text-sm font-medium">{title}</h4>

      <h2 className="text-5xl font-bold mt-6">{value}</h2>

      <p className={`mt-6 text-sm ${positive ? "text-green-500" : "text-red-500"}`}>{growth}</p>
    </div>
  );
}

export default SalesStatCard;
