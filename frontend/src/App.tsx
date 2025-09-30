import { Button } from "./components/ui/button"
import { useClerk, UserButton, useUser } from "@clerk/clerk-react"

export default function App() {

  const { user } = useUser()
  const { openSignIn } = useClerk()

  return (
    /** here is the button to logged in want to impliment more **/
    <div>
      <div className="flex min-h-svh flex-col items-center justify-center gap-4">
        {
          !user ? (<Button onClick={openSignIn}>Login</Button>) : (<UserButton />)
        }
        
      </div>
    </div>
  )
}
