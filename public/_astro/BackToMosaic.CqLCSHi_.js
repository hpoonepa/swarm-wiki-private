import{j as r}from"./jsx-runtime.D3GSbgeI.js";import{r as i}from"./index.CJGH1T41.js";import"./index.yBjzXJbu.js";function f({targetId:t="education-mosaic",className:s=""}){const[a,o]=i.useState(!1);i.useEffect(()=>{const e=()=>{const n=document.getElementById(t);if(!n){o(!1);return}const l=n.getBoundingClientRect();o(l.bottom<=0)};return e(),window.addEventListener("scroll",e,{passive:!0}),window.addEventListener("resize",e),()=>{window.removeEventListener("scroll",e),window.removeEventListener("resize",e)}},[t]);const c=()=>{const e=document.getElementById(t);e&&e.scrollIntoView({behavior:"smooth",block:"start"})};return a?r.jsx("div",{className:`fixed z-[60] top-4 left-1/2 -translate-x-1/2 ${s}`,"aria-live":"polite",children:r.jsx("button",{onClick:c,className:`
          px-5 py-2 rounded-2xl font-semibold shadow-lg
          bg-gradient-to-r from-green-600 to-green-400
          text-white/95 hover:text-white
          opacity-90 hover:opacity-100 transition
          border border-white/20 backdrop-blur
        `,"aria-label":"Back to Education Mosaic",children:"↑ Back to Education Mosaic"})}):null}export{f as default};
