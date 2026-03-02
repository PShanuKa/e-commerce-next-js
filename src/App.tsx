import Default from "./Layouts/Default"
import AllRoutes from "./routes/Routes"


function App() {


  return (
    <>
      <Default children={<AllRoutes />} />
    </>
  )
}

export default App
