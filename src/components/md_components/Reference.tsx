import React, { isValidElement } from "react";

export interface Props {
  children: React.ReactNode;
}

type ResolverMap = Map<
  string | React.JSXElementConstructor<any>,
  (props: any) => string
>;

function reactToText(
  node: React.ReactNode | object,
  resolvers?: ResolverMap
): string {
  if (
    typeof node === "string" ||
    typeof node === "number" ||
    typeof node === "boolean"
  ) {
    return node.toString();
  }
  if (!node) {
    return "";
  }
  if (Array.isArray(node)) {
    return node.map((entry) => reactToText(entry, resolvers)).join("");
  }

  const [nodeType, nodeProps] = isValidElement(node)
    ? [node.type, node.props]
    : [null, null];
  // check if custom resolver is available
  if (nodeType && resolvers?.has(nodeType)) {
    const resolver = resolvers.get(nodeType)!;
    return resolver(nodeProps);
  }

  // Because ReactNode includes {} in its union we need to jump through a few hoops.
  const props: { children?: React.ReactNode } = (node as any).props
    ? (node as any).props
    : {};

  if (!props || !props.children) {
    return "";
  }

  return reactToText(props.children, resolvers);
}

export default function Reference(props: Props) {
  return (
    <div
      className="pl-6 -indent-6 max-w-[90ch] break-words overflow-hidden text-justify"
      style={{
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        marginInline: "auto",
      }}
    >
      {props.children}
    </div>
  );
}
