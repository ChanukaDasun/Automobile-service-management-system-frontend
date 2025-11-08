import { useUser, useAuth } from '@clerk/clerk-react'

function Test() {
    const {user} = useUser();
    console.log( user?.publicMetadata?.role);

    const {userId} = useAuth();

    console.log(userId);

  return (
    <div>
        {/* { user?.publicMetadata?.role || ""} */}
    </div>
  )
}

export default Test