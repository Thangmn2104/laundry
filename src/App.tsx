import './App.css'
import RouterWrapper from './components/common/RouterWrapper'
import { Toaster } from './components/ui/toaster'
import ContactComponent from './components/contact/ContactComponent'

function App() {

  return (
    <>
      <Toaster />
      <RouterWrapper />
      <ContactComponent />
    </>
  )
}

export default App
