import React, { ChangeEvent, FC, useEffect, useState } from "react"
import { Input } from "antd"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import { LIST_SEARCH_PARAM_KEY } from "../constant/index"

const { Search } = Input

const ListSearch: FC = () => {
  const nav = useNavigate()
  const { pathname } = useLocation()

  const [value, setValue] = useState("")

  function handleChange(evenet: ChangeEvent<HTMLInputElement>) {
    setValue(evenet.target.value)
  }

  //获取url参数，设置到input
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const curVal = searchParams.get(LIST_SEARCH_PARAM_KEY) || ""
    setValue(curVal)
  }, [searchParams])

  function handleSearch(value: string) {
    //跳转页面，增加url参数
    nav({
      pathname,
      search: `${LIST_SEARCH_PARAM_KEY}=${value}`,
    })
  }

  return (
    <Search
      size="large"
      allowClear
      placeholder="输入关键字"
      value={value}
      onSearch={handleSearch}
      style={{ width: "250px" }}
      onChange={handleChange}
    />
  )
}

export default ListSearch
