const counterList = [
  {
    name: "Total User",
    value: 40689,
    icon: "/icons/total-user-icon.png",
    type: "up",
  },
  {
    name: "Total User",
    value: 40689,
    icon: "/icons/total-user-icon.png",
    type: "down",
  },
  {
    name: "Total User",
    value: 40689,
    icon: "/icons/total-user-icon.png",
    type: "up",
  },
  {
    name: "Total User",
    value: 40689,
    icon: "/icons/total-user-icon.png",
    type: "up",
  },
];
export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl mb-5 font-medium">Dashboard</h1>
      <div className="flex gap-7">
        {counterList.map((item, index) => (
          <div key={index} className="bg-white rounded-md p-5 flex-1">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p>{item.name}</p>
                <span className="text-[28px] font-medium block my-3">
                  {item.value.toLocaleString()}
                </span>
              </div>
              <img src={item.icon} alt={item.name} />
            </div>
            <div className="flex gap-1">
              <img src={`/icons/${item.type}-icon.png`} alt={item.type} />
              <p>
                <span
                  className={
                    item.type === "up" ? "text-[#00B69B]" : "text-[#F93C65]"
                  }
                >
                  8.5%
                </span>{" "}
                Up from yesterday
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
