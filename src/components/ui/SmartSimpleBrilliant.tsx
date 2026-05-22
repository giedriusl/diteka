import type React from "react"

interface SmartSimpleBrilliantProps {
  width?: number | string
  height?: number | string
  className?: string
  theme?: "light" | "dark"
}

const videoIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 24 24' fill='white'%3E%3Cpolygon points='23 7 16 12 23 17 23 7'/%3E%3Crect x='1' y='5' width='15' height='14' rx='2' ry='2'/%3E%3C/svg%3E"

const SmartSimpleBrilliant: React.FC<SmartSimpleBrilliantProps> = ({
  width = 482,
  height = 300,
  className = "",
  theme = "dark",
}) => {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        position: "relative",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      } as React.CSSProperties}
      role="img"
      aria-label="Two calendar cards with colored event rows"
    >
      <div
        style={{
          position: "relative",
          width: "295.297px",
          height: "212.272px",
          transform: "scale(1.2)",
        }}
      >
        {/* Left tilted card */}
        <div style={{ position: "absolute", left: "123.248px", top: "0px", width: 0, height: 0 }}>
          <div style={{ transform: "rotate(5deg)", transformOrigin: "center" }}>
            <div
              style={{
                width: "155.25px",
                background: "#ffffff",
                borderRadius: "9px",
                padding: "6px",
                boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.07)",
              }}
            >
              {/* Amber event */}
              <div
                style={{
                  width: "100%",
                  height: "51px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  background: "rgba(245,158,11,0.1)",
                  display: "flex",
                }}
              >
                <div style={{ width: "2.25px", background: "#F59E0B" }} />
                <div style={{ padding: "4.5px", width: "100%" }}>
                  <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px", color: "#92400E" }}>2:00</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px", color: "#92400E" }}>PM</span>
                    <div style={{ background: "#92400E", padding: "1.5px", borderRadius: "100px" }}>
                      <div style={{ width: "8px", height: "8px", overflow: "hidden", position: "relative" }}>
                        <img src={videoIcon} alt="video" style={{ position: "absolute", inset: "20% 10% 20% 10%" }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "9px", color: "#92400E" }}>
                    AI strategijos aptarimas
                  </div>
                </div>
              </div>

              {/* Sky event */}
              <div
                style={{
                  width: "100%",
                  height: "79.5px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  background: "rgba(14,165,233,0.1)",
                  marginTop: "3px",
                  display: "flex",
                }}
              >
                <div style={{ width: "2.25px", background: "#0EA5E9" }} />
                <div style={{ padding: "4.5px", width: "100%" }}>
                  <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px", color: "#0C4A6E" }}>2:00</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px", color: "#0C4A6E" }}>PM</span>
                    <div style={{ background: "#0C4A6E", padding: "1.5px", borderRadius: "100px" }}>
                      <div style={{ width: "8px", height: "8px", overflow: "hidden", position: "relative" }}>
                        <img src={videoIcon} alt="video" style={{ position: "absolute", inset: "20% 10% 20% 10%" }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "9px", color: "#0C4A6E" }}>
                    AI diegimo peržiūra
                  </div>
                </div>
              </div>

              {/* Emerald event */}
              <div
                style={{
                  width: "100%",
                  height: "51px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  background: "rgba(16,185,129,0.1)",
                  marginTop: "3px",
                  display: "flex",
                }}
              >
                <div style={{ width: "2.25px", background: "#10B981" }} />
                <div style={{ padding: "4.5px", width: "100%" }}>
                  <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px", color: "#064E3B" }}>9:00</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px", color: "#064E3B" }}>AM</span>
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "9px", color: "#064E3B" }}>
                    Komandos mokymai...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right card */}
        <div style={{ position: "absolute", left: "0px", top: "6.075px", width: "155.25px" }}>
          <div style={{ transform: "rotate(-5deg)", transformOrigin: "center" }}>
            <div
              style={{
                width: "155.25px",
                background: "#ffffff",
                borderRadius: "9px",
                padding: "6px",
                boxShadow: "-8px 6px 11.3px rgba(0,0,0,0.12), 0px 0px 0px 1px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.06)",
              }}
            >
              {/* Violet event */}
              <div
                style={{
                  width: "100%",
                  height: "51px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  background: "rgba(139,92,246,0.1)",
                  display: "flex",
                }}
              >
                <div style={{ width: "2.25px", background: "#8B5CF6" }} />
                <div style={{ padding: "4.5px", width: "100%" }}>
                  <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px", color: "#581C87" }}>11:00</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px", color: "#581C87" }}>AM</span>
                    <div style={{ background: "#581C87", padding: "1.5px", borderRadius: "100px" }}>
                      <div style={{ width: "8px", height: "8px", overflow: "hidden", position: "relative" }}>
                        <img src={videoIcon} alt="video" style={{ position: "absolute", inset: "20% 10% 20% 10%" }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "9px", color: "#581C87" }}>
                    Audito pristatymas
                  </div>
                </div>
              </div>

              {/* Rose event */}
              <div
                style={{
                  width: "100%",
                  height: "51px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  background: "#FFE4E6",
                  display: "flex",
                  marginTop: "3px",
                }}
              >
                <div style={{ width: "2.25px", background: "#F43F5E" }} />
                <div style={{ padding: "4.5px", width: "100%" }}>
                  <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px", color: "#BE123C" }}>4:00</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px", color: "#BE123C" }}>PM</span>
                    <div style={{ background: "#BE123C", padding: "1.5px", borderRadius: "100px" }}>
                      <div style={{ width: "8px", height: "8px", overflow: "hidden", position: "relative" }}>
                        <img src={videoIcon} alt="video" style={{ position: "absolute", inset: "20% 10% 20% 10%" }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "9px", color: "#BE123C" }}>
                    🎯 Projektų apžvalga
                  </div>
                </div>
              </div>

              {/* Violet tall event */}
              <div
                style={{
                  width: "100%",
                  height: "79.5px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  background: "rgba(139,92,246,0.1)",
                  display: "flex",
                  marginTop: "3px",
                }}
              >
                <div style={{ width: "2.25px", background: "#8B5CF6" }} />
                <div style={{ padding: "4.5px", width: "100%" }}>
                  <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px", color: "#581C87" }}>11:00</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "9px", color: "#581C87" }}>AM</span>
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "9px", color: "#581C87" }}>
                    🚀 Naujo kliento onboarding!
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

export default SmartSimpleBrilliant
