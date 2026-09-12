import React from "react"

export interface BadgeProps {
  children: React.ReactNode
  color?: "primary" | "success" | "warning" | "error" | "secondary" | "default"
  variant?: "flat" | "solid"
  size?: "sm" | "md" | "lg"
  style?: React.CSSProperties
}

const colorMap = {
  primary: { bg: "rgba(0, 114, 245, 0.15)", color: "#0072F5", border: "1px solid rgba(0, 114, 245, 0.3)" },
  success: { bg: "rgba(23, 201, 100, 0.15)", color: "#17C964", border: "1px solid rgba(23, 201, 100, 0.3)" },
  warning: { bg: "rgba(245, 165, 36, 0.15)", color: "#F5A524", border: "1px solid rgba(245, 165, 36, 0.3)" },
  error: { bg: "rgba(243, 18, 96, 0.15)", color: "#F31260", border: "1px solid rgba(243, 18, 96, 0.3)" },
  secondary: { bg: "rgba(147, 51, 234, 0.15)", color: "#A855F7", border: "1px solid rgba(147, 51, 234, 0.3)" },
  default: { bg: "rgba(255, 255, 255, 0.1)", color: "#E0E0E0", border: "1px solid rgba(255, 255, 255, 0.15)" },
}

const sizeMap = {
  sm: { fontSize: "0.75rem", padding: "2px 8px" },
  md: { fontSize: "0.85rem", padding: "4px 10px" },
  lg: { fontSize: "0.95rem", padding: "6px 14px" },
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = "default",
  size = "sm",
  style,
}) => {
  const c = colorMap[color] || colorMap.default
  const s = sizeMap[size] || sizeMap.sm

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "9999px",
        fontWeight: 600,
        backgroundColor: c.bg,
        color: c.color,
        border: c.border,
        fontSize: s.fontSize,
        padding: s.padding,
        lineHeight: 1.2,
        letterSpacing: "0.02em",
        ...style,
      }}
    >
      {children}
    </span>
  )
}

export default Badge
