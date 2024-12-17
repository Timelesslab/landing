import { i18nNodeContext } from '@i18n/context'
import type { I18nNode } from '@i18n/types'
import { For, useContext, type Component } from 'solid-js'

export const I18nNodeRenderer: Component<{
  node: I18nNode
}> = props => {
  if (typeof props.node === 'string') {
    return props.node
  }

  if (Array.isArray(props.node)) {
    return (
      <For each={props.node}>{node => <I18nNodeRenderer node={node} />}</For>
    )
  }

  const component = useContext(i18nNodeContext)?.[props.node.tag]

  if (component === undefined) {
    return <></>
  }

  return component({
    children: (
      <For each={props.node.children}>
        {node => <I18nNodeRenderer node={node} />}
      </For>
    ),
  })
}
