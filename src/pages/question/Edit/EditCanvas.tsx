import React, { FC, MouseEvent } from "react"
import styles from "./EditCanvas.module.scss"
// import QuestionTitle from "../../../components/QuestionComponents/QuestionTitle/Component"
// import QuestionInput from "../../../components/QuestionComponents/QuestionInput/Component"
import classNames from "classnames"
import { Spin } from "antd"
import useGetComponentInfo from "../../../hooks/useGetComponentInfo"
import { getComponentConfByType } from "../../../components/QuestionComponents"
import {
  ComponentInfoType,
  changeSelectedId,
  moveComponent,
} from "../../../store/componentsReducer"
import { useDispatch } from "react-redux"
import SortableContainer from "../../../components/DragSortable/SortableContainer"
import SortableItem from "../../../components/DragSortable/SortableItem"
import useBindCanvasKeyPress from "../../../hooks/useBindCanvasKeyPress"

type PropsType = {
  loading: boolean
}

function genComponent(componentInfo: ComponentInfoType) {
  const { type, props } = componentInfo

  const componentConf = getComponentConfByType(type)
  if (componentConf == null) return null

  const { Component } = componentConf
  return <Component {...props} />
}

const EditCanvas: FC<PropsType> = ({ loading }) => {
  const { componentList, selectedId } = useGetComponentInfo()
  const dispatch = useDispatch()

  function handleClick(event: MouseEvent, id: string) {
    event.stopPropagation() //阻止冒泡
    dispatch(changeSelectedId(id))
  }

  useBindCanvasKeyPress()

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <Spin />
      </div>
    )
  }

  const componentListWithId = componentList.map(c => {
    return { ...c, id: c.fe_id }
  })

  function handleDragEnd(oldIndex: number, newIndex: number) {
    dispatch(moveComponent({ oldIndex, newIndex }))
  }

  return (
    <SortableContainer items={componentListWithId} onDragEnd={handleDragEnd}>
      <div className={styles.canvas}>
        {componentList
          .filter(c => !c.isHidden)
          .map(c => {
            const { fe_id, isLocked } = c

            //拼接class name
            const wrapperDefaultClassName = styles["component-wrapper"]
            const selectedClassName = styles.selected
            const lockedClassName = styles.locked
            const wrapperClassName = classNames({
              [wrapperDefaultClassName]: true,
              [selectedClassName]: fe_id === selectedId,
              [lockedClassName]: isLocked,
            })

            return (
              <SortableItem key={fe_id} id={fe_id}>
                <div key={fe_id} className={wrapperClassName} onClick={e => handleClick(e, fe_id)}>
                  <div className={styles.component}>{genComponent(c)}</div>
                </div>
              </SortableItem>
            )
          })}
        {/* <div className={styles["component-wrapper"]}>
        <div className={styles.component}>
          <QuestionTitle />
        </div>
      </div>
      <div className={styles["component-wrapper"]}>
        <div className={styles.component}>
          <QuestionInput />
        </div>
      </div> */}
      </div>
    </SortableContainer>
  )
}

export default EditCanvas
