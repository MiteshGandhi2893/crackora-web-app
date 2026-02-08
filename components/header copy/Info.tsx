export function Info(props: any) {
  const {mobile} = props
  return (
    <>
      <div className={`flex gap-2 ${mobile ? 'text-cyan-900' : 'text-white'} items-center`}>
        <div className="flex items-center gap-1 border-r pr-4 border-r-gray-500 lg:text-md text-sm">
          <img
            src={`/assets/${mobile ? 'phone-blue.svg' : 'phone-white-outline.svg'}`}
            className="lg:w-5 lg:h-5 lg:mt-2 w-4 h-4"
            alt=""
          />
          +91 8591536724
        </div>
        <div className="flex items-center gap-1 lg:text-md text-sm">
          <img
             src={`/assets/${mobile ? 'location-blue.svg' : 'location-white-outline.svg'}`}
            className="lg:w-5 lg:h-5 lg:mt-2 w-4 h-4"
            alt=""
          />
          Mumbai, India
        </div>
      </div>
    </>
  );
}
