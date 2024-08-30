import Link from 'next/link';
import { MdOutlineMapsHomeWork, MdOutlineMarkEmailRead, MdOutlineWeb, MdPhoneForwarded } from 'react-icons/md';
import { FaFacebookSquare, FaInstagram } from 'react-icons/fa';
import { IoLogoYoutube } from 'react-icons/io';






const SchoolInfo = () => {
  return (
    <div className="p-5">
      <h3 className='text-lg font-medium text-gray-700 uppercase dark:text-gray-200 mb-3'>Informasi sekolah</h3>
      <div className='px-0 md:px-2 leading-relaxed mb-3'>
        <h3 className='text-md text-gray-600 font-medium dark:text-gray-200/80 flex items-center gap-1'> <MdOutlineMapsHomeWork size={20} /> Alamat :</h3>
        <p className=' px-1 text-sm text-gray-500 dark:text-gray-300/80'>Jalan Pahlawan 19 B Kelurahan Cihaurgeulis Kecamatan Cibeunying Kaler</p>
      </div>
      <div className='px-0 md:px-2 leading-relaxed mb-3'>
        <span className='flex  items-center gap-1 text-gray-600 font-medium dark:text-gray-200/80'>
          <MdPhoneForwarded size={20} />
          <p className='text-md'>Telepon</p>
        </span>
        <p className='px-1 text-xs text-gray-500 dark:text-gray-300/80'>022-7103983 - 081221049998</p>
      </div>
      <div className='px-0 md:px-2 leading-relaxed mb-3'>
        <span className='flex  items-center gap-1 text-gray-600 font-medium dark:text-gray-200/80'>
          <MdOutlineMarkEmailRead size={20} />
          <p className='text-md'>Email</p>
        </span>
        <p className='px-1 text-xs text-gray-500 dark:text-gray-300/80'>smkicbcintaniaga19b@gmail.com</p>
      </div>
      <div className='px-0 md:px-2 leading-relaxed mb-3'>
        <span className='flex  items-center gap-1 text-gray-600 font-medium dark:text-gray-200/80'>
          <MdOutlineWeb size={20} />
          <p className='text-md'>Website</p>
        </span>
        <p className='px-1 text-xs text-gray-500 dark:text-gray-300/80'>www.smkicbcintaniaga.id</p>
      </div>
      <div className='px-0 md:px-2 leading-relaxed mb-3 border-b pb-3 border-gray-400 dark:border-gray-500'>
        <span className='flex  items-center gap-1 text-gray-600 font-medium dark:text-gray-200/80'>
          <p className='text-md'>Sosial Media :</p>
        </span>
        <div className='flex gap-3 mt-3'>
          <Link className='group flex gap-1' href="https://www.facebook.com/smkicbcintaniagabandung?mibextid=ZbWKwL">
            <FaFacebookSquare size={20} className='group-hover:text-blue-500' />
            <span className='text-xs group-hover:text-blue-400'>Facebook</span>
          </Link>
          <Link className='group flex gap-1' href="https://instagram.com/smkicb.cintaniaga?igsh=aTgyZTlnejZ0eGgx">
            <FaInstagram size={20} className='group-hover:text-pink-600' />

            <span className='text-xs group-hover:text-pink-600'>Instagram</span>
          </Link>
          <Link className='group flex gap-1' href="https://www.youtube.com/@SMKICBCintaNiaga">
            <IoLogoYoutube size={20} className='group-hover:text-red-500' />
            <span className='text-xs group-hover:text-red-500'>Youtube</span>
          </Link>

        </div>
      </div>
    </div>
  )
}

export default SchoolInfo