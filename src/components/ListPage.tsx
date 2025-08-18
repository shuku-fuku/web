import React, { FC, useEffect, useState } from "react"
import { Pagination } from "antd"
import { useSearchParams, useNavigate, useLocation } from "react-router-dom"
import { LIST_PAGE_SIZE, LIST_PAGE_PARAM_KEY, LIST_PAGE_SIZE_PARAM_KEY } from "../constant"

type PropsType = {
  total: number
}

const ListPage: FC<PropsType> = props => {
  const { total } = props
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(LIST_PAGE_SIZE)

  const [searchParams] = useSearchParams()

  useEffect(() => {
    const page = parseInt(searchParams.get(LIST_PAGE_PARAM_KEY) || "") || 1
    const pageSize = parseInt(searchParams.get(LIST_PAGE_SIZE_PARAM_KEY) || "") || LIST_PAGE_SIZE
    setCurrent(page)
    setPageSize(pageSize)
  }, [searchParams])

  //当page pageSize 改变时，挑转页面
  const nav = useNavigate()
  const { pathname } = useLocation()
  function handlePageChange(page: number, pageSize: number) {
    searchParams.set(LIST_PAGE_PARAM_KEY, page.toString())
    searchParams.set(LIST_PAGE_SIZE_PARAM_KEY, pageSize.toString())

    nav({
      pathname,
      search: searchParams.toString(),
    })
  }
  return (
    <Pagination
      align="center"
      current={current}
      pageSize={pageSize}
      total={total}
      onChange={handlePageChange}
    />
  )
}

export default ListPage
