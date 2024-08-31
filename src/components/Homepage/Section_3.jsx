import Image from "../Image"

const SectionThree = () => {
  return (
    <div className='min-h-screen w-full py-24 grid grid-cols-1 md:grid-cols-12 relative z-10 px-4 sm:px-12 md:px-20 lg:px-28 2xl:px-32'>


      {/* Left */}
      <div className="col-span-12 lg:col-span-6">
        <div>LEFT</div>
      </div>

      {/* Right */}
      <div className="col-span-12 lg:col-span-6 relative">
        <div className=" opacity-10 absolute left-0 right-0 top-0 bottom-0 -z-50">
          <Image width={2200} height={1280} path="background-vector.jpg" />
        </div>

      </div>
    </div>
  )
}

export default SectionThree;