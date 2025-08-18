import { ComponentInfoType, ComponentsStateType } from "."

export function getNextSelectedId(fe_id: string, componentList: ComponentInfoType[]) {
  const visibleComponentList = componentList.filter(c => !c.isHidden)

  const index = visibleComponentList.findIndex(c => c.fe_id === fe_id)
  if (index < 0) return ""

  //重新计算SelectedId
  let newSelectedId = ""
  const length = visibleComponentList.length
  if (length <= 1) {
    newSelectedId = ""
  } else {
    if (index + 1 === length) {
      //删除最后一个,选中上一个
      newSelectedId = visibleComponentList[index - 1].fe_id
    } else {
      //不是最后一个，选上一个
      newSelectedId = visibleComponentList[index + 1].fe_id
    }
  }

  return newSelectedId
}

//插入新组件
export function insertNewComponent(draft: ComponentsStateType, newComponent: ComponentInfoType) {
  const { selectedId, componentList } = draft
  const index = componentList.findIndex(c => c.fe_id === selectedId)

  if (index < 0) {
    //未选中任何组件
    draft.componentList.push(newComponent)
  } else {
    //选中了组件，插入到index后面
    draft.componentList.splice(index + 1, 0, newComponent)
  }

  draft.selectedId = newComponent.fe_id
}
