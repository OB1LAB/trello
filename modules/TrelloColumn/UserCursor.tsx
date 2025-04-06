import MousePointer from "@rsuite/icons/legacy/MousePointer";
import useTrelloStore from "@/modules/useTrelloStore/useTrelloStore";
import useUserStore from "@/modules/useUserStore/useUserStore";
import { useEffect, useState } from "react";

const colors = ["#55FF55", "#00AAAA", "#FF55FF", "#FFAA00"];

const UserCursor = () => {
  const [colorOffset, setColorOffset] = useState<number>(0);
  const userList = useUserStore((store) => store.userListId);
  const grabTask = useTrelloStore((store) => store.grabTask);
  useEffect(() => {
    if (!grabTask.isMove) {
      setColorOffset((colorOffset + 1) % colors.length);
    }
  }, [grabTask.isMove]);
  return (
    <>
      <MousePointer
        color={colors[colorOffset]}
        style={{
          zIndex: "200",
          top: `${grabTask.y}px`,
          left: `${grabTask.x}px`,
          position: grabTask.isMove ? "fixed" : "unset",
          display: grabTask.isMove ? "block" : "none",
        }}
      />
      <div
        style={{
          zIndex: "200",
          color: colors[colorOffset],
          top: `${grabTask.y - 20}px`,
          left: `${grabTask.x - 25}px`,
          position: grabTask.isMove ? "fixed" : "unset",
          display: grabTask.isMove ? "block" : "none",
        }}
      >
        {grabTask.isMove ? userList[grabTask.userId].label : ""}
      </div>
    </>
  );
};

export default UserCursor;
