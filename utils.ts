import { ISelectPickerData, ITask, ITrelloList } from "@/ifaces";

export const convertSecondToOutput = (task: ITask) => {
  let endTime = "";
  if (task.timeEnd !== -1) {
    let diffTime =
      task.timeEnd - (new Date().getTime() - task.dateCreate.getTime()) / 1000;
    if (diffTime < 0) {
      endTime += "-";
      diffTime = Math.abs(diffTime);
    }
    const days = Math.abs(~~(diffTime / 86400));
    const hours = Math.abs(~~((diffTime - days * 86400) / 3600));
    const minutes = Math.abs(~~((diffTime - days * 86400 - hours * 3600) / 60));
    const seconds = Math.abs(
      ~~(diffTime - days * 86400 - hours * 3600 - minutes * 60),
    );
    if (days > 0) {
      if (days < 10) {
        endTime += `0${days}:`;
      } else {
        endTime += `${days}:`;
      }
    }
    if (hours < 10) {
      endTime += `0${hours}:`;
    } else {
      endTime += `${hours}:`;
    }
    if (minutes < 10) {
      endTime += `0${minutes}:`;
    } else {
      endTime += `${minutes}:`;
    }
    if (seconds < 10) {
      endTime += `0${seconds}`;
    } else {
      endTime += String(seconds);
    }
  }
  return endTime;
};

export const convertTrelloData = (trelloList: ITrelloList) => {
  const selectData: ISelectPickerData[] = [];
  for (const trelloId of Object.keys(trelloList)) {
    selectData.push({
      label: trelloList[parseInt(trelloId)].trelloName,
      value: parseInt(trelloId),
    });
    for (const column of trelloList[parseInt(trelloId)].trello) {
      for (const task of column.tasks) {
        task.dateCreate = new Date(task.dateCreate);
      }
    }
  }
  selectData.push({ label: "Добавить", value: -1 });
  trelloList[-1] = {
    accessUsers: [],
    createdUser: -1,
    trello: [],
    trelloName: "",
  };
  return { trelloList, selectData };
};
