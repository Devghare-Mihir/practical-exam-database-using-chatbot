import React from 'react'
import UploadExam from './UploadExam'
import GetInstructorExam from './GetInstructorExam'
// import GetSolutions from './GetSolutions'd

const InstructorDashboard = () => {
  return (
    <>
      <section className='flex justify-around items-center flex-wrap'>
        <div className='m-4 p-2'>
          <UploadExam />
        </div>
        {/* <GetSolutions /> */}
        <div className='h-[70vh] m-3 p-2'>
          <h2 className='text-[1.65rem] font-bold mb-[2rem]'>Scheduled Exam</h2>
          <GetInstructorExam />
        </div>
      </section>
    </>
  )
}

export default InstructorDashboard