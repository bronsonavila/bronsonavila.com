declare module '*.svg' {
  import { SVGProps } from 'react'
  export const SVG: React.FC<SVGProps<SVGSVGElement>>
  const src: string
  export default src
}
