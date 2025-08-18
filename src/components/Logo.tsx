import React, { FC, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Space, Typography } from "antd"
import { FormOutlined } from "@ant-design/icons"
import styles from "./Logo.module.scss"
import useGetUserInfo from "../hooks/useGetUserInfo"
import { HOME_PATHNAME, MANAGE_INDEX_PATHNAME } from "../router"

const { Title } = Typography

const Logo: FC = () => {
  const { username } = useGetUserInfo()

  const [pathname, setPathname] = useState(HOME_PATHNAME)

  useEffect(() => {
    if (username) {
      setPathname(MANAGE_INDEX_PATHNAME)
    }
  }, [username])

  return (
    <div>
      <Link to={pathname}>
        <Space className={styles.container}>
          <Title>
            <FormOutlined />
          </Title>
          <Title>小慕问卷</Title>
        </Space>
      </Link>
    </div>
  )
}
export default Logo
