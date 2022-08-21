import { useMixture } from "src/mixture"


export function Tag(props: any) {
  const { openTag } = useMixture()
  const safeValue = encodeURI(props.value)
  const url = `#${safeValue}`
  const clickHandler = (event: any) => {
    const trigger: HTMLElement = event.target

    event.preventDefault()
    openTag(trigger.getAttribute("href")!)
  }

  return (
    <a
      href={url}
      data-href={url}
      onClick={clickHandler}
      class="tag"
      part={`tag ${safeValue}`}
      target="_blank"
      rel="noopener"
    >{props.value}</a>
  )
}
