import React, { FC } from "react"
import { nanoid } from "nanoid"
import { Typography } from "antd"
import { useDispatch } from "react-redux"
import { componentConfGroup, ComponentConfType } from "../../../components/QuestionComponents"
import { addComponent } from "../../../store/componentsReducer"
import styles from "./ComponentLib.module.scss"

const { Title } = Typography

// 改成子组件，支持 Hooks
const ComponentItem: FC<ComponentConfType> = props => {
  const { title, type, Component, defaultProps } = props
  const dispatch = useDispatch()

  function handleClick() {
    dispatch(
      addComponent({
        fe_id: nanoid(),
        title,
        type,
        props: defaultProps,
      })
    )
  }

  return (
    <div className={styles.wrapper} onClick={handleClick}>
      <div className={styles.component}>
        <Component />
      </div>
    </div>
  )
}

const Lib: FC = () => {
  return (
    <>
      {componentConfGroup.map((group, index) => {
        const { groupId, groupName, components } = group
        return (
          <div key={groupId}>
            <Title level={3} style={{ fontSize: "16px", marginTop: index > 0 ? "20px" : "0" }}>
              {groupName}
            </Title>

            <div>
              {components.map(c => (
                <ComponentItem key={c.type} {...c} />
              ))}
            </div>
          </div>
        )
      })}
    </>
  )
}

export default Lib
