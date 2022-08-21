
export function ExternalLink(props: any) {
  return (
    <Link label={props.value} url={props.value} />
  )
}

export function isExternalLink(value: string): boolean {
  const url = tryUrl(value)

  return isUrl(url)
}

function isUrl(url: URL | string): boolean {
  const allowedProtocols = ['http:', 'https:', 'evernote:', 'zotero:']

  return (url instanceof URL && allowedProtocols.some(protocol => url.protocol == protocol))
}


export function tryUrl(value: string): URL | string {
  try {
    return new URL(value)
  } catch (_) {
    return value
  }
}

/**
 * Represents an external link.
 */
export function Link(props: LinkProps) {
  const label = props.label
  const url = props.url

  return (
    <a
      href={url}
      class="leaf link external-link"
      part="leaf link external-link"
      target="_blank"
      rel="noopener"
    >{label}</a>
  )
}

interface LinkProps {
  label: string;
  url: string;
}
