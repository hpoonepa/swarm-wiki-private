import React from "react";
import "../styles/fonts.css";
import "../../static/home/navbar.js";

// The story homepage and all wiki layouts share the same translucent navigation.
export default function Nav({ className }: { className?: string }) {
  return React.createElement("swarm-nav", { class: className });
}
