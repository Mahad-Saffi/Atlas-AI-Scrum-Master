import React, { useState, useEffect } from 'react';
import TaskBoard from '@src/components/tasks/TaskBoard.tsx';
import { taskService } from "@src/services/taskService.ts";

interface Task {
  id: string;
  title: string;
  status: string;
}

const TaskBoardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Hardcoded for now, will be dynamic later
        const projectId = 'some-project-id'; 
        const fetchedTasks = await taskService.getTasks(projectId);
        setTasks(fetchedTasks);
      } catch (err) {
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Task Board</h1>
      <TaskBoard tasks={tasks} />
    </div>
  );
};

export default TaskBoardPage;
