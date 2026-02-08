export function DashboardButton(props: any) {
  const { isVisible } = props;
  return (
    <>
      {isVisible && (
        <div className="flex gap-4 ">
          <button className="bg-cyan-900 text-white text-sm px-3 py-2 rounded cursor-pointer hover:scale-105">
            Dashboard
          </button>
        </div>
      )}
    </>
  );
}
