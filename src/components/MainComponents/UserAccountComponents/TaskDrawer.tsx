// src/components/UserAccount/TasksDrawer.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { FaTasks } from "react-icons/fa";
import UserAccCard from '@/components/ui/UserAccCard';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const TasksDrawer: React.FC = observer(() => {
  return (
    <Drawer>
      <DrawerTrigger asChild style={{ width: "100%" }}>
        <div>
          <UserAccCard
            title="Tasks"
            icon={<FaTasks />}
            description="Complete tasks and get rewards"
          />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Tasks</DrawerTitle>
          <DrawerDescription>
            Complete tasks to earn rewards and improve your ranking.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
});

export default TasksDrawer;
