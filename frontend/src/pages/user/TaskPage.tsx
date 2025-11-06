import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const TaskPage = () => {
  const navigate = useNavigate();

  const tasks = [
    {
      task_id: 1,
      name: "Oil Change",
      description: "Change engine oil and oil filter",
      status: "ongoing",
      start_date: new Date().toLocaleString(),
      end_date: null,
      user_id: "user_33SWQDkGoK0Jll1m1CIxADUTKg7",
      employee_id: "user_34s5drjxj1d5sl7iKnk7l2vWsQV",
    },
  ];

  const handleClick = (taskId: number) => {
    navigate(`/user/tasks/${taskId}`);
  };

  return (
    <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <Card
          key={task.task_id}
          onClick={() => handleClick(task.task_id)}
        >
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-600">{task.name}</CardTitle>
            <CardDescription>{task.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Status:</span> {task.status}
            </p>
            <p>
              <span className="font-medium">Start Date:</span> {task.start_date}
            </p>
            <p>
              <span className="font-medium">End Date:</span>{" "}
              {task.end_date ? task.end_date : "In progress"}
            </p>
            <Button onClick={() => handleClick(task.task_id)} variant="outline" size="sm" className="mt-2">
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskPage;
