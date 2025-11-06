import { useAuth } from '@clerk/clerk-react';

function Test() {

  const { getToken, userId } = useAuth();

  const fetchData = async () => {
    const token = await getToken({ template: 'test-template' });
    console.log("Token:", token);
    console.log("User ID:", userId);
  }

  fetchData();

  return (
    <div>
    </div>
  )
}

export default Test;