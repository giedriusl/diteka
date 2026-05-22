import type React from "react"

interface NumbersThatSpeakProps {
  width?: number | string
  height?: number | string
  className?: string
  theme?: "light" | "dark"
}

const NumbersThatSpeak: React.FC<NumbersThatSpeakProps> = ({
  width = 482,
  height = 300,
  className = "",
  theme = "light",
}) => {
  const themeVars = {
    "--nts-surface": "#ffffff",
    "--nts-text-primary": "#2f3037",
    "--nts-text-secondary": "rgba(47,48,55,0.8)",
    "--nts-text-muted": "rgba(55,50,47,0.7)",
    "--nts-border": "rgba(47,48,55,0.12)",
    "--nts-shadow": "rgba(47,48,55,0.06)",
  }

  const cardShadow = (scale: number) =>
    `0px 0px 0px ${0.587 * scale}px rgba(47,48,55,0.12), 0px ${1.174 * scale}px ${2.348 * scale}px -${0.587 * scale}px rgba(47,48,55,0.06), 0px ${1.761 * scale}px ${3.522 * scale}px -${0.88 * scale}px rgba(47,48,55,0.06)`

  return (
    <div
      className={className}
      style={
        {
          width,
          height,
          position: "relative",
          background: "transparent",
          ...themeVars,
        } as React.CSSProperties
      }
      role="img"
      aria-label="Financial dashboard showing invoiced revenue charts"
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: "calc(50% + 23.703px)",
        }}
      >
        {/* Back card */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translate(-50%, -50%)",
            top: "calc(50% - 19.427px)",
          }}
        >
          <div
            style={{
              width: "270px",
              height: "199.565px",
              background: "var(--nts-surface)",
              borderRadius: "4.696px",
              boxShadow: cardShadow(1),
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          />
        </div>

        {/* Middle card */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translate(-50%, -50%)",
            top: "calc(50% + 12.573px)",
          }}
        >
          <div
            style={{
              width: "330px",
              height: "243.913px",
              background: "var(--nts-surface)",
              borderRadius: "5.739px",
              boxShadow: cardShadow(1.2),
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          />
        </div>

        {/* Front card with full content */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translate(-50%, -50%)",
            top: "calc(50% + 33.573px)",
          }}
        >
          <div
            style={{
              width: "360px",
              height: "266.087px",
              background: "var(--nts-surface)",
              borderRadius: "6.261px",
              boxShadow: cardShadow(1.35),
              border: "1px solid rgba(0,0,0,0.08)",
              overflow: "hidden",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              padding: "18.783px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "37.565px", width: "100%", height: "100%", flexGrow: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "18.783px", width: "100%", height: "100%", flexGrow: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", flexGrow: 1 }}>
                  {/* Header */}
                  <div style={{ display: "flex", gap: "6.261px", alignItems: "flex-start", width: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6.261px" }}>
                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 600,
                          fontSize: "10.174px",
                          lineHeight: "18.783px",
                          color: "var(--nts-text-secondary)",
                        }}
                      >
                        Sutaupytas laikas
                      </div>
                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 500,
                          fontSize: "18.783px",
                          lineHeight: "20.348px",
                          letterSpacing: "-0.587px",
                          color: "var(--nts-text-primary)",
                        }}
                      >
                        248 val./mėn.
                      </div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "18.783px", width: "100%" }}>
                    <div style={{ height: "156.522px", position: "relative", width: "100%" }}>
                      <div style={{ position: "absolute", inset: 0, display: "flex", gap: "3.13px", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", flexGrow: 1, height: "100%", position: "relative" }}>
                          {/* Y-axis */}
                          <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "flex-start", justifyContent: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, alignItems: "center", justifyContent: "space-between", paddingRight: "7.826px" }}>
                              {["500", "300", "200", "100", "0"].map((label, i) => (
                                <div key={i} style={{ display: "flex", gap: "6.261px", height: "17.217px", alignItems: "center", paddingTop: "8.609px", paddingBottom: "8.609px", width: "100%" }}>
                                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "7.826px", color: "var(--nts-text-muted)", textAlign: "right", whiteSpace: "pre" }}>
                                    {label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Grid + x-axis */}
                          <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, height: "100%" }}>
                            <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "space-between", width: "100%" }}>
                              {[17.217, 13.304, 13.304, 13.304, 13.304, 13.304].map((h, i) => (
                                <div key={i} style={{ height: `${h}px`, width: "100%", display: "flex", alignItems: "center" }}>
                                  <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(0,0,0,0.05)" }} />
                                </div>
                              ))}
                            </div>
                            <div style={{ display: "flex", fontFamily: "'Inter', sans-serif", fontWeight: 500, alignItems: "center", justifyContent: "space-between", fontSize: "7.826px", paddingLeft: "6.261px", paddingRight: "6.261px", color: "var(--nts-text-muted)", width: "100%" }}>
                              <div>Sau 2024</div>
                              <div>Sau 2025</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bars */}
                      <div style={{ position: "absolute", bottom: "23.48px", right: 0, top: "12.52px", width: "295.043px", overflow: "hidden" }}>
                        <div style={{ position: "absolute", bottom: 0, left: "-1.56px", right: 0, top: 0, display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingLeft: "9.391px", paddingRight: "9.391px", overflow: "hidden" }}>
                          {[83, 108, 58, 89, 83, 89, 83, 95, 108, 76, 89].map((h, i) => (
                            <div key={i} style={{ width: "12.522px", height: `${h}px`, backgroundColor: "#5D4E37", borderRadius: "2px" }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NumbersThatSpeak
