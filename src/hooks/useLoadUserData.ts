import { useEffect, useState } from "react"
import useGetUserInfo from "./useGetUserInfo"
import { useRequest } from "ahooks"
import { getUserInfoService } from "../services/user"
import { useDispatch } from "react-redux"
import { loginReducer } from "../store/userReducer"

function useLoadUserData() {
  const dispatch = useDispatch()
  const [waitingUserData, setWaitingUserData] = useState(true)

  const { run } = useRequest(getUserInfoService, {
    manual: true,
    onSuccess(result) {
      const { username, nickname } = result
      dispatch(loginReducer({ username, nickname })) //存储到redux
    },
    onFinally() {
      setWaitingUserData(false)
    },
  })

  //判断当前redux是否存在用户信息
  const { username } = useGetUserInfo()
  useEffect(() => {
    if (username) {
      setWaitingUserData(false) //如果有，就不用加载
      return
    }
    run() //没有就加载
  }, [username])

  return { waitingUserData }
}

export default useLoadUserData
