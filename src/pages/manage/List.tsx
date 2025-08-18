import React, { FC, useEffect, useState, useRef, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { useTitle, useDebounceFn, useRequest } from "ahooks"
import { Typography, Spin, Empty } from "antd"
import styles from "./common.module.scss"
import QuestionCard from "../../components/QuestionCard"
import ListSearch from "../../components/ListSearch"
import { getQuestionListService } from "../../services/question"
import { LIST_PAGE_SIZE, LIST_SEARCH_PARAM_KEY } from "../../constant"

const { Title } = Typography

const List: FC = () => {
  useTitle("小慕问卷-我的问卷")

  const [started, setStarted] = useState(false)
  const [page, setPage] = useState(1)
  const [list, setList] = useState([]) //全部的列表数据
  const [total, setTotle] = useState(0)
  const haveMoreData = total > list.length

  const [searchParams] = useSearchParams()
  const keyword = searchParams.get(LIST_SEARCH_PARAM_KEY) || ""

  //keyword变化时，重置信息
  useEffect(() => {
    setStarted(false)
    setPage(1)
    setList([])
    setTotle(0)
  }, [keyword])

  //真正加载
  const { run: load, loading } = useRequest(
    async () => {
      const data = await getQuestionListService({
        page,
        pageSize: LIST_PAGE_SIZE,
        keyword,
      })
      return data
    },
    {
      manual: true,
      onSuccess(result) {
        const { list: l = [], total = 0 } = result
        setList(list.concat(l))
        setTotle(total)
        setPage(page + 1)
      },
    }
  )

  //防抖 触发加载
  const containerRef = useRef<HTMLDivElement>(null)
  const { run: tryLoadMore } = useDebounceFn(
    () => {
      const elem = containerRef.current
      if (elem == null) return

      const domRect = elem.getBoundingClientRect()
      if (domRect == null) return
      const { bottom } = domRect
      if (bottom <= document.body.clientHeight) {
        load() //真正加载数据
        setStarted(true)
      }
    },
    { wait: 1000 }
  )

  //1.当页面加载或者url参数变化时 加载
  useEffect(() => {
    tryLoadMore()
  }, [searchParams])

  //2.当页面滚动时，触发加载
  useEffect(() => {
    if (haveMoreData) {
      window.addEventListener("scroll", tryLoadMore)
    }

    return () => {
      window.removeEventListener("scroll", tryLoadMore)
    }
  }, [searchParams, haveMoreData])

  // const [searchParams] = useSearchParams()
  // console.log("keyword", searchParams.get("keyword"))

  // const [list, setList] = useState([])
  // const [total, setTotle] = useState(0)
  // useEffect(() => {
  //   async function load() {
  //     const data = await getQuestionListService()
  //     const { list = [], total = 0 } = data
  //     setList(list)
  //     setTotle(total)
  //   }
  //   load()
  // }, [])

  const LoadMoreContentElem = useMemo(() => {
    if (!started || loading) return <Spin />
    if (total === 0) return <Empty description="暂无数据" />
    if (!haveMoreData) return <span>没有更多了</span>
    return <span>开始加载下一页</span>
  }, [started, loading, haveMoreData])

  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title level={3}>我的问卷</Title>
        </div>
        <div className={styles.right}>
          <ListSearch />
        </div>
      </div>
      <div className={styles.content}>
        {/* 问卷列表 */}
        {list.length > 0 &&
          list.map((q: any) => {
            const { _id } = q

            return <QuestionCard key={_id} {...q} />
          })}
      </div>
      <div className={styles.footer}>
        <div ref={containerRef}>{LoadMoreContentElem}</div>
      </div>
    </>
  )
}
export default List
