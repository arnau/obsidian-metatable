export function ParseError(props: { message: () => string }) {
  const message = props.message
  const error = () => {
    const [msg, ...trace] = message().split('\n').filter(line => line.length != 0)

    return { message: msg, trace: trace.join('\n') }
  }

  return (
    <div class="parse-error">
      <p>{error().message}</p>
      <pre>
        {error().trace}
      </pre>
    </div>
  )
}
