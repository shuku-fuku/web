import React, { FC, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Typography, Spin, Table, Pagination } from "antd"
import { useRequest } from "ahooks"
import { getComponentStatService } from "../../../services/stat"
import { getComponentConfByType } from "../../../components/QuestionComponents"

const { Title } = Typography

type PropsType = {
  selectedComponentId: string
  selectedComponentType: string
}

const ChartStat: FC<PropsType> = props => {
  const { id = "" } = useParams()
  const { selectedComponentId, selectedComponentType } = props

  const [stat, setStat] = useState([])
  const { run } = useRequest(
    async (questionId, componentId) => {
      const data = await getComponentStatService(questionId, componentId)
      return data
    },
    {
      manual: true,
      onSuccess(res) {
        setStat(res.stat)
      },
    }
  )

  useEffect(() => {
    if (selectedComponentId) run(id, selectedComponentId)
  }, [selectedComponentId, id])

  //生成统计图表
  function genStatElem() {
    if (!selectedComponentId) return <div> 未选中组件</div>

    const { StatComponent } = getComponentConfByType(selectedComponentType) || {}
    if (StatComponent == null) return <div>该组件无统计图表</div>

    return <StatComponent stat={stat} />
  }

  return (
    <>
      <Title level={3}>图标统计</Title>
      <div>{genStatElem()}</div>
    </>
  )
}

export default ChartStat
