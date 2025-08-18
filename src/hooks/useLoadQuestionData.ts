// import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getQuesionService } from "../services/question"
import { useRequest } from "ahooks"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { resetComponents } from "../store/componentsReducer"
import { resetPageInfo } from "../store/pageInfoReducer"

function useLoadQuestionData() {
  const { id = "" } = useParams()
  const dispatch = useDispatch()

  //ajax加载
  const { data, loading, run, error } = useRequest(
    async (id: string) => {
      if (!id) throw new Error("没有问卷id")
      const data = await getQuesionService(id)
      return data
    },
    {
      manual: true,
    }
  )

  //根据获取的Data 设置redux store
  useEffect(() => {
    if (!data) return

    const {
      title = "",
      desc = "",
      js = "",
      css = "",
      isPublished = false,
      componentList = [],
    } = data

    // 获取默认的selectedId
    let selectedId = ""
    if (componentList.length > 0) {
      selectedId = componentList[0].fe_id
    }

    //把componentList 存储到redux store
    dispatch(resetComponents({ componentList, selectedId: selectedId, copiedComponent: null }))

    //把pageInfo存储到redux
    dispatch(resetPageInfo({ title, desc, js, css, isPublished }))
  }, [data])

  //判断id变化，执行ajax加载数据
  useEffect(() => {
    run(id)
  }, [id])

  return { loading, error }
}

export default useLoadQuestionData
