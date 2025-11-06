import { useParams, useNavigate } from "react-router-dom";

const ViewTask = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  return (
    <>
        <div>ViewTask {taskId}</div>
        <button onClick={() => navigate(`/user/chat?taskId=${taskId}`)}>
            Chat
        </button>
    </>
  )
}

export default ViewTask