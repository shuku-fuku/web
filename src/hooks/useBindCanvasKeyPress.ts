import { useKeyPress } from "ahooks"
import {
  removeSelectedComponent,
  copySelectedComponent,
  pasteCopiedComponent,
  selectPrevComponent,
  selectNextComponent,
} from "../store/componentsReducer"
import { ActionCreators } from "redux-undo"
import { useDispatch } from "react-redux"

function isActiveElementValid() {
  const activeElem = document.activeElement
  //没有DND
  // if (activeElem === document.body) return true // 光标没有 focus 到 input

  //有dnd-kit
  if (activeElem === document.body) return true
  if (activeElem?.matches('div[role="button"]')) return true
  return false
}

function useBindCanvasKeyPress() {
  const dispatch = useDispatch()

  //删除组件
  useKeyPress(["backspace", "delete"], () => {
    if (!isActiveElementValid()) return
    dispatch(removeSelectedComponent())
  })

  //复制
  useKeyPress(["ctrl.c", "meta.c"], () => {
    if (!isActiveElementValid()) return
    dispatch(copySelectedComponent())
  })

  //粘贴
  useKeyPress(["ctrl.v", "meta.v"], () => {
    if (!isActiveElementValid()) return
    dispatch(pasteCopiedComponent())
  })

  //选中上一个
  useKeyPress(["uparrow"], () => {
    if (!isActiveElementValid()) return
    dispatch(selectPrevComponent())
  })

  //选中下一个
  useKeyPress(["downarrow"], () => {
    if (!isActiveElementValid()) return
    dispatch(selectNextComponent())
  })

  //撤销
  useKeyPress(
    ["ctrl.z", "meta.z"],
    () => {
      if (!isActiveElementValid()) return
      dispatch(ActionCreators.undo())
    },
    {
      exactMatch: true,
    }
  )

  //重做
  useKeyPress(["ctrl.shift.z", "meta.shift.z"], () => {
    if (!isActiveElementValid()) return
    dispatch(ActionCreators.redo())
  })
}

export default useBindCanvasKeyPress
