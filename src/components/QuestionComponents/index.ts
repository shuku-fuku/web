import { FC } from "react"
import QuestionInputConf, { QuestionInputPropsType } from "./QuestionInput"
import QuestionTitleConf, { QuestionTitlePropsType } from "./QuestionTitle"
import QuestionParagraphConf, { QuestionParagraphPropsType } from "./QuestionParagraph"
import QuestionInfoConf, { QuestionInfoPropsType } from "./QuesionInfo"
import QuestionTextareaConf, { QuestionTextareaPropsType } from "./QuestionTextarea"
import QuestionRadioConf, {
  QuestionRadioPropsType,
  QuestionRadioStatPropsType,
} from "./QuestionRadio"
import QuestionCheckboxConf, {
  QuestionCheckboxPropsType,
  QuestionCheckboxStatPropsType,
} from "./QuestionCheckbox"

//统一各个组件的prop type
export type ComponentPropsType = QuestionInputPropsType &
  QuestionTitlePropsType &
  QuestionParagraphPropsType &
  QuestionInfoPropsType &
  QuestionTextareaPropsType &
  QuestionRadioPropsType &
  QuestionCheckboxPropsType

//统一各个组件的统计属性
type ComponentStatProps = QuestionRadioStatPropsType & QuestionCheckboxStatPropsType

//组件的配置
export type ComponentConfType = {
  title: string
  type: string
  Component: FC<ComponentPropsType>
  PropComponent: FC<ComponentPropsType>
  defaultProps: ComponentPropsType
  StatComponent?: FC<ComponentStatProps>
}

//全部组件配置的列表
const componentConfList: ComponentConfType[] = [
  QuestionInputConf,
  QuestionTitleConf,
  QuestionParagraphConf,
  QuestionInfoConf,
  QuestionTextareaConf,
  QuestionRadioConf,
  QuestionCheckboxConf,
]

//组件分组
export const componentConfGroup = [
  {
    groupId: "textGroup",
    groupName: "文本显示",
    components: [QuestionInfoConf, QuestionInputConf, QuestionParagraphConf],
  },
  {
    groupId: "inputGroup",
    groupName: "用户输入",
    components: [QuestionTitleConf, QuestionTextareaConf],
  },
  {
    groupId: "chooseGroup",
    groupName: "用户选择",
    components: [QuestionRadioConf, QuestionCheckboxConf],
  },
]

export function getComponentConfByType(type: string) {
  return componentConfList.find(c => c.type === type)
}
