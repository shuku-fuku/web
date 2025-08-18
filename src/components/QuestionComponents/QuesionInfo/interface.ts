export type QuestionInfoPropsType = {
  title?: string
  desc?: string

  onChange?: (newProps: QuestionInfoPropsType) => void
  disabled?: boolean
}

export const QuestionInfoDefaultProps: QuestionInfoPropsType = {
  title: "问题描述",
  desc: "问卷描述",
}
