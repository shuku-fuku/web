import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit"
import { ComponentPropsType } from "../../components/QuestionComponents"
import { produce } from "immer"
import { arrayMove } from "@dnd-kit/sortable"
import cloneDeep from "lodash.clonedeep"
import { getNextSelectedId, insertNewComponent } from "./utils"

export type ComponentInfoType = {
  fe_id: string //todo
  type: string
  title: string
  isHidden?: boolean
  isLocked?: boolean
  props: ComponentPropsType
}

export type ComponentsStateType = {
  selectedId: string
  componentList: Array<ComponentInfoType>
  copiedComponent: ComponentInfoType | null
}

const ININ_STATE: ComponentsStateType = {
  selectedId: "",
  componentList: [],
  copiedComponent: null,
  //其他扩展
}

export const componentsSlice = createSlice({
  name: "components",
  initialState: ININ_STATE,
  reducers: {
    //重置所有组件
    resetComponents: (state: ComponentsStateType, action: PayloadAction<ComponentsStateType>) => {
      return action.payload
    },

    // 修改selectedId
    changeSelectedId: produce((draft: ComponentsStateType, action: PayloadAction<string>) => {
      draft.selectedId = action.payload
    }),

    //添加新组件
    addComponent: produce(
      (draft: ComponentsStateType, action: PayloadAction<ComponentInfoType>) => {
        insertNewComponent(draft, action.payload)
      }
    ),

    //修改组件属性prop
    changeComponentProps: produce(
      (
        draft: ComponentsStateType,
        action: PayloadAction<{ fe_id: string; newProps: ComponentPropsType }>
      ) => {
        const { fe_id, newProps } = action.payload

        const curComp = draft.componentList.find(c => c.fe_id === fe_id)
        if (curComp) {
          curComp.props = {
            ...curComp.props,
            ...newProps,
          }
        }
      }
    ),

    //删除选中的组件
    removeSelectedComponent: produce((draft: ComponentsStateType) => {
      const { componentList = [], selectedId: removedId } = draft

      //重新计算selectedId
      const newSelectedId = getNextSelectedId(removedId, componentList)
      draft.selectedId = newSelectedId

      const index = componentList.findIndex(c => c.fe_id === removedId)
      componentList.splice(index, 1)
    }),

    //隐藏/显示 组件
    changeComponentHidden: produce(
      (draft: ComponentsStateType, action: PayloadAction<{ fe_id: string; isHidden: boolean }>) => {
        const { componentList = [] } = draft
        const { fe_id, isHidden } = action.payload

        //重新计算selectedId
        let newSelectedId = ""

        if (isHidden) {
          //要隐藏
          newSelectedId = getNextSelectedId(fe_id, componentList)
        } else {
          //要显示
          newSelectedId = fe_id
        }
        draft.selectedId = newSelectedId

        const curComp = componentList.find(c => c.fe_id === fe_id)
        if (curComp) {
          curComp.isHidden = isHidden
        }
      }
    ),

    // 锁定/解锁组件
    toggleComponentLocked: produce(
      (draft: ComponentsStateType, action: PayloadAction<{ fe_id: string }>) => {
        const { componentList = [] } = draft
        const { fe_id } = action.payload

        const curComp = componentList.find(c => c.fe_id === fe_id)
        if (curComp) {
          curComp.isLocked = !curComp.isLocked
        }
      }
    ),

    //复制当前选中的组件
    copySelectedComponent: produce((draft: ComponentsStateType) => {
      const { selectedId, componentList = [] } = draft
      const selectedComponent = componentList.find(c => c.fe_id === selectedId)
      if (selectedComponent == null) return
      //深拷贝
      draft.copiedComponent = cloneDeep(selectedComponent)
    }),

    //粘贴组件
    pasteCopiedComponent: produce((draft: ComponentsStateType) => {
      const { copiedComponent } = draft
      if (copiedComponent == null) return

      //要把fe_id修改
      copiedComponent.fe_id = nanoid()

      //插入组件
      insertNewComponent(draft, copiedComponent)
    }),

    //选中上一个
    selectPrevComponent: produce((draft: ComponentsStateType) => {
      const { selectedId, componentList } = draft
      const selectedIndex = componentList.findIndex(c => c.fe_id === selectedId)
      if (selectedIndex < 0) return //未选中组件
      if (selectedIndex <= 0) return //已经选中了第一个

      draft.selectedId = componentList[selectedIndex - 1].fe_id
    }),

    //选中下一个
    selectNextComponent: produce((draft: ComponentsStateType) => {
      const { selectedId, componentList } = draft
      const selectedIndex = componentList.findIndex(c => c.fe_id === selectedId)
      if (selectedIndex < 0) return //未选中组件
      if (selectedIndex + 1 === componentList.length) return //已经选中了最后一个

      draft.selectedId = componentList[selectedIndex + 1].fe_id
    }),

    //修改组件标题
    changeComponentTitle: produce(
      (draft: ComponentsStateType, action: PayloadAction<{ fe_id: string; title: string }>) => {
        const { title, fe_id } = action.payload
        const curComp = draft.componentList.find(c => c.fe_id === fe_id)
        if (curComp) curComp.title = title
      }
    ),

    //移动组件位置
    moveComponent: produce(
      (
        draft: ComponentsStateType,
        action: PayloadAction<{ oldIndex: number; newIndex: number }>
      ) => {
        const { componentList: curComponentList } = draft
        const { oldIndex, newIndex } = action.payload

        draft.componentList = arrayMove(curComponentList, oldIndex, newIndex)
      }
    ),
  },
})

export const {
  resetComponents,
  changeSelectedId,
  addComponent,
  changeComponentProps,
  removeSelectedComponent,
  changeComponentHidden,
  toggleComponentLocked,
  copySelectedComponent,
  pasteCopiedComponent,
  selectPrevComponent,
  selectNextComponent,
  changeComponentTitle,
  moveComponent,
} = componentsSlice.actions

export default componentsSlice.reducer
