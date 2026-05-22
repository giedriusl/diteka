import type React from "react"

interface EffortlessIntegrationProps {
  width?: number | string
  height?: number | string
  className?: string
}

const EffortlessIntegration: React.FC<EffortlessIntegrationProps> = ({ width = 482, height = 300, className = "" }) => {
  const centerX = 250
  const centerY = 179

  const getPositionOnRing = (ringRadius: number, angle: number) => ({
    x: centerX + ringRadius * Math.cos(angle),
    y: centerY + ringRadius * Math.sin(angle),
  })

  return (
    <div
      className={className}
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 20%, transparent 80%, rgba(255,255,255,0.1) 100%)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Rings */}
      {[320, 240, 160].map((size, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            border: `1px solid rgba(55, 50, 47, ${0.2 + i * 0.05})`,
            opacity: 0.8 - i * 0.1,
          }}
        />
      ))}

      <div
        style={{
          width: "500px",
          height: "358px",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          position: "absolute",
        }}
      >
        {/* Central hub — Diteka "D" */}
        <div
          style={{
            width: "72px",
            height: "72px",
            left: `${centerX - 36}px`,
            top: `${centerY - 36}px`,
            position: "absolute",
            background: "#37322f",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "99px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "32px",
            color: "#ffffff",
          }}
        >
          D
        </div>

        {/* GitHub */}
        <div
          style={{
            width: "32px",
            height: "32px",
            left: `${getPositionOnRing(80, Math.PI).x - 16}px`,
            top: `${getPositionOnRing(80, Math.PI).y - 16}px`,
            position: "absolute",
            background: "#000000",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg"
            alt="GitHub"
            style={{ width: "18px", height: "18px", filter: "brightness(0) invert(1)" }}
          />
        </div>

        {/* Slack */}
        <div
          style={{
            width: "32px",
            height: "32px",
            left: `${getPositionOnRing(80, 0).x - 16}px`,
            top: `${getPositionOnRing(80, 0).y - 16}px`,
            position: "absolute",
            background: "#ffffff",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/slack.svg"
            alt="Slack"
            style={{ width: "18px", height: "18px" }}
          />
        </div>

        {/* Figma */}
        <div
          style={{
            width: "32px",
            height: "32px",
            left: `${getPositionOnRing(120, -Math.PI / 4).x - 16}px`,
            top: `${getPositionOnRing(120, -Math.PI / 4).y - 16}px`,
            position: "absolute",
            background: "#EEEFE8",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/figma.svg"
            alt="Figma"
            style={{ width: "16px", height: "16px" }}
          />
        </div>

        {/* Discord */}
        <div
          style={{
            width: "32px",
            height: "32px",
            left: `${getPositionOnRing(120, (3 * Math.PI) / 4).x - 16}px`,
            top: `${getPositionOnRing(120, (3 * Math.PI) / 4).y - 16}px`,
            position: "absolute",
            background: "#5865F2",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/discord.svg"
            alt="Discord"
            style={{ width: "18px", height: "18px", filter: "brightness(0) invert(1)" }}
          />
        </div>

        {/* Notion */}
        <div
          style={{
            width: "32px",
            height: "32px",
            left: `${getPositionOnRing(120, (5 * Math.PI) / 4).x - 16}px`,
            top: `${getPositionOnRing(120, (5 * Math.PI) / 4).y - 16}px`,
            position: "absolute",
            background: "#ffffff",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/notion.svg"
            alt="Notion"
            style={{ width: "18px", height: "18px" }}
          />
        </div>

        {/* Stripe */}
        <div
          style={{
            width: "32px",
            height: "32px",
            left: `${getPositionOnRing(160, Math.PI).x - 16}px`,
            top: `${getPositionOnRing(160, Math.PI).y - 16}px`,
            position: "absolute",
            background: "#635BFF",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/stripe.svg"
            alt="Stripe"
            style={{ width: "18px", height: "18px", filter: "brightness(0) invert(1)" }}
          />
        </div>

        {/* Framer */}
        <div
          style={{
            width: "32px",
            height: "32px",
            left: `${getPositionOnRing(160, 0).x - 16}px`,
            top: `${getPositionOnRing(160, 0).y - 16}px`,
            position: "absolute",
            background: "#000000",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/framer.svg"
            alt="Framer"
            style={{ width: "16px", height: "16px", filter: "brightness(0) invert(1)" }}
          />
        </div>

        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(55, 50, 47, 0.1)" />
              <stop offset="50%" stopColor="rgba(55, 50, 47, 0.05)" />
              <stop offset="100%" stopColor="rgba(55, 50, 47, 0.1)" />
            </linearGradient>
          </defs>
          {[
            [centerX, centerY, getPositionOnRing(80, 0).x, getPositionOnRing(80, 0).y, "0.2"],
            [centerX, centerY, getPositionOnRing(80, Math.PI).x, getPositionOnRing(80, Math.PI).y, "0.2"],
            [centerX, centerY, getPositionOnRing(120, -Math.PI / 4).x, getPositionOnRing(120, -Math.PI / 4).y, "0.15"],
            [centerX, centerY, getPositionOnRing(120, (3 * Math.PI) / 4).x, getPositionOnRing(120, (3 * Math.PI) / 4).y, "0.15"],
            [centerX, centerY, getPositionOnRing(120, (5 * Math.PI) / 4).x, getPositionOnRing(120, (5 * Math.PI) / 4).y, "0.15"],
            [centerX, centerY, getPositionOnRing(160, 0).x, getPositionOnRing(160, 0).y, "0.1"],
            [centerX, centerY, getPositionOnRing(160, Math.PI).x, getPositionOnRing(160, Math.PI).y, "0.1"],
          ].map(([x1, y1, x2, y2, opacity], i) => (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#connectionGradient)"
              strokeWidth="1"
              opacity={opacity}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}

export default EffortlessIntegration
