import { Oscilloscope } from './components/Oscilloscope'
import { Spectrum } from './components/Spectrum'
import './App.css'

function App() {  

  return (
    <>
      <div className='flex flex-col items-center justify-centermin-h-screen bg-black text-white'>
        <Oscilloscope />
        <Spectrum />
      </div>
    </>
  )
}

export default App
