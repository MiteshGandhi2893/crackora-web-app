export function Search() {
  return (
    <>
      <div className="flex justify-between bg-gray-200 rounded-full px-2 pl-4 py-1.5 gap-5 ">
        <input
          type="text"
          className="outline-none"
          placeholder="Search here..."
        />
        <button
          className="rounded-full lg:flex hidden
         gap-2 items-center justify-center cursor-pointer bg-cyan-700 hover:bg-cyan-900 text-white px-2 py-1.5 text-sm"
        >
          <img src="/assets/search.svg" className="w-5 h-5" alt="" />
          
        </button>
        <button className="rounded-full bg-cyan-900 px-1 lg:hidden block">
          <img src="/assets/search.svg" className="w-5 h-5" alt="" />
        </button>
      </div>
    </>
  );
}
