import { useUser } from '@clerk/clerk-react'
import React from 'react'

function Test() {
    const {user} = useUser();
    console.log( user?.publicMetadata?.role);
  return (
    <div>
        {/* { user?.publicMetadata?.role || ""} */}
    </div>
  )
}

export default Test